import { ApplicationConfig, ErrorHandler, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { register as registerSwiper } from 'swiper/element/bundle';
import { provideNgxLoadingIndicator } from '@shaman-apprentice/ngx-loading-overlay';
import { LoadingComponent } from './components/loading/loading.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { GlobalErrorHandler } from './supporting/global-error.handler';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LanguageService } from './services/language.service';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
		{ provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideZonelessChangeDetection(),
		provideAnimationsAsync(),
    provideHttpClient(),
    provideRouter(routes),
    provideAppInitializer(async () => {
			registerSwiper();
			
			const language = inject(LanguageService);
			await language.init();
    }),
		{ 
			provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
			useValue: {
				appearance: 'outline',
				floatLabel: 'always',
			}
		},
		provideNgxLoadingIndicator(LoadingComponent),
  ],
};
