import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Lanchonete 5 amigos')
    .setDescription('Lanchonete de bairro')
    .setVersion('1.0')
    // .addBearerAuth(
    //   {
    //     type: 'apiKey',
    //     name: 'user',
    //     in: 'header',
    //   },
    //   'user',
    // )
    .addTag('Lanchonete')
    .addServer('http://localhost:3000')
    .addServer(
      'https://b03e-2804-46ec-80d-b900-9a0e-646a-cf41-19e3.ngrok-free.app',
    )
    .addServer('https://0oc9cpj3o6.execute-api.us-east-1.amazonaws.com/dev')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
