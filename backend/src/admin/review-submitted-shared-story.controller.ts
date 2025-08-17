import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import type { AcceptSharedStoriesDTO, SubmittedSharedStoryDTO } from "@together-we-choose/shared";
import { SharedStoriesService } from "src/services/shared-stories.service";
import { AdminAuthGuard } from "./admin-auth.guard";

@Controller('review-submitted-shared-stories')
@UseGuards(AdminAuthGuard)
export class ReviewSubmittedSharedStoryController {
	constructor(private readonly sharedStoriesService: SharedStoriesService) { }
	
	@Get()
	async getSharedStoriesForReview(): Promise<SubmittedSharedStoryDTO[]> {
		return this.sharedStoriesService.getSharedStoriesForReview();
	}

	@Post('accept')
	async acceptStories(@Body() body: AcceptSharedStoriesDTO): Promise<void> {
		await this.sharedStoriesService.publishStories(body.ids);
	}

	@Post('delete')
	async deleteStories(@Body() body: AcceptSharedStoriesDTO): Promise<void> {
		await this.sharedStoriesService.deleteStories(body.ids);
	}
}
