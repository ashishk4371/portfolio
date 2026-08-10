export interface SocialLink {
  readonly label: string;
  readonly url: string;
  /** Key into the shared icon registry (see `shared/components/icon`). */
  readonly icon: string;
}

export interface Profile {
  readonly name: string;
  readonly initials: string;
  readonly role: string;
  readonly tagline: string;
  readonly summary: readonly string[];
  readonly location: string;
  readonly email: string;
  readonly resumeUrl: string;
  readonly availability: {
    readonly open: boolean;
    readonly message: string;
  };
  readonly socials: readonly SocialLink[];
  readonly stats: readonly { readonly value: string; readonly label: string }[];
}
