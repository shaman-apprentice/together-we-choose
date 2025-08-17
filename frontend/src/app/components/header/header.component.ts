import { Component, ChangeDetectionStrategy, ViewEncapsulation, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
  imports: [
		RouterLink,
		RouterLinkActive,
		MatButtonModule,
		MatMenuModule,
		MatIconModule,
		MatDividerModule,
    MatTooltipModule,
		NgTemplateOutlet,
	],
})
export class HeaderComponent {
	protected themeService = inject(ThemeService);
	protected languageService = inject(LanguageService);

  protected navItems = [
    { label: $localize`:@@nav.home:Home`, path: '/' },
    { label: $localize`:@@nav.shareYourStory:Share your story`, path: '/share' },
    { label: $localize`:@@nav.feedback:Send feedback`, path: '/feedback' },
  ] as const;

	protected langItems = [
		{ flag: "🇬🇧", label: $localize`:@@nav.langLabel.en:English`, locale: "en" }, 
		{ flag: "🇩🇪", label: $localize`:@@nav.langLabel.de:German`, locale: "de" }, 
	] as const;
	protected currentLangFlag = this.langItems.find(langItem => langItem.locale === this.languageService.locale)?.flag ?? "🇬🇧";
}
