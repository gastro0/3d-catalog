import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('ModelHub API')
    .setDescription(
      'Каталог и загрузка 3D-моделей. Авторизация через Supabase Auth.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup(
    'swagger',
    app,
    SwaggerModule.createDocument(app, config),
  );
  const port = app.get(ConfigService).get<number>('PORT', 7777);
  await app.listen(port, '0.0.0.0');
  Logger.log(`API: http://localhost:${port} · Swagger: /swagger`, 'Bootstrap');
}
bootstrap().catch((error: Error) => {
  Logger.error(error.message, undefined, 'Bootstrap');
  process.exitCode = 1;
});
