import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PRIMARY_NAV, PROFILE } from '../../core/data';
import { Icon } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Icon],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly profile = PROFILE;
  protected readonly navItems = PRIMARY_NAV;
  protected readonly year = new Date().getFullYear();
}
