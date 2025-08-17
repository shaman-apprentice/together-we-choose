import { unlink } from 'node:fs/promises';
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from "typeorm";
import { SharedStoryEntity } from "./shared-story.entity";
import { ImageService } from '../../services/image.service';

@EventSubscriber()
export class DeleteSharedStoriesImagesSubscriber implements EntitySubscriberInterface<SharedStoryEntity> {
	listenTo() {
		return SharedStoryEntity;
	}

	async afterRemove(event: RemoveEvent<SharedStoryEntity>): Promise<void> {
		const imagesToDelete: string[] = [
			event.entity?.imageThumbnailUrl,
			event.entity?.imageLargeUrl
		].filter(url => url !== undefined && url !== null);

		await Promise.allSettled(imagesToDelete.map(url => unlink(ImageService.url2FileLocation(url))));
	}
}
