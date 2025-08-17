import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getEnv } from './env.config';
import { serveAngularApp } from './middlewares/serve-angular-app.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
	const env = getEnv();

	app.use(serveAngularApp);

	app.setGlobalPrefix('api');

	await app.listen(env.port);
}
bootstrap();
