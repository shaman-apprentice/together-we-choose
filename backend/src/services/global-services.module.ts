import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createDatabaseOptions, entities } from '../database/database.options';
import { SharedStoriesService } from './shared-stories.service';
import { FeedbackService } from './feedback.service';

@Global()
@Module({
	imports: [
		TypeOrmModule.forRoot(createDatabaseOptions()),
		TypeOrmModule.forFeature(entities),
	],
	providers: [
		SharedStoriesService,
		FeedbackService,
	],
	exports: [
		TypeOrmModule,
		SharedStoriesService,
		FeedbackService,
	],
})
export class GlobalServices { }
