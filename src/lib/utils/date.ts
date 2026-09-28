/**
 * Date formatting for public-facing content.
 *
 * "Present" (PRD §13) is not a date — it is the absence of an end date
 * on a current role, so it is produced here rather than stored.
 */

const MONTH_YEAR = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/**
 * Formats a date column as "July 2026".
 *
 * Postgres `date` arrives as 'YYYY-MM-DD'. Parsing that with the local
 * timezone would shift it a day backwards west of UTC and could show the
 * previous month, so the formatter is pinned to UTC.
 */
export function formatMonthYear(value: string | Date | null): string {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(`${value}T00:00:00Z`) : value;
  if (Number.isNaN(date.getTime())) return '';
  return MONTH_YEAR.format(date);
}

/**
 * Formats an experience or education range.
 *
 *   formatDateRange('2026-07-01', null, true)         → 'July 2026 - Present'
 *   formatDateRange('2025-01-01', '2025-12-01', false) → 'January 2025 - December 2025'
 */
export function formatDateRange(
  start: string | Date | null,
  end: string | Date | null,
  current = false,
): string {
  const from = formatMonthYear(start);
  if (!from) return '';
  if (current) return `${from} - Present`;
  const to = formatMonthYear(end);
  return to ? `${from} - ${to}` : from;
}

/**
 * Formats a timestamp for the admin inbox.
 *
 * The timezone is pinned, like MONTH_YEAR above. Without it the server
 * formats in UTC and the browser in the visitor's zone, so the two render
 * different text and hydration fails. Pinning to WIB is honest for this
 * portfolio: the only person reading the inbox is its owner.
 */
const DATE_TIME = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Jakarta',
});

export function formatDateTime(value: string | Date | null): string {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  return DATE_TIME.format(date);
}
