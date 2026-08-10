import { formatDuration, formatLongDate, formatMonthYear } from './date.util';

describe('formatMonthYear', () => {
  it('renders a short month and full year', () => {
    expect(formatMonthYear('2024-03-15')).toBe('Mar 2024');
  });
});

describe('formatLongDate', () => {
  it('renders a readable full date', () => {
    expect(formatLongDate('2026-06-18')).toBe('June 18, 2026');
  });
});

describe('formatDuration', () => {
  it('reports years and months together', () => {
    expect(formatDuration('2021-01-01', '2023-03-31')).toBe('2 yrs 3 mos');
  });

  it('omits the year part for short stints', () => {
    expect(formatDuration('2024-01-01', '2024-04-30')).toBe('4 mos');
  });

  it('singularises a single year', () => {
    expect(formatDuration('2023-01-01', '2023-12-31')).toBe('1 yr');
  });

  it('treats a null end date as ongoing', () => {
    // Any current role spans at least one month, whenever the suite runs.
    expect(formatDuration(new Date().toISOString(), null)).toBe('1 mo');
  });
});
