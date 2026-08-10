import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    /**
     * Zoneless. zone.js is not installed at all, so change detection is driven
     * exclusively by signals, template events and the async pipe. Every
     * component in this app uses OnPush and signal state.
     */
    provideZonelessChangeDetection(),

    provideRouter(
      routes,
      /** Route params bind straight to component inputs — no ActivatedRoute plumbing. */
      withComponentInputBinding(),
      /** Restores scroll on back/forward and makes `[fragment]` links jump correctly. */
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      /** Progressive enhancement — ignored by browsers without the API. */
      withViewTransitions({ skipInitialTransition: true }),
    ),

    /**
     * Replays clicks captured before hydration finished, so an early tap on a
     * nav link is not silently dropped.
     */
    provideClientHydration(withEventReplay()),
  ],
};
