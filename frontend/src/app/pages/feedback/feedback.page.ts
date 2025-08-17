import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, inject, Injector, signal, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SubmitButtonComponent } from '../../components/submit-button/submit-button.component';
import { createFeedbackForm } from './feedback.form';
import { FeedbackService } from './feedback.service';
import { SubmitFeedbackDTO } from '@together-we-choose/shared';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrl: './feedback.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
  imports: [
		ReactiveFormsModule,
		MatInputModule,
		SubmitButtonComponent,
	],
})
export class FeedbackPage {
	protected readonly maxStoryLength = SubmitFeedbackDTO.shape.feedback.maxLength;
	protected submissionState = signal<'idle' | 'submitting' | 'success' | 'error'>('idle');
  protected submissionErrorMessage = signal('');
	protected form = createFeedbackForm();
	protected isSubmitting = signal(false);

	#injector =inject(Injector);
	#hostElem = inject<ElementRef<HTMLElement>>(ElementRef);
	#feedbackService = inject(FeedbackService);

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
		const feedback: SubmitFeedbackDTO = this.form.getRawValue();
		this.#feedbackService
			.submitFeedback(feedback)
			.subscribe({
				next: () => {
					this.submissionState.set('success');
					this.form.reset();
				},
				error: () => {
					this.submissionState.set('error');
          this.submissionErrorMessage.set($localize`:@@feedback.submit.error:Something went wrong while sending your feedback. Please try again later.`);
				}
			});
	}

	#scrollToFirstError(): void {
    const matError = this.#hostElem.nativeElement.querySelector<HTMLElement>('mat-error');
    if (!matError)
      return;

    matError.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
