import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const authService = app.get(AuthService);
  const payloadLimit = process.env.PAYLOAD_LIMIT ?? '5mb';

  app.use(json({ limit: payloadLimit }));
  app.use(urlencoded({ extended: true, limit: payloadLimit }));

  // Enable CORS
  app.enableCors();

  // Use global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Nanny Marketplace API')
    .setDescription('REST API for Nanny Marketplace Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .addTag('Workers', 'Worker profiles and management')
    .addTag('Families', 'Family profiles')
    .addTag('Bookings', 'Booking management')
    .addTag('Uploads', 'Presigned upload URL generation')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await authService.createDefaultAdmin();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`✅ Server running on http://localhost:${port}`);
  console.log(`📚 Swagger docs on http://localhost:${port}/api/docs`);
}
void bootstrap();
