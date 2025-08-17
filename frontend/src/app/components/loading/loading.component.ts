import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
	selector: "app-loading",
	templateUrl: "loading.component.html",
	styleUrl: "loading.component.scss",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [MatProgressSpinnerModule],
})
export class LoadingComponent {}
