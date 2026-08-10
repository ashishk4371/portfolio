import { TestBed } from '@angular/core/testing';

import { TagChip } from './tag-chip';

describe('TagChip', () => {
  async function render(inputs: Record<string, unknown>) {
    const fixture = TestBed.createComponent(TagChip);

    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }

    await fixture.whenStable();
    return fixture;
  }

  it('renders a non-interactive tag as a span, not a button', async () => {
    const fixture = await render({ label: 'angular' });
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('button')).toBeNull();
    expect(element.textContent).toContain('angular');
  });

  it('renders an interactive tag as a pressable button', async () => {
    const fixture = await render({ label: 'angular', interactive: true, active: true });
    const button = (fixture.nativeElement as HTMLElement).querySelector('button');

    expect(button).not.toBeNull();
    expect(button!.getAttribute('aria-pressed')).toBe('true');
  });

  it('emits the label when selected', async () => {
    const fixture = await render({ label: 'testing', interactive: true });
    const emitted: string[] = [];
    fixture.componentInstance.selected.subscribe((value) => emitted.push(value));

    (fixture.nativeElement as HTMLElement).querySelector('button')!.click();
    await fixture.whenStable();

    expect(emitted).toEqual(['testing']);
  });

  it('shows the count only when one is provided', async () => {
    const withCount = await render({ label: 'css', interactive: true, count: 4 });
    expect((withCount.nativeElement as HTMLElement).textContent).toContain('4');

    const withoutCount = await render({ label: 'css', interactive: true });
    expect((withoutCount.nativeElement as HTMLElement).querySelector('.chip__count')).toBeNull();
  });
});
