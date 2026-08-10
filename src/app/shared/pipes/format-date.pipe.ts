import { Pipe, PipeTransform } from '@angular/core';

import { formatLongDate, formatMonthYear, formatRelative } from '../../core/utils';

export type DateFormat = 'long' | 'month-year' | 'relative';

/**
 * Date formatting for the shapes this site actually uses.
 *
 * Pure (the default), so it is evaluated once per input change rather than on
 * every check — which matters for the blog list where it renders per card.
 */
@Pipe({ name: 'appDate' })
export class FormatDatePipe implements PipeTransform {
  transform(value: string | null | undefined, format: DateFormat = 'long'): string {
    if (!value) return '';

    switch (format) {
      case 'month-year':
        return formatMonthYear(value);
      case 'relative':
        return formatRelative(value);
      default:
        return formatLongDate(value);
    }
  }
}
