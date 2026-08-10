import { Testimonial } from '../models';

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: 't1',
    quote:
      'Ashish is the engineer I hand the ambiguous problems to. He comes back with a design, the trade-offs written down, and usually a prototype that already answers half the questions.',
    author: 'Priya Raghavan',
    role: 'VP Engineering',
    company: 'Northwind Labs',
  },
  {
    id: 't2',
    quote:
      'Our checkout rewrite could easily have taken a year. He scoped it into shippable slices and we were live in eleven weeks with no rollback.',
    author: 'Daniel Osei',
    role: 'Head of Product',
    company: 'Lumen Retail',
  },
  {
    id: 't3',
    quote:
      'The accessibility work he did on our platform passed audit first time — I have never seen that happen before or since.',
    author: 'Meera Iyer',
    role: 'Design Director',
    company: 'Brightfold Studio',
  },
];
