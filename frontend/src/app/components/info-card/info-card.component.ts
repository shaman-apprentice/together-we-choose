import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-info-card',
  template: `
    <mat-card class="info-card">
      <div class="icon-wrap" aria-hidden="true">
        <mat-icon>{{ icon() }}</mat-icon>
      </div>
      <div class="body">
        <div class="title">{{ title() }}</div>
        <div class="desc"><ng-content /></div>
      </div>
    </mat-card>
  `,
  styleUrl: './info-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatIconModule],
})
export class InfoCardComponent {
  title = input.required<string>();
  icon = input<string>('info');
}
