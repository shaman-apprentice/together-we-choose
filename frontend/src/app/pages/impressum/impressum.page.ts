import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-impressum',
  templateUrl: './impressum.page.html',
  styleUrl: './impressum.page.scss',
  imports: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class ImpressumPage {

}
