import { Injectable } from '@angular/core';

import { PROFILE } from '../data';

export interface ContactMessage {
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly message: string;
}

export type ContactResult =
  { readonly kind: 'sent' } | { readonly kind: 'failed'; readonly reason: string };

/**
 * Delivery of contact-form submissions.
 *
 * This portfolio ships with no backend, so the default implementation hands the
 * message to the visitor's mail client. It is isolated behind a service (rather
 * than built into the component) precisely so that swapping in a real endpoint —
 * Formspree, Resend, a Lambda — is a change to this one file.
 *
 * To use an HTTP endpoint instead: add `provideHttpClient()` to `app.config.ts`,
 * inject `HttpClient` here, and POST the message in `send()`. Nothing in the
 * component needs to change.
 */
@Injectable({ providedIn: 'root' })
export class ContactService {
  async send(message: ContactMessage): Promise<ContactResult> {
    try {
      const body = [`From: ${message.name} <${message.email}>`, '', message.message].join('\n');

      const href =
        `mailto:${PROFILE.email}` +
        `?subject=${encodeURIComponent(message.subject)}` +
        `&body=${encodeURIComponent(body)}`;

      globalThis.location.href = href;

      return { kind: 'sent' };
    } catch {
      return {
        kind: 'failed',
        reason: `Could not open a mail client. Please email ${PROFILE.email} directly.`,
      };
    }
  }
}
