import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { json } from 'body-parser';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.use(json({ limit: '50mb' })); //For JSON requests
  await app.listen(PORT, () => console.log(`server started on PORT ${PORT}`));
}
bootstrap();
