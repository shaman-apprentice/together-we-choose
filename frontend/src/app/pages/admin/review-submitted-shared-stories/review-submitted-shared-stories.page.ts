import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, computed, inject, linkedSignal, signal } from "@angular/core";
import { SubmittedSharedStoryDTO } from "@together-we-choose/shared";
import { ReviewSubmittedSharedStoriesService } from "./review-submitted-shared-stories.service";
import { IsLoadingDirective } from "@shaman-apprentice/ngx-loading-overlay";
import { firstValueFrom } from "rxjs";
import { StoryCardComponent } from "../../../components/story-card/story-card.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-review-submitted-shared-stories",
	templateUrl: "review-submitted-shared-stories.page.html",
	styleUrl: "review-submitted-shared-stories.page.scss",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IsLoadingDirective,
		StoryCardComponent,
		MatButtonModule,
		MatIconModule,
	],
})
export class ReviewSubmittedSharedStoriesPage implements OnInit {
	protected stories = signal<SubmittedSharedStoryDTO[]>([]);
	protected isLoading = signal<boolean>(true);
	protected selectedStoryIds = linkedSignal(() => {
		this.stories(); // register to changes
		return new Set<number>();	
	})
	protected selectedCount = computed(() => this.selectedStoryIds().size);
	protected hasSelection = computed(() => this.selectedCount() > 0);

	#reviewSubmitted = inject(ReviewSubmittedSharedStoriesService);

	async ngOnInit() {
		try {
			const stories = await firstValueFrom(this.#reviewSubmitted.loadPendingStories());
			this.stories.set(stories);
		} finally {
			this.isLoading.set(false);
		}
	}

	protected isStorySelected(storyId: number): boolean {
		return this.selectedStoryIds().has(storyId);
	}

	protected changeSelection(storyId: number): void {
		this.selectedStoryIds.update(current => {
			const next = new Set(current);
			if (next.has(storyId))
				next.delete(storyId);
			else 
				next.add(storyId);
			return next;
		});
	}

	protected onStoryContainerKeydown(event: KeyboardEvent, storyId: number): void {
		if (event.key !== "Enter" && event.key !== " ")
			return;

		event.preventDefault();
		this.changeSelection(storyId);
	}

	protected async acceptSelectedStories(): Promise<void> {
		try {
			this.isLoading.set(true);
			const ids = [...this.selectedStoryIds()];
			await firstValueFrom(this.#reviewSubmitted.acceptStories(ids));
			const stories = await firstValueFrom(this.#reviewSubmitted.loadPendingStories());
			this.stories.set(stories);
		} finally {
			this.isLoading.set(false);
		}
	}

	protected async deleteSelectedStories(): Promise<void> {
		try {
			this.isLoading.set(true);
			const ids = [...this.selectedStoryIds()];
			await firstValueFrom(this.#reviewSubmitted.deleteStories(ids));
			const stories = await firstValueFrom(this.#reviewSubmitted.loadPendingStories());
			this.stories.set(stories);
		} finally {
			this.isLoading.set(false);
		}
	}
}
