/**
 * Seed dates are relative to "now", so the mock data always looks fresh:
 * "created 2 days ago" stays 2 days ago whenever you open the app.
 */
export function ago({ days = 0, hours = 0, minutes = 0 }): string {
  const ms = ((days * 24 + hours) * 60 + minutes) * 60 * 1000
  return new Date(Date.now() - ms).toISOString()
}
