import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PROFILE } from '../../../../core/data';
import { Icon } from '../../../../shared/components/icon/icon';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-contact-cta',
  imports: [RouterLink, Icon, RevealDirective],
  templateUrl: './contact-cta.html',
  styleUrl: './contact-cta.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactCta {
  protected readonly profile = PROFILE;
}
