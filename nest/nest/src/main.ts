import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.useLogger(false);
    console.log('NestJS server running on http://localhost:3005');
  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
