import { Profile } from '../models';

export const PROFILE: Profile = {
  name: 'Ashish Kumar',
  role: 'Software Engineer',
  summary: [
    'I am a software engineer based in New Delhi, India. I work mostly on backend systems in Java and Spring Boot, with Kafka, PostgreSQL and Snowflake for the data side, and Angular when a project needs a front end.',
    'I am currently at HUB Platform Technologies, building data pipelines, orchestration and trade-matching tools for financial services. Before that I worked at FoundIt (formerly Monster.com) and Avizva Solutions.',
  ],
  location: 'New Delhi, India',
  email: 'ashishk4371@gmail.com',
  photo: '/profile.svg',
  resumeUrl: '/resume.pdf',
  socials: [
    { label: 'GitHub', url: 'https://github.com/ashishk4371', icon: 'github' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ashishk4371/', icon: 'linkedin' },
    // TODO: replace with your real Instagram profile URL.
    { label: 'Instagram', url: 'https://www.instagram.com/findingashish', icon: 'instagram' },
    { label: 'Email', url: 'mailto:ashishk4371@gmail.com', icon: 'mail' },
  ],
};
