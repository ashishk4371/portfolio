import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ThemePreference } from '../../../core/models';
import { ThemeService } from '../../../core/services';
import { Icon, IconName } from '../icon/icon';

interface ThemeOption {
  readonly value: ThemePreference;
  readonly label: string;
  readonly icon: IconName;
}

/**
 * Three-state theme control rendered as a radio group.
 *
 * A three-way choice is deliberately not a toggle button: "system" is a real
 * option and collapsing it into a binary switch loses the user's ability to
 * follow their OS. The sliding indicator is a single absolutely-positioned
 * element rather than a per-option background, so it animates between states.
 */
@Component({
  selector: 'app-theme-toggle',
  imports: [Icon],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  private readonly themeService = inject(ThemeService);

  protected readonly preference = this.themeService.preference;

  protected readonly options: readonly ThemeOption[] = [
    { value: 'light', label: 'Light', icon: 'sun' },
    { value: 'system', label: 'System', icon: 'monitor' },
    { value: 'dark', label: 'Dark', icon: 'moon' },
  ];

  protected select(value: ThemePreference): void {
    this.themeService.set(value);
  }

  protected indexOf(value: ThemePreference): number {
    return this.options.findIndex((option) => option.value === value);
  }
}
