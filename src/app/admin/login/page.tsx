import { LoginForm } from "./LoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-1 px-6">
      <div className="w-full max-w-sm border border-line-strong bg-bg-0 p-8">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber">ТОТТИ Admin</p>
        <h1 className="mt-2 font-display text-3xl uppercase leading-none">Нэвтрэх</h1>
        <LoginForm next={next ?? "/admin"} />
      </div>
    </div>
  );
}
