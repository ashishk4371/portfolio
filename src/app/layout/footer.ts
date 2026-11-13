import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PROFILE } from '../core/data';
import { SocialLinks } from '../shared/components/social-links';

@Component({
  selector: 'app-footer',
  imports: [SocialLinks],
  template: `
    <footer class="site-footer">
      <div class="wrap site-footer__inner">
        <p>&copy; {{ year }} {{ profile.name }}</p>
        <app-social-links [links]="profile.socials" />
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly profile = PROFILE;
  protected readonly year = new Date().getFullYear();
}
