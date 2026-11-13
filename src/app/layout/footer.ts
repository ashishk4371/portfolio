import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PROFILE } from '../core/data';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="site-footer">
      <div class="wrap site-footer__inner">
        <p>&copy; {{ year }} {{ profile.name }}</p>
        <ul class="inline-list">
          @for (social of profile.socials; track social.label) {
            <li>
              <a [href]="social.url" rel="noopener noreferrer">{{ social.label }}</a>
            </li>
          }
        </ul>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly profile = PROFILE;
  protected readonly year = new Date().getFullYear();
}
