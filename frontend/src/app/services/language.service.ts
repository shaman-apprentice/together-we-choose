import { DOCUMENT, inject, Injectable } from "@angular/core";
import { LOCALE_ID } from '@angular/core';
import * as z from "zod";

/** Make sure locale is also present in [zod](https://zod.dev/error-customization#locales) for translation of its error messages */
type Locale = 'en' | 'de';

const zodLocaleLoaders: Record<Locale, () => Promise<unknown>> = {
	en: () => import('zod/v4/locales/en.js').then(({ default: locale }) => z.config(locale())),
	de: () => import('zod/v4/locales/de.js').then(({ default: locale }) => z.config(locale())),
};

@Injectable({ providedIn: "root" })
export class LanguageService {
	locale = inject(LOCALE_ID) as Locale;
	
	#document = inject(DOCUMENT);

	async init() {
		await zodLocaleLoaders[this.locale]();
	}

	switchLocale(locale: Locale) {
		if (this.locale === locale)
			return;

		const w = this.#document.defaultView;
		if (w ===null)
			return;

		const { pathname, search, hash } = w.location;
		const newPathname = pathname.startsWith(`/${this.locale}`)
			? pathname.replace(new RegExp(`^/${this.locale}`), `/${locale}`)
			: `/${locale}${pathname}`;
		w.location.assign(newPathname + search + hash);

		// Note, that we don't need to load zod's locales, as we reload the page anyway
	}
}
