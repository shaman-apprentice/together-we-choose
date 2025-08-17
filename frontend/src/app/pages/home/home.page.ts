import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { ListItemComponent } from '../../components/list-item/list-item.component';
import { StoryCarouselComponent } from '../../components/story-carousel/story-carousel.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
  imports: [
		MatButtonModule,
		MatIconModule,
		InfoCardComponent,
		ListItemComponent,
		StoryCarouselComponent,
		RouterLink,
	],
})
export class HomePage {
}
