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

export const timeOptions = [
  { value: "Өглөө", range: "09:00–12:00" },
  { value: "Өдөр", range: "12:00–17:00" },
  { value: "Орой", range: "17:00–20:00" },
];

export const formatOptions = [
  { value: "Биечлэн", sub: "Улаанбаатар" },
  { value: "Онлайн", sub: "Видео дуудлага" },
  { value: "Утсаар", sub: "Дуудлага" },
];

export const MAIL_TO = "info@totti.mn";
