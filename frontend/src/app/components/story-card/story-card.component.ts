import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SubmittedSharedStoryDTO, RelationshipStatus } from '@together-we-choose/shared';
import { StoryCardDialogComponent, StoryCardDialogData } from './story-card-dialog.component';
import { StoryCardImageComponent } from './story-card-image.component';

@Component({
  selector: 'app-story-card',
  templateUrl: './story-card.component.html',
  styleUrl: './story-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
  imports: [
		MatCardModule,
		MatButtonModule,
		MatDialogModule,
		StoryCardImageComponent,
	],
})
export class StoryCardComponent {
  story = input.required<SubmittedSharedStoryDTO>();

	#dialog = inject(MatDialog);

	protected displayName = computed(() => {
		const s = this.story();
		return s.name ? s.name : $localize`:@@story.card.name.anonymous:Anonymous`;
	});

	protected relationshipLabel = computed(() => {
		const status = this.story().relationshipStatus;
		switch (status) {
			case RelationshipStatus.Married:
				return $localize`:@@story.card.name.relationship.married:married`;
			case RelationshipStatus.InARelationship:
				return $localize`:@@story.card.name.relationship.in-a-relationship:in a relationship`;
			case RelationshipStatus.Single:
				return $localize`:@@story.card.name.relationship.single:single`;
			default:
				return $localize`:@@story-card.name.relationship.unknown:unknown`;
		}
	});

  protected openStoryDialog(): void {
		const data: StoryCardDialogData = {
			story: this.story(),
			displayName: this.displayName(),
			relationshipLabel: this.relationshipLabel(),
    };
    this.#dialog.open(StoryCardDialogComponent, {
      data,
      maxWidth: '640px',
      width: '100%',
      panelClass: 'story-card-dialog-panel',
    });
  }
}
