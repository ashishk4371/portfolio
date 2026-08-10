/** "Mar 2024" — used across the experience timeline. */
export function formatMonthYear(iso: string, locale = 'en-US'): string {
  return new Date(iso).toLocaleDateString(locale, { month: 'short', year: 'numeric' });
}

/** "12 March 2024" — used for post bylines. */
export function formatLongDate(iso: string, locale = 'en-US'): string {
  return new Date(iso).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Human duration between two dates, e.g. "2 yrs 4 mos".
 * `end === null` is treated as "now", which is how ongoing roles are modelled.
 */
export function formatDuration(startIso: string, endIso: string | null): string {
  const start = new Date(startIso);
  const end = endIso ? new Date(endIso) : new Date();

  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years === 1 ? '' : 's'}`);
  if (months > 0) parts.push(`${months} mo${months === 1 ? '' : 's'}`);

  return parts.join(' ') || '1 mo';
}

/** "3 days ago" / "in 2 months", via Intl so it localises for free. */
export function formatRelative(iso: string, locale = 'en-US'): string {
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const deltaSeconds = (new Date(iso).getTime() - Date.now()) / 1000;

  const thresholds: readonly [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
  ];

  for (const [unit, seconds] of thresholds) {
    if (Math.abs(deltaSeconds) >= seconds) {
      return formatter.format(Math.round(deltaSeconds / seconds), unit);
    }
  }

  return formatter.format(Math.round(deltaSeconds), 'second');
}
