import { Profile } from '../models';

export const PROFILE: Profile = {
  name: 'Ashish Kumar',
  role: 'Software Engineer',
  summary: [
    'In a world full of AI slop, here\'s my 2 rupees.'
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
