import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

/**
 * jsdom does not implement `matchMedia`, so the system-preference branch is
 * stubbed here rather than skipped — the service should still be exercised
 * through its real code path.
 */
function stubMatchMedia(prefersDark: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: prefersDark,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    stubMatchMedia(true);
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('defaults to following the system when nothing is stored', () => {
    expect(service.preference()).toBe('system');
  });

  it('resolves an explicit preference directly', () => {
    service.set('light');
    expect(service.resolved()).toBe('light');
    expect(service.isDark()).toBe(false);

    service.set('dark');
    expect(service.resolved()).toBe('dark');
    expect(service.isDark()).toBe(true);
  });

  it('writes the preference to the document element', () => {
    service.set('light');
    // Flushes the effect that syncs the signal to the DOM.
    TestBed.tick();

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('persists the preference', () => {
    service.set('dark');
    TestBed.tick();

    expect(localStorage.getItem('portfolio.theme')).toBe('dark');
  });

  it('toggle collapses `system` to the opposite of what is on screen', () => {
    service.set('system');
    const before = service.resolved();

    service.toggle();

    expect(service.preference()).not.toBe('system');
    expect(service.resolved()).not.toBe(before);
  });

  it('follows the OS when the preference is `system`', () => {
    stubMatchMedia(false);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const lightSystem = TestBed.inject(ThemeService);

    expect(lightSystem.preference()).toBe('system');
    expect(lightSystem.resolved()).toBe('light');
  });

  it('survives an environment with no matchMedia', () => {
    Reflect.deleteProperty(window, 'matchMedia');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});

    expect(() => TestBed.inject(ThemeService).resolved()).not.toThrow();
  });
});
