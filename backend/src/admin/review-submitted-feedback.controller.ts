import { BadRequestException, Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { DeleteFeedbackDTO, FeedbackDTO } from "@together-we-choose/shared";
import { FeedbackService } from "src/services/feedback.service";
import { AdminAuthGuard } from "./admin-auth.guard";

@Controller("review-submitted-feedback")
@UseGuards(AdminAuthGuard)
export class ReviewSubmittedFeedbackController {
	constructor(private feedbackService: FeedbackService) {}

	@Get()
	async getSubmittedFeedback(): Promise<FeedbackDTO[]> {
		return this.feedbackService.getSubmittedFeedback();
	}

	@Post("delete")
	async deleteFeedback(@Body() body: unknown): Promise<void> {
		const parsed = DeleteFeedbackDTO.safeParse(body);
		if (parsed.error)
			throw new BadRequestException("Invalid feedback deletion request.");

		await this.feedbackService.deleteFeedback(parsed.data.ids);
	}
}
