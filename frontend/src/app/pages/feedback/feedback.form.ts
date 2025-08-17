import { FormControl, FormGroup } from "@angular/forms";
import { zodValidator } from "../../supporting/zod.validator";
import { SubmitFeedbackDTO } from "@together-we-choose/shared";

export function createFeedbackForm() {
	return new FormGroup({
		email: new FormControl<string | null>(null, { validators: zodValidator(SubmitFeedbackDTO.shape.email) }),
		feedback: new FormControl<string>("", {
			nonNullable: true,
			validators: zodValidator(SubmitFeedbackDTO.shape.feedback),
		}),
	});
}

export type FeedbackForm = ReturnType<typeof createFeedbackForm>
