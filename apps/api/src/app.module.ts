import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CatalogModule } from './catalog/catalog.module';
import { validateEnvironment } from './config/environment';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
    SupabaseModule,
    CatalogModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
