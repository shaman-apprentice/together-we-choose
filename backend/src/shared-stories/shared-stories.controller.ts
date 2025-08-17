import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SharedStoryLargeImage, SharedStoryThumbnailImage, SubmitSharedStoryDTO, SubmittedSharedStoryDTO } from '@together-we-choose/shared';
import { memoryStorage } from 'multer';
import { SharedStoriesService } from '../services/shared-stories.service';

@Controller('shared-stories')
export class SharedStoriesController {
  constructor(private sharedStoriesService: SharedStoriesService) { }

  @Get()
  async getPublishedSharedStories(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit: number,
  ): Promise<SubmittedSharedStoryDTO[]> {
    return this.sharedStoriesService.getPublishedSharedStories(offset, limit);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnailImage', maxCount: 1 },
        { name: 'largeImage', maxCount: 1 },
      ],
      { storage: memoryStorage() },
    ),
  )
  async submitSharedStory(
    @Body() body: unknown,
    @UploadedFiles() files: any
  ): Promise<void> {
    const submittedStory = SubmitSharedStoryDTO.safeParse(body);
    if (submittedStory.error)
			throw new BadRequestException('Submitted story is invalid.');
		
		const thumbnailImage = files.thumbnailImage?.[0] as Express.Multer.File | undefined;
		const largeImage = files.largeImage?.[0] as Express.Multer.File | undefined;
		if (
			thumbnailImage !== undefined && largeImage === undefined
			|| thumbnailImage === undefined && largeImage !== undefined
		)
			throw new BadRequestException('Submitted story is invalid.');

		if (
			thumbnailImage && !this.#isFileValid(SharedStoryThumbnailImage, thumbnailImage)
			|| largeImage && !this.#isFileValid(SharedStoryLargeImage, largeImage)
		)
			throw new BadRequestException('Submitted story is invalid.');

    await this.sharedStoriesService.submitSharedStory(
      submittedStory.data,
			thumbnailImage,
			largeImage,
    );
  }

  #isFileValid(schema: typeof SharedStoryThumbnailImage | typeof SharedStoryLargeImage, file: Express.Multer.File): boolean {
		const parsedFile = new File(
			[new Uint8Array(file.buffer)],
			file.originalname,
			{ type: file.mimetype },
		);
		return schema.safeParse(parsedFile).error === undefined;
  }
}
