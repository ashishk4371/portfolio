export interface NavItem {
  readonly label: string;
  readonly path: string;
  /** Section id, for in-page links to a section of the home route. */
  readonly fragment?: string;
}

export const PRIMARY_NAV: readonly NavItem[] = [
  { label: 'Work', path: '/work' },
  { label: 'About', path: '/', fragment: 'about' },
  { label: 'Experience', path: '/', fragment: 'experience' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];
