import { SkillGroup } from '../models';

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    id: 'backend',
    title: 'Backend',
    description: 'APIs and services built to be operated.',
    icon: 'server',
    skills: [
      { name: 'Java', level: 5 },
      { name: 'Spring Boot', level: 5 },
      { name: 'kafka', level: 5 },
      { name: 'PostgreSQL', level: 4 },
      { name: 'Redis', level: 4 },
      { name: 'Go', level: 3 },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    description: 'Interfaces that stay fast as they grow.',
    icon: 'layout',
    skills: [
      { name: 'TypeScript', level: 5 },
      { name: 'Angular', level: 5 },
      { name: 'RxJS & Signals', level: 5 },
      { name: 'React', level: 4 },
      { name: 'SCSS / CSS Architecture', level: 5 },
    ],
  },
  {
    id: 'platform',
    title: 'Platform & DevOps',
    description: 'The unglamorous work that makes releases boring.',
    icon: 'cloud',
    skills: [
      { name: 'Docker', level: 4 },
      { name: 'Azure (ACA, Blob Store, Functions)', level: 5 },
      { name: 'AWS (ECS, S3, Lambda)', level: 4 },
      { name: 'Terraform', level: 3 },
      { name: 'Observability (OTel)', level: 3 },
    ],
  },
  {
    id: 'practice',
    title: 'Ways of working',
    description: 'How the code actually gets built.',
    icon: 'compass',
    skills: [
      { name: 'Testing strategy', level: 4 },
      { name: 'Design systems', level: 4 },
      { name: 'Technical writing', level: 4 },
      { name: 'Code review & mentoring', level: 4 },
      { name: 'Performance budgets', level: 4 },
    ],
  },
];
