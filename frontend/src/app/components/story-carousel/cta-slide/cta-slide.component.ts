import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
	selector: "app-cta-slide",
	templateUrl: "cta-slide.component.html",
	styleUrls: ["../../story-card/story-card-image.scss"],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatCardModule, RouterLink],
})
export class CtaSlideComponent {
	isTouchDevice = input.required<boolean>();
}
