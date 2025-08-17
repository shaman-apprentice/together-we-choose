import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { StoryCardImageComponent } from './story-card-image.component';
import { SubmittedSharedStoryDTO } from '@together-we-choose/shared';

export interface StoryCardDialogData {
  story: SubmittedSharedStoryDTO;
  displayName: string;
  relationshipLabel: string;
}

@Component({
  selector: 'app-story-card-dialog',
  templateUrl: './story-card-dialog.component.html',
  styleUrl: './story-card-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
		MatDialogModule,
		MatCardModule,
		MatButtonModule,
		StoryCardImageComponent,
	],
})
export class StoryCardDialogComponent {
  readonly data = inject<StoryCardDialogData>(MAT_DIALOG_DATA);
}
