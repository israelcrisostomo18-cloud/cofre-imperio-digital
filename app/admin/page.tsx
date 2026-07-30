import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getServiceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabaseAuth = await createSupabaseServerClient();
  const user = supabaseAuth ? (await supabaseAuth.auth.getUser()).data.user : null;

  if (supabaseAuth && !user) redirect("/admin/login");

  const service = getServiceSupabase();
  const [quizzes, submissions] = await Promise.all([
    service?.from("quizzes").select("id,title,slug,status,created_at").order("created_at", { ascending: false }),
    service?.from("submissions").select("id,participant_name,phone,cell_group,is_visitor,wants_follow_up,created_at,quiz_id").order("created_at", { ascending: false }).limit(20)
  ]);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="text-sm font-black uppercase tracking-[0.22em] text-gold-dark">Painel MIRJE</span>
            <h1 className="mt-2 text-4xl font-black text-night">Administracao dos quizzes</h1>
          </div>
          <Link className="outline-button" href="/admin/export">Exportar CSV</Link>
        </header>

        {!service ? (
          <section className="dark-card p-6">
            <h2 className="text-2xl font-black">Supabase ainda nao configurado</h2>
            <p className="mt-2 text-slate-200">Preencha as variaveis de ambiente e rode as migrations em `supabase/migrations` para ativar o painel real.</p>
          </section>
        ) : null}

        <section className="grid gap-5 md:grid-cols-3">
          <Metric label="Quizzes" value={quizzes?.data?.length ?? 0} />
          <Metric label="Participantes recentes" value={submissions?.data?.length ?? 0} />
          <Metric label="Com acompanhamento" value={submissions?.data?.filter((item) => item.wants_follow_up).length ?? 0} />
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="card p-6">
            <h2 className="text-2xl font-black text-night">Quizzes</h2>
            <div className="mt-4 space-y-3">
              {(quizzes?.data ?? []).map((quiz) => (
                <div key={quiz.id} className="rounded-2xl bg-mist p-4">
                  <strong className="block text-night">{quiz.title}</strong>
                  <small className="font-bold text-slate-600">/{quiz.slug} • {quiz.status}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-2xl font-black text-night">Ultimos participantes</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {(submissions?.data ?? []).map((submission) => (
                <div key={submission.id} className="p-5">
                  <strong className="text-night">{submission.participant_name}</strong>
                  <p className="text-sm text-slate-600">{submission.phone || "Sem telefone"} • {submission.cell_group || "Sem celula"}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="dark-card p-6">
      <span className="text-sm font-bold text-gold">{label}</span>
      <strong className="mt-2 block text-4xl font-black">{value}</strong>
    </div>
  );
}
