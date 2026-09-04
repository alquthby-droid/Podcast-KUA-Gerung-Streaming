export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const formattedMins = mins < 10 ? `0${mins}` : `${mins}`;
  const formattedSecs = secs < 10 ? `0${secs}` : `${secs}`;
  return `${formattedMins}:${formattedSecs}`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

export const INDONESIAN_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const INDONESIAN_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];

/**
 * Format date to full Indonesian date: "Jumat, 4 September 2026"
 */
export function formatIndonesianFullDate(dateInput: Date | string | number = new Date()): string {
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';
  const dayName = INDONESIAN_DAYS[d.getDay()];
  const dayNum = d.getDate();
  const monthName = INDONESIAN_MONTHS[d.getMonth()];
  const year = d.getFullYear();
  return `${dayName}, ${dayNum} ${monthName} ${year}`;
}

/**
 * Return separated date parts for structured badges
 */
export function getIndonesianDateDetails(dateInput: Date | string | number = new Date()) {
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) {
    return {
      dayName: 'Senin',
      dateNum: '1',
      monthName: 'Januari',
      year: '2026',
      fullDate: 'Senin, 1 Januari 2026',
      timeString: '00:00 WITA'
    };
  }
  const dayName = INDONESIAN_DAYS[d.getDay()];
  const dateNum = String(d.getDate()).padStart(2, '0');
  const monthName = INDONESIAN_MONTHS[d.getMonth()];
  const year = String(d.getFullYear());
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');

  return {
    dayName,
    dateNum,
    monthName,
    year,
    fullDate: `${dayName}, ${d.getDate()} ${monthName} ${year}`,
    timeString: `${hours}:${mins} WITA`
  };
}
