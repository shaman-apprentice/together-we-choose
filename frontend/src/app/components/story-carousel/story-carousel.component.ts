import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, inject, Injector, afterNextRender, ViewEncapsulation, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Swiper } from "swiper";
import { StoryCardComponent } from '../story-card/story-card.component';
import { CtaSlideComponent } from './cta-slide/cta-slide.component';
import { StoryCarouselStore } from './story-carousel.store';
import { isTouchDevice } from '../../supporting/device.helper';
import { IsLoadingDirective } from '@shaman-apprentice/ngx-loading-overlay';

@Component({
  selector: 'app-story-carousel',
  templateUrl: "./story-carousel.component.html",
  styleUrl: "./story-carousel.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
  imports: [
		MatButtonModule,
		MatIconModule,
		MatCardModule,
		StoryCardComponent,
		CtaSlideComponent,
		IsLoadingDirective,
	],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StoryCarouselComponent implements OnInit {
  @ViewChild('swiper', { read: ElementRef, static: true }) swiperElem!: ElementRef<HTMLElement>;
	
  protected store = inject(StoryCarouselStore);
	protected readonly isTouchDevice = isTouchDevice();
	protected currentSlideIndex = signal(0);
	protected maxSlide = signal<number | null>(null);

	#injector = inject(Injector);

	async ngOnInit() {
		await this.store.requestMoreStories();
		if (!this.store.hasMore)
			this.maxSlide.set(this.currentSlideIndex());

		const swiperElem = this.swiperElem.nativeElement as any;
		swiperElem.initialize();
		
		const swiper = this.#getSwiper()!;
		swiper.on("reachEnd", async () => {
			if (this.store.hasMore && !this.store.isLoading()) {
				const previousStoryCount = this.store.stories().length + 1; // + 1 for cta-slide
				const hasLoadedMore = await this.store.requestMoreStories();

				if (!this.store.hasMore)
					this.maxSlide.set(this.currentSlideIndex());

				if (!hasLoadedMore)
					return;

				afterNextRender({
					write: () => {
						const newSlides = swiperElem.querySelectorAll(`swiper-slide:nth-child(n + ${previousStoryCount +1})`);
						swiper.appendSlide(newSlides);
					},
				}, { injector: this.#injector });
			}
		});
	}

  slidePrev() {
		if (this.currentSlideIndex() > 0) {
			this.#getSwiper()?.slidePrev();
			this.currentSlideIndex.update(i => i - 1);
		}
  }

  async slideNext() {
		const swiper = this.#getSwiper();
		if (!swiper)
			return;

		if (!swiper.isEnd) {
			swiper.slideNext();
			this.currentSlideIndex.update(i => i + 1);
		}
  }

	#getSwiper(): Swiper | undefined {
		return (this.swiperElem?.nativeElement as any).swiper;
	}
}
