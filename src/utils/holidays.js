export const INDIAN_HOLIDAYS_DATA = [
  { month: 0, date: 26, name: 'Republic Day' },
  { month: 4, date: 1, name: 'Labour Day' },
  { month: 7, date: 15, name: 'Independence Day' },
  { month: 9, date: 2, name: 'Gandhi Jayanti' },
  { month: 11, date: 25, name: 'Christmas Day' },
  // Depending on the year, Diwali, Holi, etc., change. But we're sticking to fixed dates for simplicity as requested by the prompt.
];

export function getHolidaysForDate(dateObj) {
  if (!dateObj) return [];
  const m = dateObj.getMonth();
  const d = dateObj.getDate();
  return INDIAN_HOLIDAYS_DATA.filter(h => h.month === m && h.date === d);
}

export function getHolidaysForMonth(monthIndex) {
  return INDIAN_HOLIDAYS_DATA.filter(h => h.month === monthIndex);
}
