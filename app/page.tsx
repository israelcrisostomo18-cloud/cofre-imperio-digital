import Link from "next/link";
import { getPublicQuizzes } from "@/lib/quizzes";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const quizzes = await getPublicQuizzes();
  const singleQuiz = quizzes.length === 1 ? quizzes[0] : null;

  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-12 sm:px-8">
        <div className="mb-8 inline-flex w-fit rounded-full border border-gold/40 bg-white/70 px-4 py-2 text-sm font-bold text-gold-dark">
          MIRJE • CONECTADOS NO ALTAR
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-night sm:text-5xl lg:text-6xl">
              Quizzes biblicos para conectar, ensinar e acompanhar pessoas.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
              Responda o quiz ativo da MIRJE e participe das dinamicas da rede Conectados no Altar com uma experiencia simples, rapida e segura pelo celular.
            </p>
          </div>

          <div className="card p-5 sm:p-8">
            {singleQuiz ? (
              <QuizCallout quiz={singleQuiz} />
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-night">Quizzes disponiveis</h2>
                <div className="grid gap-4">
                  {quizzes.map((quiz) => (
                    <QuizListItem key={quiz.slug} quiz={quiz} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function QuizCallout({ quiz }: { quiz: Awaited<ReturnType<typeof getPublicQuizzes>>[number] }) {
  return (
    <article>
      <span className="text-sm font-black uppercase tracking-[0.22em] text-gold-dark">Quiz ativo</span>
      <h2 className="mt-3 text-3xl font-black text-night">{quiz.title}</h2>
      <p className="mt-3 text-slate-700">{quiz.description}</p>
      <Link className="gold-button mt-7 w-full" href={`/quizzes/${quiz.slug}`}>
        Comecar quiz
      </Link>
    </article>
  );
}

function QuizListItem({ quiz }: { quiz: Awaited<ReturnType<typeof getPublicQuizzes>>[number] }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-mist p-5">
      <h3 className="text-xl font-black text-night">{quiz.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-700">{quiz.description}</p>
      <Link className="outline-button mt-4 w-full" href={`/quizzes/${quiz.slug}`}>
        Comecar
      </Link>
    </article>
  );
}
