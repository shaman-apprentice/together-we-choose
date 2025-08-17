import { Controller, Delete, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { SharedStoriesService } from "src/services/shared-stories.service";
import { AdminAuthGuard } from "./admin-auth.guard";

@Controller('shared-stories-admin')
@UseGuards(AdminAuthGuard)
export class SharedStoryAdminController {
	constructor(private sharedStoriesService: SharedStoriesService) { }

	@Delete(':id')
	async deleteStories(@Param('id', ParseIntPipe) id: number): Promise<void> {
		await this.sharedStoriesService.deleteStories([id]);
	}
}
