import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated, destroySession } from "@/lib/auth";

const navItems = [
  { href: "/admin/bookings", label: "Хүсэлтүүд" },
  { href: "/admin/stats", label: "Тоо баримт" },
  { href: "/admin/roster", label: "Тамирчид" },
  { href: "/admin/partners", label: "Түншүүд" },
  { href: "/admin/services", label: "Үйлчилгээ" },
];

async function logoutAction() {
  "use server";
  await destroySession();
  redirect("/admin/login");
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-bg-1">
      <header className="border-b border-line bg-bg-0">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-display text-lg uppercase tracking-wide">
              ТОТТИ <span className="text-amber">Admin</span>
            </Link>
            <nav className="flex flex-wrap gap-5 text-[13px] font-semibold uppercase tracking-wide text-muted">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="transition-colors hover:text-chalk">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-semibold uppercase tracking-wide text-muted hover:text-chalk">
              Сайт руу →
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="border border-line-strong px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors hover:border-chalk"
              >
                Гарах
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-6 py-10">{children}</main>
    </div>
  );
}
