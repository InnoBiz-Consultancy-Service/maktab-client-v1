/**
 * Format calendar date strings (YYYY-MM-DD) into a human readable string.
 * This is timezone-safe and never feeds the raw string to new Date(),
 * preventing date-shifting issues in different client locales.
 */
export function formatCalendarDate(dateStr: string): string {
  if (!dateStr) return "—";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  
  if (isNaN(year) || isNaN(month) || isNaN(day)) return dateStr;
  
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const monthName = months[month - 1];
  if (!monthName) return dateStr;
  
  return `${monthName} ${day}, ${year}`;
}
