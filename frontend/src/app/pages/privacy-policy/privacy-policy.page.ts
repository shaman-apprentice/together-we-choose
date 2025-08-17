import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { PrivacyPolicyDePage } from './de/privacy-policy-de.page';
import { PrivacyPolicyEnPage } from './en/privacy-policy-en.page';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
	styleUrl: './privacy-policy.page.scss',
  imports: [
		PrivacyPolicyDePage,
		PrivacyPolicyEnPage,
	],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PrivacyPolicyPage {
	protected language = inject(LanguageService);
}
