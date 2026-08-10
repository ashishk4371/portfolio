import { Profile } from '../models';

/**
 * Personal content lives in `core/data` as typed constants rather than being
 * inlined in templates. Editing the site's copy never means touching a
 * component, and the compiler catches a missing field immediately.
 */
export const PROFILE: Profile = {
  name: 'Ashish Kumar',
  initials: 'AK',
  role: 'Software Engineer',
  tagline: 'I build fast, accessible products end to end.',
  summary: [
    'I am a software engineer with a bias for shipping. Most of my work sits where product meets platform: designing the API, building the interface that consumes it, and owning the pipeline that puts both in front of users.',
    'I care about the parts users feel but never name — a page that paints in under a second, a form that recovers gracefully, a keyboard path through every flow. Lately I have been deep in Angular signals, edge rendering and the surprisingly hard problem of making CI honest.',
  ],
  location: 'New Delhi, India',
  email: 'ashishk4371@gmail.com',
  resumeUrl: '/resume.pdf',
  availability: {
    open: true,
    message: 'Available for select freelance work',
  },
  socials: [
    { label: 'GitHub', url: 'https://github.com/ashishk4371', icon: 'github' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ashish-kumar-8537b5176/', icon: 'linkedin' },
    // { label: 'X', url: 'https://x.com/ashishbuilds', icon: 'x' },
    { label: 'Email', url: 'mailto:ashishk4371@gmail.com', icon: 'mail' },
  ],
  stats: [
    { value: '6+', label: 'Years shipping' },
    { value: '10+', label: 'Projects delivered' },
    { value: '12', label: 'Open-source repos' },
    { value: '99.9%', label: 'Uptime maintained' },
  ],
};
