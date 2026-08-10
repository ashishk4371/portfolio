import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  output,
} from '@angular/core';

/**
 * Small pill used for tags, tech-stack entries and filters.
 *
 * Renders as a `<button>` only when it is interactive. A static tag is a
 * `<span>`, so screen-reader users are not offered a control that does nothing.
 */
@Component({
  selector: 'app-tag-chip',
  templateUrl: './tag-chip.html',
  styleUrl: './tag-chip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagChip {
  readonly label = input.required<string>();
  readonly count = input<number | null>(null);
  readonly active = input(false, { transform: booleanAttribute });
  readonly interactive = input(false, { transform: booleanAttribute });
  readonly size = input<'sm' | 'md'>('md');

  readonly selected = output<string>();

  protected readonly isSmall = computed(() => this.size() === 'sm');

  protected onSelect(): void {
    this.selected.emit(this.label());
  }
}
