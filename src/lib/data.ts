export type Stat = {
  value: number;
  label: string;
};

export const scoreboardStats: Stat[] = [
  { value: 34, label: "Төлөөлж буй тамирчин" },
  { value: 212, label: "Байгуулсан гэрээ" },
  { value: 14, label: "Лигтэй хамтын ажиллагаа" },
  { value: 11, label: "Жилийн туршлага" },
];

export type AboutItem = {
  idx: string;
  title: string;
  desc: string;
};

export const aboutItems: AboutItem[] = [
  {
    idx: "01",
    title: "Гэрээний хамгаалалт",
    desc: "Клубтэй хийх гэрээ бүрийг тамирчны эрх ашгийг тэргүүнд тавьж хянана.",
  },
  {
    idx: "02",
    title: "Карьерын төлөвлөгөө",
    desc: "Улирал болгонд зорилтоо шинэчилж, дараагийн алхмыг хамтдаа тодорхойлно.",
  },
  {
    idx: "03",
    title: "Брэнд, санхүү",
    desc: "Спонсорын гэрээ, орлогын менежментийг тамирчны нэрийн өмнөөс удирдана.",
  },
];

export type RosterStat = { value: string; label: string };

export type RosterPlayer = {
  id: string;
  ghost: string;
  pos: string;
  jersey?: string;
  name: string;
  team: string;
  photo?: string;
  stats: RosterStat[];
};

export const rosterPlayers: RosterPlayer[] = [
  {
    id: "ganbaatar",
    ghost: "PG",
    pos: "POINT GUARD",
    name: "Б. Ганбаатар",
    team: '"Улаанбаатар Тахь" клуб',
    photo: "/images/player-ganbaatar.jpg",
    stats: [
      { value: "18.4", label: "PPG" },
      { value: "7.2", label: "AST" },
      { value: "3.1", label: "STL" },
    ],
  },
  {
    id: "munkhbat",
    ghost: "SG",
    pos: "SHOOTING GUARD",
    jersey: "#23",
    name: "Э. Мөнхбат",
    team: '"Хангай Дракон" клуб',
    stats: [
      { value: "22.9", label: "PPG" },
      { value: "4.0", label: "AST" },
      { value: "5.6", label: "REB" },
    ],
  },
  {
    id: "tumurbaatar",
    ghost: "C",
    pos: "CENTER",
    jersey: "#14",
    name: "Д. Төмөрбаатар",
    team: '"Алтайн Бүргэд" клуб',
    stats: [
      { value: "15.1", label: "PPG" },
      { value: "11.4", label: "REB" },
      { value: "2.3", label: "BLK" },
    ],
  },
];

export type ServiceItem = {
  idx: string;
  title: string;
  desc: string;
  path: string;
};

export const services: ServiceItem[] = [
  {
    idx: "01",
    title: "Гэрээ хэлэлцээр",
    desc: "Клуб, лигтэй хийх гэрээний нөхцөлийг нарийвчлан хэлэлцэж, тамирчны талд ашигтай шийдвэрийг гаргаж өгнө.",
    path: "M9 12l2 2 4-4M7.8 21l4.2-4 4.2 4M4 5h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5z",
  },
  {
    idx: "02",
    title: "Карьерын стратеги",
    desc: "Клуб солих, гадаадад тоглох боломж зэрэг чухал шийдвэрийг мэдээлэлд тулгуурлан төлөвлөнө.",
    path: "M3 3v18h18M7 14l4-4 3 3 5-6",
  },
  {
    idx: "03",
    title: "Брэнд, спонсорлолт",
    desc: "Тамирчны нэр хүндэд тохирсон брэндийн түншлэл, зар сурталчилгааны гэрээг зохион байгуулна.",
    path: "M12 2l2.4 6.6L21 10l-5.4 4.2L17 21l-5-3.6L7 21l1.4-6.8L3 10l6.6-1.4z",
  },
  {
    idx: "04",
    title: "Гүйцэтгэлийн шинжилгээ",
    desc: "Тоглолт бүрийн статистикийг хянаж, дараагийн гэрээний хэлэлцээрт нотолгоо болгон ашиглана.",
    path: "M4 21V9M10 21V3M16 21v-7M4 9l6-6 6 6 4-4",
  },
  {
    idx: "05",
    title: "Эрүүл мэнд, сэргэлт",
    desc: "Гэмтлээс сэргийлэх, сэргээх мэргэжилтнүүдийн сүлжээгээр тамирчдыг тоглолтод бэлэн байлгана.",
    path: "M12 21c-4-3-8-6.5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 4.5-4 8-8 11z",
  },
  {
    idx: "06",
    title: "Гэр бүл, амьдрал",
    desc: "Нүүх, орон сууц, эрх зүйн зөвлөгөө зэрэг талбайн гаднах бүх зохион байгуулалтыг хариуцна.",
    path: "M3 21h18M6 21V7l6-4 6 4v14M10 21v-6h4v6",
  },
];

export type Partner = {
  name: string;
  src: string;
};

export const partners: Partner[] = [
  { name: "Монголын Алт (МАК) ХХК", src: "/images/partner-mak.png" },
  { name: "Оюу Толгой", src: "/images/partner-oyutolgoi.jpg" },
  { name: "Хаан Банк", src: "/images/partner-pickpack.jpg" },
];

export type PdfKey = "male" | "female";

export type PdfDocEntry = {
  name: string;
  url: string;
  label: string;
};

export type PdfDocuments = Record<PdfKey, PdfDocEntry>;

export const pdfDocuments: PdfDocuments = {
  male: {
    name: "Totti_Male_Players_2026-27.pdf",
    url: "/documents/Totti_Male_Players_2026-27.pdf",
    label: "Эрэгтэй",
  },
  female: {
    name: "Totti_Female_Players_2026-27.pdf",
    url: "/documents/Totti_Female_Players_2026-27.pdf",
    label: "Эмэгтэй",
  },
};

export const navLinks = [
  { href: "#about", label: "Бидний тухай" },
  { href: "#roster", label: "Тамирчид" },
  { href: "#services", label: "Үйлчилгээ" },
  { href: "#contact", label: "Холбоо барих" },
];
