/**
 * In-memory fixed-window rate limiter (PRD 17).
 *
 * Deliberately not durable. A serverless instance holds this map only for
 * its own lifetime, and concurrent instances do not share it, so a
 * determined flooder can get more through than the nominal limit. That is
 * an accepted trade for the MVP: this exists to stop a script hammering
 * the form from one address, and the honeypot covers the common bot. The
 * real ceiling is the database.
 *
 * Moving to Upstash Redis would make it exact across instances, which is
 * worth doing if spam actually arrives — not before.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** Entries are only dropped while the map is being touched anyway. */
function sweep(now: number) {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  /** Seconds until the window resets; 0 when allowed. */
  retryAfter: number;
};

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();

  // Cheap enough at this size, and it keeps the map from growing without
  // bound on a long-lived instance.
  if (windows.size > 500) sweep(now);

  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfter: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfter: 0 };
}
