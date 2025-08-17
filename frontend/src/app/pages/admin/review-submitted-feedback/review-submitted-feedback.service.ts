import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { DeleteFeedbackDTO, FeedbackDTO } from "@together-we-choose/shared";

@Injectable({ providedIn: "root" })
export class ReviewSubmittedFeedbackService {
	#http = inject(HttpClient);

	loadSubmittedFeedback(): Observable<FeedbackDTO[]> {
		return this.#http.get<FeedbackDTO[]>("/api/admin/review-submitted-feedback");
	}

	deleteFeedback(dto: DeleteFeedbackDTO): Observable<void> {
		return this.#http.post<void>("/api/admin/review-submitted-feedback/delete", dto);
	}
}
