import { afterNextRender, ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, inject, Injector } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd, NavigationStart } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { filter, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, HeaderComponent],
  templateUrl: './app.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class App implements OnInit {
	#currentPath: string | null = null;
	#isPopStateNav = false;
	#rememberedScrollPositions = new Map<string, number>();


	#injector = inject(Injector);
	// don't use Angular's scroll restoration, as it only works with main window
	// and we have a content wrapper around main window, to exclude header from scroll.
	#restoreScrollSideEffect$ = inject(Router).events.pipe(
		filter(event => event instanceof NavigationStart || event instanceof NavigationEnd),
		tap(event => {
			const scrollContainer = document.querySelector('.below-header') as HTMLElement | null;
			if (!scrollContainer)
				return;

			if (event instanceof NavigationStart) {
				if (this.#currentPath)
					this.#rememberedScrollPositions.set(this.#currentPath, scrollContainer.scrollTop);
				
				this.#isPopStateNav = event.navigationTrigger === 'popstate';
			} else if (event instanceof NavigationEnd) {
				this.#currentPath = event.urlAfterRedirects.split('#')[0];
				if (this.#isPopStateNav) { // Restore scroll position on back/forward navigation
					const savedPosition = this.#rememberedScrollPositions.get(this.#currentPath);
					afterNextRender(() => {
						scrollContainer.scrollTop = savedPosition ?? 0;
					}, { injector: this.#injector });
				} else {	// Scroll to top on forward navigation
					scrollContainer.scrollTop = 0;
				}
			}
		})
	);

	ngOnInit(): void {
		this.#restoreScrollSideEffect$.subscribe();
	}
}
