export const DOW_SHORT = ["Ням", "Дав", "Мяг", "Лха", "Пүр", "Баа", "Бям"];
export const DOW_LONG = [
  "Ням гараг",
  "Даваа гараг",
  "Мягмар гараг",
  "Лхагва гараг",
  "Пүрэв гараг",
  "Баасан гараг",
  "Бямба гараг",
];

export type DayOption = {
  iso: string;
  dayNum: number;
  month: number;
  weekday: number;
  isWeekend: boolean;
};

export function buildNext14Days(): DayOption[] {
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const days: DayOption[] = [];
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const wk = d.getDay();
    days.push({
      iso,
      dayNum: d.getDate(),
      month: d.getMonth() + 1,
      weekday: wk,
      isWeekend: wk === 0 || wk === 6,
    });
  }
  return days;
}

export const roleOptions = ["Тамирчин", "Клубын төлөөлөгч", "Спонсор / түнш", "Бусад"];

export type TimeSlot = { value: string; range: string };

function buildHourlySlots(startHour: number, endHour: number): TimeSlot[] {
  const pad = (n: number) => String(n).padStart(2, "0");
  const slots: TimeSlot[] = [];
  for (let h = startHour; h < endHour; h++) {
    slots.push({ value: `${pad(h)}:00`, range: `${pad(h)}-${pad(h + 1)}` });
  }
  return slots;
}

// Ажлын цаг: 09:00–20:00 хооронд 1 цагийн интервалаар (09-10, 10-11 … 19-20)
export const timeOptions: TimeSlot[] = buildHourlySlots(9, 20);

export const formatOptions = [
  { value: "Биечлэн", sub: "Улаанбаатар" },
  { value: "Онлайн", sub: "Видео дуудлага" },
  { value: "Утсаар", sub: "Дуудлага" },
];

export const MAIL_TO = "info@totti.mn";
