import { BadRequestException, Body, Controller, Get, Post } from "@nestjs/common";
import { FeedbackDTO, SubmitFeedbackDTO } from "@together-we-choose/shared";
import { FeedbackService } from "src/services/feedback.service";

@Controller('feedback')
export class FeedbackController {
	constructor(private feedbackService: FeedbackService) { }

	@Get()
	async getSubmittedFeedback(): Promise<FeedbackDTO[]> {
		return this.feedbackService.getSubmittedFeedback();
	}

	@Post()
	async submitFeedback(@Body() body: unknown): Promise<void> {
		const submittedFeedback = SubmitFeedbackDTO.safeParse(body);
		if (submittedFeedback.error)
			throw new BadRequestException("Submitted feedback is invalid.");

		await this.feedbackService.submitFeedback(submittedFeedback.data);
	}
}
