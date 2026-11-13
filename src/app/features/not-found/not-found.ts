import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../core/services';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <h1>Page not found</h1>
    <p>That address doesn't match anything on this site.</p>
    <p><a routerLink="/">Back to the home page</a></p>
  `,
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
