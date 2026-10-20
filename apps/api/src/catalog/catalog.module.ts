import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { SupabaseJwtGuard } from '../auth/guards/supabase-jwt.guard';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        storage: memoryStorage(),
        limits: {
          fileSize: config.get<number>('MAX_UPLOAD_BYTES', 26214400),
          files: 1,
          fields: 4,
        },
      }),
    }),
  ],
  controllers: [CatalogController],
  providers: [CatalogService, SupabaseJwtGuard],
})
export class CatalogModule {}
