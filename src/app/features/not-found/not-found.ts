import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../core/services';
import { Icon } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, Icon],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {
  constructor() {
    inject(SeoService).apply({
      title: 'Page not found',
      description: 'The page you are looking for does not exist.',
      path: '/404',
    });
  }
}
