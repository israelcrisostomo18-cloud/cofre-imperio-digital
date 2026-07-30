import { AdminLoginForm } from "@/components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <section className="card w-full max-w-md p-6 sm:p-8">
        <span className="text-sm font-black uppercase tracking-[0.22em] text-gold-dark">Area administrativa</span>
        <h1 className="mt-3 text-3xl font-black text-night">Entrar no painel MIRJE</h1>
        <p className="mt-3 text-slate-700">Acesso exclusivo para administradores autenticados no Supabase.</p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
