import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { EXPERIENCES, PROFILE } from '../../core/data';
import { SeoService } from '../../core/services';
import { About } from './sections/about/about';
import { ContactCta } from './sections/contact-cta/contact-cta';
import { ExperienceSection } from './sections/experience/experience';
import { FeaturedWork } from './sections/featured-work/featured-work';
import { Hero } from './sections/hero/hero';
import { LatestPosts } from './sections/latest-posts/latest-posts';
import { Skills } from './sections/skills/skills';
import { Testimonials } from './sections/testimonials/testimonials';

/**
 * Home route.
 *
 * Composition only — every section owns its own data and markup. The page's
 * job is ordering, landmark structure and page-level metadata.
 */
@Component({
  selector: 'app-home',
  imports: [
    Hero,
    About,
    Skills,
    FeaturedWork,
    ExperienceSection,
    Testimonials,
    LatestPosts,
    ContactCta,
  ],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.apply({
      title: `${PROFILE.name} — ${PROFILE.role}`,
      description: PROFILE.tagline + ' ' + PROFILE.summary[0]?.slice(0, 120),
      path: '/',
      type: 'profile',
    });

    // Person schema, so search engines can associate the site with a name,
    // a role and the profiles linked from it.
    this.seo.setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: PROFILE.name,
      jobTitle: PROFILE.role,
      email: `mailto:${PROFILE.email}`,
      url: this.seo.absoluteUrl('/'),
      address: { '@type': 'PostalAddress', addressLocality: PROFILE.location },
      sameAs: PROFILE.socials.filter((s) => s.icon !== 'mail').map((s) => s.url),
      worksFor: EXPERIENCES.filter((role) => role.endDate === null).map((role) => ({
        '@type': 'Organization',
        name: role.company,
      })),
      knowsAbout: ['TypeScript', 'Angular', 'Node.js', 'Go', 'Web performance', 'Accessibility'],
    });
  }
}
