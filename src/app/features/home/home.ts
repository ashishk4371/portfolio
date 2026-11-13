import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PROFILE } from '../../core/data';
import { SeoService } from '../../core/services';

@Component({
  selector: 'app-home',
  template: `
    <h1>{{ profile.name }}</h1>
    <p class="muted">{{ profile.role }} · {{ profile.location }}</p>

    @for (paragraph of profile.summary; track $index) {
      <p>{{ paragraph }}</p>
    }

    <h2>Elsewhere</h2>
    <ul class="inline-list">
      @for (social of profile.socials; track social.label) {
        <li>
          <a [href]="social.url" rel="noopener noreferrer">{{ social.label }}</a>
        </li>
      }
    </ul>
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
      sameAs: PROFILE.socials.filter((s) => s.label !== 'Email').map((s) => s.url),
    });
  }
}
