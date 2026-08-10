export interface Experience {
  readonly id: string;
  readonly company: string;
  readonly companyUrl?: string;
  readonly role: string;
  readonly type: 'Full-time' | 'Contract' | 'Freelance' | 'Internship';
  readonly startDate: string;
  /** `null` means "present" — rendered as an ongoing role. */
  readonly endDate: string | null;
  readonly location: string;
  readonly summary: string;
  readonly highlights: readonly string[];
  readonly stack: readonly string[];
}

export interface Education {
  readonly id: string;
  readonly institution: string;
  readonly qualification: string;
  readonly startYear: number;
  readonly endYear: number;
  readonly detail?: string;
}
