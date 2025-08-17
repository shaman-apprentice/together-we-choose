import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { SubmitFeedbackDTO } from "@together-we-choose/shared";

@Injectable({ providedIn: "root" })
export class FeedbackService {
	#http = inject(HttpClient);

	submitFeedback(feedback: SubmitFeedbackDTO) {
		return this.#http.post<void>("/api/feedback", feedback);
	}
}
