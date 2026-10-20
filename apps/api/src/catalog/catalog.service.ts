import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { SupabaseService } from '../supabase/supabase.service';
import { validateModelUpload } from './catalog.validation';

const PUBLIC_FIELDS =
  'id,name,description,category,format,polygons,imageUrl,file_size,created_at,owner_id';

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);
  private readonly bucket: string;

  constructor(
    private readonly supabase: SupabaseService,
    config: ConfigService,
  ) {
    this.bucket = config.get<string>('SUPABASE_BUCKET', 'models');
  }

  async findAll() {
    const { data, error } = await this.supabase
      .getClient()
      .from('models')
      .select(PUBLIC_FIELDS)
      .order('created_at', { ascending: false });
    if (error)
      throw new InternalServerErrorException(
        'Не удалось загрузить каталог. Проверьте SQL-схему.',
      );
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('models')
      .select(PUBLIC_FIELDS)
      .eq('id', id)
      .maybeSingle();
    if (error)
      throw new InternalServerErrorException('Не удалось загрузить модель.');
    if (!data) throw new NotFoundException('Модель не найдена.');
    return data;
  }

  private async findStoredModel(id: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('models')
      .select('id,owner_id,storage_path')
      .eq('id', id)
      .maybeSingle();
    if (error)
      throw new InternalServerErrorException('Не удалось загрузить модель.');
    if (!data) throw new NotFoundException('Модель не найдена.');
    return data;
  }

  async download(id: string) {
    const model = await this.findStoredModel(id);
    if (!model.storage_path)
      throw new NotFoundException('Файл модели пока не загружен.');
    const { data, error } = await this.supabase
      .getClient()
      .storage.from(this.bucket)
      .createSignedUrl(model.storage_path, 60, { download: true });
    if (error)
      throw new InternalServerErrorException('Не удалось подготовить файл.');
    return { url: data.signedUrl };
  }

  async create(
    file: Express.Multer.File,
    body: Record<string, unknown>,
    ownerId: string,
  ) {
    const metadata = validateModelUpload(file, body);
    const client = this.supabase.getClient();
    const id = randomUUID();
    const path = `${ownerId}/${id}.${metadata.format.toLowerCase()}`;
    const storage = client.storage.from(this.bucket);
    const { error: uploadError } = await storage.upload(path, file.buffer, {
      contentType: 'application/octet-stream',
      upsert: false,
    });
    if (uploadError)
      throw new InternalServerErrorException(
        'Не удалось загрузить файл в хранилище.',
      );
    const { data, error } = await client
      .from('models')
      .insert({
        id,
        ...metadata,
        owner_id: ownerId,
        storage_path: path,
        file_size: file.size,
      })
      .select(PUBLIC_FIELDS)
      .single();
    if (error) {
      const { error: cleanupError } = await storage.remove([path]);
      if (cleanupError)
        this.logger.error(
          `Не удалось очистить файл ${path} после ошибки записи.`,
        );
      throw new InternalServerErrorException(
        'Не удалось сохранить модель. Проверьте SQL-схему.',
      );
    }
    return data;
  }

  async remove(id: string, ownerId: string) {
    const model = await this.findStoredModel(id);
    if (model.owner_id !== ownerId) {
      throw new ForbiddenException('Можно удалить только собственную модель.');
    }
    const client = this.supabase.getClient();
    if (model.storage_path) {
      const { error } = await client.storage
        .from(this.bucket)
        .remove([model.storage_path]);
      if (error)
        throw new InternalServerErrorException('Не удалось удалить файл.');
    }
    const { error } = await client
      .from('models')
      .delete()
      .eq('id', id)
      .eq('owner_id', ownerId);
    if (error)
      throw new InternalServerErrorException('Не удалось удалить модель.');
    return { success: true };
  }
}
