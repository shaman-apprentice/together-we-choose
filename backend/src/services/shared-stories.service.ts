import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubmitSharedStoryDTO, SubmittedSharedStoryDTO } from '@together-we-choose/shared';
import { In, Repository } from 'typeorm';
import { SharedStoryEntity } from '../database/entities/shared-story.entity';
import { ImageService } from './image.service';

@Injectable()
export class SharedStoriesService {
  constructor(
    @InjectRepository(SharedStoryEntity)
    private sharedStoriesRepo: Repository<SharedStoryEntity>,
  ) {}

  async getPublishedSharedStories(offset = 0, limit = 3): Promise<SubmittedSharedStoryDTO[]> {
    const stories = await this.sharedStoriesRepo.find({
      where: { isPublished: true },
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });

    return stories.map((story: SharedStoryEntity) => this.toSubmittedDTO(story));
  }

  async submitSharedStory(
    submitSharedStory: SubmitSharedStoryDTO,
		thumbnailImage?:  Express.Multer.File,
		largeImage?:  Express.Multer.File,
  ): Promise<void> {
    const entity = this.sharedStoriesRepo.create({
      ...submitSharedStory,
      imageThumbnailUrl: null,
			imageLargeUrl: null,
      createdAt: new Date(),
      isPublished: false,
    });
		if (!thumbnailImage || ! largeImage) {
			entity.imageThumbnailUrl = submitSharedStory.placeholderImage;
			entity.imageLargeUrl = submitSharedStory.placeholderImage;
			await this.sharedStoriesRepo.save(entity);
			return;
		}

    const createdSharedStory = await this.sharedStoriesRepo.save(entity);
		if (thumbnailImage && largeImage) {
			const {
				thumbnailUrl,
				largeUrl
			} = await ImageService.saveStoryImages(createdSharedStory.id, thumbnailImage, largeImage);
			createdSharedStory.imageThumbnailUrl = thumbnailUrl;
			createdSharedStory.imageLargeUrl = largeUrl;
			await this.sharedStoriesRepo.save(createdSharedStory);
		}
  }

	async getSharedStoriesForReview(): Promise<SubmittedSharedStoryDTO[]> {
    const stories = await this.sharedStoriesRepo.find({
      where: { isPublished: false },
      order: { createdAt: 'ASC' },
    });

    return stories.map((story: SharedStoryEntity) => this.toSubmittedDTO(story));
  }

  async publishStories(ids: number[]): Promise<void> {
    if (ids.length === 0)
      return;

    await this.sharedStoriesRepo.update(ids, { isPublished: true, email: null });
  }

  async deleteStories(ids: number[]): Promise<void> {
    if (ids.length === 0)
      return;

		const stories = await this.sharedStoriesRepo.find({ where: { id: In(ids) } });
		if (stories.length === 0)
			return;

    await this.sharedStoriesRepo.remove(stories);
  }

	private toSubmittedDTO(story: SharedStoryEntity): SubmittedSharedStoryDTO {
    return {
      id: story.id,
      name: story.name,
      relationshipStatus: story.relationshipStatus,
      email: story.email,
      story: story.story,
      image: story.imageThumbnailUrl && story.imageLargeUrl
        ? { thumbnailUrl: story.imageThumbnailUrl, largeUrl: story.imageLargeUrl }
        : null,
      createdAt: story.createdAt.toISOString(),
    };
  }
}
