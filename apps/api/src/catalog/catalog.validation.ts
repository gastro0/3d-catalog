import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export const CATEGORIES = [
  'Архитектура',
  'Для дома',
  'Декор',
  'Игрушки',
  'Животные',
  'Игры',
] as const;
export const FORMATS = ['OBJ', 'FBX', 'GLTF', 'GLB', 'STL', 'ZIP'] as const;

export interface ModelMetadata {
  name: string;
  description: string;
  category: string;
  polygons: number;
}

export function validateModelUpload(
  file: Express.Multer.File | undefined,
  body: Record<string, unknown>,
): ModelMetadata & { format: string } {
  if (!file?.buffer?.length)
    throw new BadRequestException('Выберите файл модели.');
  const format = extname(file.originalname).slice(1).toUpperCase();
  if (!FORMATS.some((allowed) => allowed === format)) {
    throw new BadRequestException(
      'Поддерживаются OBJ, FBX, GLTF, GLB, STL и ZIP.',
    );
  }
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const description =
    typeof body.description === 'string' ? body.description.trim() : '';
  const category = typeof body.category === 'string' ? body.category : '';
  const polygons = Number(body.polygons || 0);
  if (!name || name.length > 120) {
    throw new BadRequestException(
      'Название должно содержать от 1 до 120 символов.',
    );
  }
  if (description.length > 5000) {
    throw new BadRequestException(
      'Описание не должно превышать 5000 символов.',
    );
  }
  if (!CATEGORIES.some((allowed) => allowed === category)) {
    throw new BadRequestException('Выберите категорию из списка.');
  }
  if (!Number.isSafeInteger(polygons) || polygons < 0) {
    throw new BadRequestException(
      'Количество полигонов должно быть целым неотрицательным числом.',
    );
  }
  return { name, description, category, polygons, format };
}
