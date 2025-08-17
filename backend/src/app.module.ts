import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { SharedStoriesModule } from './shared-stories/shared-stories.module';
import { AdminModule } from './admin/admin.module';
import { GlobalServices } from './services/global-services.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { getEnv } from './env.config';
import { ImageService } from './services/image.service';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
		ServeStaticModule.forRoot({
			rootPath: getEnv().pathToImageDir,
			serveRoot: ImageService.serveImagesPath,
			serveStaticOptions: {
        fallthrough: false,
      },
		}),
		GlobalServices,
		SharedStoriesModule,
		FeedbackModule,
		AdminModule,
		RouterModule.register([
			{
				path: 'admin',
				module: AdminModule,
			},
		]),
	],
})
export class AppModule { }
