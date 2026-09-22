# ТОТТИ Спортын Агентлаг

Next.js (App Router) + TypeScript + Tailwind CSS дээр бүтээгдсэн ТОТТИ Спортын Агентлагийн вэбсайт.

## Хөгжүүлэлт

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) дээр нээгдэнэ.

## Бүтэц

- `src/app` — App Router хуудсууд (`/` нүүр хуудас, `/meeting` уулзалт товлох).
- `src/components` — Header, Hero, Roster, Services, Partners, CTA, Footer, theme switch, PDF modal, booking form зэрэг UI хэсгүүд.
- `src/lib` — Статик контентын өгөгдөл (тамирчид, үйлчилгээ, түнш байгууллага) ба booking form-ийн туслах функцууд.
- `public/images`, `public/documents` — Зураг болон тамирчдын PDF танилцуулга.

## Онцлог

- Light / Dark / System theme switch (`next-themes`, header дэх товч).
- Roster хэсгийн expanding panel интерактив.
- Тамирчдын PDF профайл харах modal.
- `/meeting` — уулзалт товлох маягт (Gmail compose линк үүсгэдэг).

## Build

```bash
npm run build
npm run start
```
