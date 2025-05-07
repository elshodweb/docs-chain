import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  // Global filters and interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Document Chain API')
    .setDescription('API для системы документооборота с блокчейном')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
