import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { SubmittedSharedStoryDTO } from "@together-we-choose/shared";

@Injectable({ providedIn: "root" })
export class ReviewSubmittedSharedStoriesService {
	#http = inject(HttpClient);

	loadPendingStories(): Observable<SubmittedSharedStoryDTO[]> {
		return this.#http.get<SubmittedSharedStoryDTO[]>("/api/admin/review-submitted-shared-stories");
	}

	acceptStories(ids: number[]): Observable<void> {
		return this.#http.post<void>("/api/admin/review-submitted-shared-stories/accept", { ids });
	}

	deleteStories(ids: number[]): Observable<void> {
		return this.#http.post<void>("/api/admin/review-submitted-shared-stories/delete", { ids });
	}
}
