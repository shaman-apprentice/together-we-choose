import { DataSourceOptions } from 'typeorm';
import { getEnv } from '../env.config';
import { SharedStoryEntity } from './entities/shared-story.entity';
import { CreateSharedStoriesTable1730208000000 } from './migrations/1730208000000-create-shared-stories-table';
import { DeleteSharedStoriesImagesSubscriber } from './entities/delete-shared-stories-images.subscriber';
import { FeedbackEntity } from './entities/feedback.entity';

export const entities = [
	SharedStoryEntity,
	FeedbackEntity,
];

export function createDatabaseOptions(): DataSourceOptions {
	return {
		type: 'sqlite',
		database: getEnv().pathToDb,
		entities,
		subscribers: [
			DeleteSharedStoriesImagesSubscriber,
		],
		migrations: [
			CreateSharedStoriesTable1730208000000,
		],
		synchronize: false,
	} satisfies DataSourceOptions;
}
