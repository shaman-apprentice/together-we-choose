import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, computed, inject, linkedSignal, signal } from "@angular/core";
import { IsLoadingDirective } from "@shaman-apprentice/ngx-loading-overlay";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { DatePipe } from "@angular/common";
import { DeleteFeedbackDTO, FeedbackDTO } from "@together-we-choose/shared";
import { firstValueFrom } from "rxjs";
import { ReviewSubmittedFeedbackService } from "./review-submitted-feedback.service";

@Component({
	selector: "app-review-submitted-feedback",
	templateUrl: "review-submitted-feedback.page.html",
	styleUrl: "review-submitted-feedback.page.scss",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IsLoadingDirective,
		MatButtonModule,
		MatIconModule,
		DatePipe,
	],
})
export class ReviewSubmittedFeedbackPage implements OnInit {
	protected feedback = signal<FeedbackDTO[]>([]);
	protected isLoading = signal<boolean>(true);
	protected selectedFeedbackIds = linkedSignal(() => {
		this.feedback();
		return new Set<number>();
	});
	protected selectedCount = computed(() => this.selectedFeedbackIds().size);
	protected hasSelection = computed(() => this.selectedCount() > 0);
	protected feedbackCount = computed(() => this.feedback().length);

	#reviewFeedback = inject(ReviewSubmittedFeedbackService);

	async ngOnInit(): Promise<void> {
		try {
			const submittedFeedback = await firstValueFrom(this.#reviewFeedback.loadSubmittedFeedback());
			this.feedback.set(submittedFeedback);
		} finally {
			this.isLoading.set(false);
		}
	}

	protected isFeedbackSelected(feedbackId: number): boolean {
		return this.selectedFeedbackIds().has(feedbackId);
	}

	protected changeSelection(feedbackId: number): void {
		this.selectedFeedbackIds.update(current => {
			const next = new Set(current);
			if (next.has(feedbackId))
				next.delete(feedbackId);
			else
				next.add(feedbackId);
			return next;
		});
	}

	protected onFeedbackContainerKeydown(event: KeyboardEvent, feedbackId: number): void {
		if (event.key !== "Enter" && event.key !== " ")
			return;

		event.preventDefault();
		this.changeSelection(feedbackId);
	}

	protected async deleteSelectedFeedback(): Promise<void> {
		const ids = [...this.selectedFeedbackIds()];
		if (ids.length === 0)
			return;

		try {
			this.isLoading.set(true);
			const dto: DeleteFeedbackDTO = { ids: [...this.selectedFeedbackIds()] };
			await firstValueFrom(this.#reviewFeedback.deleteFeedback(dto));
			const submittedFeedback = await firstValueFrom(this.#reviewFeedback.loadSubmittedFeedback());
			this.feedback.set(submittedFeedback);
		} finally {
			this.isLoading.set(false);
		}
	}
}
