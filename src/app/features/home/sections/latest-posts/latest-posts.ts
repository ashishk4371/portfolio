import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BlogService } from '../../../../core/services';
import { Icon } from '../../../../shared/components/icon/icon';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { PostCard } from '../../../blog/components/post-card/post-card';

const MAX_POSTS = 3;

@Component({
  selector: 'app-latest-posts',
  imports: [RouterLink, Icon, SectionHeading, PostCard, RevealDirective],
  templateUrl: './latest-posts.html',
  styleUrl: './latest-posts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LatestPosts {
  private readonly blog = inject(BlogService);

  protected readonly posts = computed(() => this.blog.posts().slice(0, MAX_POSTS));
}
