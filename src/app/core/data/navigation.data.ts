export interface NavItem {
  readonly label: string;
  readonly path: string;
}

export const PRIMARY_NAV: readonly NavItem[] = [
  { label: 'Blog', path: '/blog' },
  { label: 'Projects', path: '/projects' },
  { label: 'Resume', path: '/resume' },
];
