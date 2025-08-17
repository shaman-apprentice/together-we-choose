import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface StoryCardImageDialogData {
  url: string;
}

@Component({
  selector: 'app-story-card-image-dialog',
  template: `
    <mat-dialog-content>
			<img
				class="image-dialog-img"
				[src]="data.url"
				alt="User photo full size"
			/>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button type="button" mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
	styleUrl: "story-card-image-dialog.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule],
})
export class StoryCardImageDialogComponent {
  readonly data = inject<StoryCardImageDialogData>(MAT_DIALOG_DATA);
}
