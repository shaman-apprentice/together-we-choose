import { ChangeDetectionStrategy, Component, inject, input, linkedSignal, ViewEncapsulation } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { SubmittedSharedStoryDTO } from "@together-we-choose/shared";
import { StoryCardImageDialogComponent, StoryCardImageDialogData } from "./story-card-image-dialog.component";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-story-card-image",
	templateUrl: "story-card-image.component.html",
	styleUrls: ["story-card-image.scss"],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		MatButtonModule,
		MatDialogModule,
		MatIconModule,
	]
})
export class StoryCardImageComponent {
	image = input.required<(SubmittedSharedStoryDTO)["image"]>();

	#dialog = inject(MatDialog);

	protected imageLoadFailed = linkedSignal({
		source: this.image,
		computation: () => false,
	});

	protected handleImageError(): void {
    this.imageLoadFailed.set(true);
  }

	protected openImageFullSize(event: Event): void {
		const largeImgUrl = this.image()?.largeUrl;
		if (!largeImgUrl)
			return;

		event.stopPropagation();
	
		const data: StoryCardImageDialogData = {
			url: largeImgUrl,
		};

		this.#dialog.open(StoryCardImageDialogComponent, {
			data,
			panelClass: "story-card-image-full"
		});
	}
}
