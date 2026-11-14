import { Project } from '../models';

export const PROJECTS: readonly Project[] = [
  {
    slug: 'pomodoro-clock',
    title: 'Pomodoro Clock',
    tagline: 'Trying out c language to create something useful.',
    description: ['A minimal pomodoro clock that does its job'],
    year: 2026,
    category: 'open-source',
    status: 'shipped',
    featured: false,
    stack: ['C', 'SDL'],
    highlights: ['', '', ''],
    metrics: [
      { value: '3.8kB', label: 'Gzipped' },
      { value: '96%', label: 'Test coverage' },
    ],
    links: [
      {
        label: 'Check it out on Github',
        url: 'https://github.com/ashishk4371/pomodoro-clock',
        icon: 'github',
      },
    ],
    cover: [212, 252],
  },
];
