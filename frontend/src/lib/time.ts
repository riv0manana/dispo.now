/**
 * Converts a UTC time string (HH:MM) to a Local time string (HH:MM).
 * e.g., "07:00" (UTC) -> "09:00" (Local UTC+2)
 */
export function utcToLocalTime(utcTime: string): string {
  if (!utcTime) return "";
  
  const [hours, minutes] = utcTime.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return utcTime;

  const date = new Date();
  date.setUTCHours(hours, minutes, 0, 0);

  const localHours = date.getHours().toString().padStart(2, '0');
  const localMinutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${localHours}:${localMinutes}`;
}

/**
 * Converts a Local time string (HH:MM) to a UTC time string (HH:MM).
 * e.g., "09:00" (Local UTC+2) -> "07:00" (UTC)
 */
export function localToUtcTime(localTime: string): string {
  if (!localTime) return "";

  const [hours, minutes] = localTime.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return localTime;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  const utcHours = date.getUTCHours().toString().padStart(2, '0');
  const utcMinutes = date.getUTCMinutes().toString().padStart(2, '0');

  return `${utcHours}:${utcMinutes}`;
}
