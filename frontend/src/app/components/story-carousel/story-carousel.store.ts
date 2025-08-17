import { Injectable, inject, signal } from '@angular/core';
import { SubmittedSharedStoryDTO } from '@together-we-choose/shared';
import { StoriesService } from '../../services/stories.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoryCarouselStore {
	private storiesService = inject(StoriesService);
	private offset = 0;
	private readonly limit = 3;

	stories = signal<SubmittedSharedStoryDTO[]>([]);
	isLoading = signal(false);
	hasMore = true;

	async requestMoreStories(): Promise<boolean> {
		if (this.isLoading())
			throw new Error("Loading is in progress.");
		if (!this.hasMore)
			return false;

		return this.fetchStories(this.offset);
	}

	/** Returns true if has loaded more stories; false otherwise */
	private async fetchStories(offset: number): Promise<boolean> {
		this.isLoading.set(true);

		try {
			const batch = await firstValueFrom(this.storiesService.loadStories(offset, this.limit));
			this.stories.update((current) => [...current, ...batch]);
			this.offset += batch.length;

			if (batch.length < this.limit)
				this.hasMore = false;

			return batch.length > 0;
		} finally {
			this.isLoading.set(false);
		}
	}
}
