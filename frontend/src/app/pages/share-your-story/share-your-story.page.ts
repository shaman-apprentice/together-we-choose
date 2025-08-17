import { ChangeDetectionStrategy, Component, ElementRef, Injector, ViewEncapsulation, afterNextRender, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { imageMimeTypes, RelationshipStatus, SubmitSharedStoryDTO } from '@together-we-choose/shared';
import { StoriesService } from '../../services/stories.service';
import { ShareStoryImageService } from './share-story-image.service';
import { createShareYourStoryForm, story2FormData } from './share-your-story.form';
import { StoryCardImageDialogComponent, StoryCardImageDialogData } from '../../components/story-card/story-card-image-dialog.component';
import { SubmitButtonComponent } from '../../components/submit-button/submit-button.component';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-share-your-story',
  templateUrl: './share-your-story.page.html',
  styleUrl: './share-your-story.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    SubmitButtonComponent,
    RouterLink
	],
  providers: [ShareStoryImageService],
})
export class ShareYourStoryPage {
	
	protected readonly maxStoryLength = SubmitSharedStoryDTO.shape.story.maxLength;
  protected readonly acceptedImageMimeTypes = imageMimeTypes;
  protected readonly fallbackImages: readonly string[] = [
		'story-image-placeholders/1.png',
		'story-image-placeholders/2.png',
		'story-image-placeholders/3.png',
  ];
  protected readonly relationshipStatusOptions = [
		{ value: RelationshipStatus.NoStatement, label: $localize`:@@share.relationship.noStatement:Prefer not to say` },
    { value: RelationshipStatus.Single, label: $localize`:@@share.relationship.single:Single` },
    { value: RelationshipStatus.InARelationship, label: $localize`:@@share.relationship.inRelationship:In a relationship` },
    { value: RelationshipStatus.Married, label: $localize`:@@share.relationship.married:Married` },
  ] as const;
  protected submissionState = signal<'idle' | 'submitting' | 'success' | 'error'>('idle');
  protected submissionErrorMessage = signal('');
  protected form = createShareYourStoryForm();
	
	protected imageService = inject(ShareStoryImageService);

  #hostElem = inject<ElementRef<HTMLElement>>(ElementRef);
	#dialog = inject(MatDialog);
	#storiesService = inject(StoriesService);
	#injector =inject(Injector);

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
			afterNextRender(() => {
				this.#scrollToFirstError();
			}, { injector: this.#injector });
      return;
    }

    this.submissionState.set('submitting');
    this.submissionErrorMessage.set('');
		const story = SubmitSharedStoryDTO.parse(this.form.getRawValue());
    this.#storiesService
      .submitStory(story2FormData(story, this.form.controls.image.value))
      .subscribe({
        next: () => {
          this.submissionState.set('success');
          this.clearImage();
          this.form.reset();
				},
        error: () => {
          this.submissionState.set('error');
          this.submissionErrorMessage.set($localize`:@@share.submit.error:Something went wrong while sending your story. Please try again later.`);
        },
      });
  }

  protected onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    const control = this.form.controls.image;

    control.markAsTouched();

    if (!file) {
      this.clearImage();
      input.value = '';
      return;
    }

    if (!imageMimeTypes.includes(file.type)) {
      control.setValue(null, { emitEvent: false });
      control.setErrors({ fileType: true });
      control.markAsDirty();
      this.imageService.removeImage();
      input.value = '';
      return;
    }

    this.imageService
      .uploadImage(file)
      .then((processedImage) => {
        control.setErrors(null);
        control.setValue(processedImage);
        control.markAsDirty();
        control.markAsTouched();
      })
      .catch(() => {
        control.setValue(null);
        control.setErrors({ processingFailed: true });
        control.markAsDirty();
        control.markAsTouched();
      })
      .finally(() => {
        input.value = '';
      });
  }

  protected clearImage(): void {
    this.form.controls.image.reset();
    this.imageService.removeImage();
    this.#dialog.closeAll();
  }

  protected openFullImage(): void {
    const processedImage = this.imageService.processedImage();
    if (processedImage === null)
      return;

		const data: StoryCardImageDialogData = { url: processedImage.large.asUrl };
    this.#dialog.open(StoryCardImageDialogComponent, { data });
  }

	#scrollToFirstError(): void {
    const matError = this.#hostElem.nativeElement.querySelector<HTMLElement>('mat-error');
    if (!matError)
      return;

    matError.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
