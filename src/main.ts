import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('Kopet')
    .setDescription('Kopet API')
    .setVersion('1.0')
    .addTag('Contas')
    .addTag('Clientes')
    .addTag('Pets')
    .addTag('Estabelecimentos')
    .addTag('Servicos')
    .addTag('Funcionarios')
    .addTag('Disponibilidades')
    .addTag('Agendamentos')
    .addTag('Opcoes-Disponibilidade')
    .build()
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
