import { notFound } from "next/navigation";
import Link from "next/link";
import { QuizForm } from "@/components/quiz-form";
import { getQuizBySlug } from "@/lib/quizzes";

export const dynamic = "force-dynamic";

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = await getQuizBySlug(slug);

  if (!quiz) notFound();

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link className="text-sm font-bold text-gold-dark" href="/">
          MIRJE • Conectados no Altar
        </Link>
        <section className="card mt-6 overflow-hidden">
          <div className="bg-night p-6 text-white sm:p-10">
            <span className="text-sm font-black uppercase tracking-[0.24em] text-gold">Quiz ativo</span>
            <h1 className="mt-3 text-3xl font-black sm:text-5xl">{quiz.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">{quiz.description}</p>
          </div>
          <QuizForm quiz={quiz} />
        </section>
      </div>
    </main>
  );
}
