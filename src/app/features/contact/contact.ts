import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { PROFILE } from '../../core/data';
import { ContactService, SeoService } from '../../core/services';
import { Icon } from '../../shared/components/icon/icon';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';

type SubmitState = 'idle' | 'sending' | 'sent' | 'failed';

/**
 * Contact page.
 *
 * Validation is standard reactive forms; submission state is a signal, which is
 * what the template reads to drive the button and the status region. Errors are
 * only shown once a control has been touched, so the form does not shout at
 * someone who has just started typing.
 */
@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, Icon, SectionHeading, RevealDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  private readonly formBuilder = inject(FormBuilder);
  private readonly contact = inject(ContactService);
  private readonly seo = inject(SeoService);

  protected readonly profile = PROFILE;

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(4)]],
    message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]],
  });

  protected readonly state = signal<SubmitState>('idle');
  protected readonly errorMessage = signal('');

  protected readonly isSending = computed(() => this.state() === 'sending');

  protected readonly reasons = [
    {
      icon: 'code' as const,
      label: 'Freelance engagement',
      detail: 'Two to twelve weeks, usually.',
    },
    {
      icon: 'compass' as const,
      label: 'Technical advice',
      detail: 'Architecture reviews, second opinions.',
    },
    {
      icon: 'sparkles' as const,
      label: 'Something else',
      detail: 'Speaking, writing, or just to say hello.',
    },
  ];

  constructor() {
    this.seo.apply({
      title: 'Contact',
      description: `Get in touch with ${PROFILE.name} about freelance engineering work, technical advice or collaboration.`,
      path: '/contact',
    });
  }

  /** True only once the user has interacted, to avoid premature error text. */
  protected showError(control: 'name' | 'email' | 'subject' | 'message'): boolean {
    const field = this.form.controls[control];
    return field.invalid && (field.touched || field.dirty);
  }

  protected errorFor(control: 'name' | 'email' | 'subject' | 'message'): string {
    const errors = this.form.controls[control].errors;
    if (!errors) return '';

    if (errors['required']) return 'This field is required.';
    if (errors['email']) return 'Enter a valid email address.';
    if (errors['minlength']) {
      return `Please write at least ${errors['minlength'].requiredLength} characters.`;
    }
    if (errors['maxlength']) {
      return `Please keep this under ${errors['maxlength'].requiredLength} characters.`;
    }

    return 'Please check this field.';
  }

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      // Touch everything so all outstanding errors surface at once rather than
      // one per submit attempt.
      this.form.markAllAsTouched();
      return;
    }

    this.state.set('sending');
    this.errorMessage.set('');

    const result = await this.contact.send(this.form.getRawValue());

    if (result.kind === 'sent') {
      this.state.set('sent');
      this.form.reset();
      return;
    }

    this.state.set('failed');
    this.errorMessage.set(result.reason);
  }

  protected reset(): void {
    this.state.set('idle');
    this.errorMessage.set('');
  }
}
