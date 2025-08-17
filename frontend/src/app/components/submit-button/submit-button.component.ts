import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
	selector: "app-submit-button",
	templateUrl: "submit-button.component.html",
	styleUrl: "submit-button.component.scss",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		MatButtonModule,
		MatProgressSpinnerModule,
	]
})
export class SubmitButtonComponent {
	label = input.required<string>();
	isSubmitting = input.required<boolean>();
}
