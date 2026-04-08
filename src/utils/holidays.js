/**
 * holidays.js — Indian National Holidays & Observances
 *
 * Each entry: { name, date (day-of-month), month (0-indexed), type }
 * Exported helpers:
 *   getHolidaysForMonth(monthIndex)  → holidays falling in that month
 *   getHolidaysForDate(monthIndex, day) → holidays on that exact date
 */

const HOLIDAYS = [
  // ── January ───────────────────────────────────────────────────────────────
  { name: 'New Year',           date: 1,  month: 0,  type: 'observance' },
  { name: 'Republic Day',      date: 26, month: 0,  type: 'national'   },

  // ── February ──────────────────────────────────────────────────────────────
  { name: "Valentine's Day",   date: 14, month: 1,  type: 'observance' },

  // ── March ─────────────────────────────────────────────────────────────────
  { name: 'Holi',              date: 14, month: 2,  type: 'national'   },

  // ── April ─────────────────────────────────────────────────────────────────
  { name: 'Ambedkar Jayanti',  date: 14, month: 3,  type: 'national'   },

  // ── May ───────────────────────────────────────────────────────────────────
  { name: 'May Day',           date: 1,  month: 4,  type: 'observance' },

  // ── June ──────────────────────────────────────────────────────────────────
  { name: 'Yoga Day',          date: 21, month: 5,  type: 'observance' },

  // ── August ────────────────────────────────────────────────────────────────
  { name: 'Independence Day',  date: 15, month: 7,  type: 'national'   },

  // ── September ─────────────────────────────────────────────────────────────
  { name: 'Teachers Day',      date: 5,  month: 8,  type: 'observance' },

  // ── October ───────────────────────────────────────────────────────────────
  { name: 'Gandhi Jayanti',    date: 2,  month: 9,  type: 'national'   },
  { name: 'Dussehra',          date: 12, month: 9,  type: 'national'   },

  // ── November ──────────────────────────────────────────────────────────────
  { name: 'Diwali',            date: 1,  month: 10, type: 'national'   },
  { name: "Children's Day",    date: 14, month: 10, type: 'observance' },

  // ── December ──────────────────────────────────────────────────────────────
  { name: 'Christmas',         date: 25, month: 11, type: 'observance' },
];

/**
 * Return all holidays that fall in a given month.
 * @param {number} monthIndex — 0-indexed (0 = January … 11 = December)
 * @returns {{ name: string, date: number, month: number, type: string }[]}
 */
export function getHolidaysForMonth(monthIndex) {
  return HOLIDAYS.filter((h) => h.month === monthIndex);
}

/**
 * Return holidays on a specific date.
 * @param {number} monthIndex — 0-indexed
 * @param {number} day        — day of month (1-31)
 * @returns {{ name: string, date: number, month: number, type: string }[]}
 */
export function getHolidaysForDate(monthIndex, day) {
  return HOLIDAYS.filter((h) => h.month === monthIndex && h.date === day);
}
