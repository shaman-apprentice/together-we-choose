import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-list-item',
  template: `
    <div class="list-item">
      <div class="icon-wrap" aria-hidden="true">
        <mat-icon>{{ icon() }}</mat-icon>
      </div>
      <div class="body">
        <div class="title">{{ title() }}</div>
        <div class="desc"><ng-content /></div>
      </div>
    </div>
  `,
  styleUrl: './list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
})
export class ListItemComponent {
  title = input.required<string>();
  icon = input<string>('help');
}
