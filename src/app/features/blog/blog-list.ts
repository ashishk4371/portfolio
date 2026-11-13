import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BlogService, SeoService } from '../../core/services';
import { FormatDatePipe } from '../../shared/pipes/format-date.pipe';

@Component({
  selector: 'app-blog-list',
  imports: [RouterLink, FormatDatePipe],
  templateUrl: './blog-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogList {
  protected readonly posts = inject(BlogService).posts;

  constructor() {
    inject(SeoService).apply({
      title: 'Blog',
      description: 'Notes on Angular, web performance, API design and engineering practice.',
      path: '/blog',
    });
  }
}
