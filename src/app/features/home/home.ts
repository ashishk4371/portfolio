import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PROFILE } from '../../core/data';
import { SeoService } from '../../core/services';
import { SocialLinks } from '../../shared/components/social-links';

@Component({
  selector: 'app-home',
  imports: [SocialLinks],
  template: `
    <h1 class="visually-hidden">{{ profile.name }}</h1>

    <img
      class="photo"
      [src]="profile.photo"
      [alt]="'Photo of ' + profile.name"
      width="160"
      height="160"
    />

    @for (paragraph of profile.summary; track $index) {
      <p>{{ paragraph }}</p>
    }

    <app-social-links [links]="profile.socials" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly profile = PROFILE;

  constructor() {
    const seo = inject(SeoService);

    seo.apply({
      title: `${PROFILE.name} — ${PROFILE.role}`,
      description: PROFILE.summary[0] ?? '',
      path: '/',
      type: 'profile',
    });

    seo.setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: PROFILE.name,
      jobTitle: PROFILE.role,
      email: `mailto:${PROFILE.email}`,
      url: seo.absoluteUrl('/'),
      address: { '@type': 'PostalAddress', addressLocality: PROFILE.location },
      sameAs: PROFILE.socials.filter((s) => s.icon !== 'mail').map((s) => s.url),
    });
  }
}
