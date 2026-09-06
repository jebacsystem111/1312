const EN_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Dni partii: wtorek (2) i piątek (5). */
export const BATCH_DAYS = [2, 5] as const;

const weekdayInWarsaw = (d: Date) =>
  EN_WEEKDAYS.indexOf(
    new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "Europe/Warsaw" }).format(d),
  );

/**
 * Najbliższy dzień partii. Zamówienia złożone do 12:00 w dniu partii jadą tego samego dnia,
 * po 12:00 - następną partią.
 */
export function nextBatchDate(now: Date = new Date()): Date {
  const d = new Date(now.getTime());
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", timeZone: "Europe/Warsaw" }).format(d),
  );
  const sameDayIsBatch = BATCH_DAYS.includes(weekdayInWarsaw(d) as (typeof BATCH_DAYS)[number]);

  if (sameDayIsBatch && hour < 12) return d;

  for (let i = 0; i < 8; i += 1) {
    d.setDate(d.getDate() + 1);
    if (BATCH_DAYS.includes(weekdayInWarsaw(d) as (typeof BATCH_DAYS)[number])) return d;
  }
  return d;
}

export const batchLabel = (now?: Date) =>
  new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Warsaw",
  }).format(nextBatchDate(now));
