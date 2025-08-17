import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SubmittedSharedStoryDTO } from '@together-we-choose/shared';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoriesService {
  #http = inject(HttpClient);

  loadStories(offset = 0, limit = 3): Observable<SubmittedSharedStoryDTO[]> {
    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString());

    return this.#http.get<SubmittedSharedStoryDTO[]>('/api/shared-stories', { params });
  }

  submitStory(story: FormData): Observable<void> {
    return this.#http.post<void>('/api/shared-stories', story);
  }
}
