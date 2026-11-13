export interface SocialLink {
  readonly label: string;
  readonly url: string;
}

export interface Profile {
  readonly name: string;
  readonly role: string;
  readonly summary: readonly string[];
  readonly location: string;
  readonly email: string;
  /** Path of the downloadable PDF, served from `public/`. */
  readonly resumeUrl: string;
  readonly socials: readonly SocialLink[];
}
