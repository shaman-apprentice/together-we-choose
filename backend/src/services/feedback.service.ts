import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FeedbackDTO, SubmitFeedbackDTO } from "@together-we-choose/shared";
import { FeedbackEntity } from "src/database/entities/feedback.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class FeedbackService {
	constructor(
		@InjectRepository(FeedbackEntity)
		private feedbackRepo: Repository<FeedbackEntity>,
	) {}

	async getSubmittedFeedback(): Promise<FeedbackDTO[]> {
		const entities = await this.feedbackRepo.find({
			order: { createdAt: "desc" },
		});
		return entities.map(entity => this.toDTO(entity));
	}

	async submitFeedback(submitFeedback: SubmitFeedbackDTO): Promise<void> {
		await this.feedbackRepo.save({
			...submitFeedback,
			createdAt: new Date(),
		});
	}

	async deleteFeedback(ids: number[]): Promise<void> {
		if (ids.length === 0)
      return;

		const feedback = await this.feedbackRepo.find({ where: { id: In(ids) } });
		if (feedback.length === 0)
			return;

		await this.feedbackRepo.remove(feedback);
	}

	private toDTO(feedback: FeedbackEntity): FeedbackDTO {
		return {
			id: feedback.id,
			email: feedback.email,
			feedback: feedback.feedback,
			createdAt: feedback.createdAt.toISOString(),
		};
	}
}
