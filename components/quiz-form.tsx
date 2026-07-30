"use client";

import { useActionState, useMemo, useState } from "react";
import { submitQuiz } from "@/app/quizzes/[slug]/actions";
import type { PublicQuiz } from "@/lib/types";

type AnswerState = Record<string, string | string[]>;

export function QuizForm({ quiz }: { quiz: PublicQuiz }) {
  const [answers, setAnswers] = useState<AnswerState>({});
  const [state, action, pending] = useActionState(submitQuiz, null);
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);

  function updateAnswer(questionId: string, value: string, multiple = false) {
    setAnswers((current) => {
      if (!multiple) return { ...current, [questionId]: value };
      const previous = Array.isArray(current[questionId]) ? (current[questionId] as string[]) : [];
      const next = previous.includes(value) ? previous.filter((item) => item !== value) : [...previous, value];
      return { ...current, [questionId]: next };
    });
  }

  const serializedAnswers = quiz.questions.map((question) => ({
    questionId: question.id,
    value: answers[question.id] ?? ""
  }));

  return (
    <form action={action} className="space-y-8 p-6 sm:p-10">
      <input type="hidden" name="quizId" value={quiz.id} />
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
      <input type="hidden" name="answers" value={JSON.stringify(serializedAnswers)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome completo" name="fullName" required />
        <Field label="Idade" name="age" type="number" />
        <Field label="Telefone ou WhatsApp" name="phone" />
        <Field label="Celula" name="cellGroup" />
        <Field label="Nome do lider" name="leaderName" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="rounded-2xl bg-mist p-4 font-bold text-night">
          <input className="mr-2" type="checkbox" name="isVisitor" /> Sou visitante
        </label>
        <label className="rounded-2xl bg-mist p-4 font-bold text-night">
          <input className="mr-2" type="checkbox" name="wantsFollowUp" /> Desejo acompanhamento
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-black text-night">Pedido de oracao opcional</span>
        <textarea
          className="focus-ring mt-2 min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
          name="prayerRequest"
        />
      </label>

      <div className="space-y-5">
        {quiz.questions.map((question, index) => (
          <article key={question.id} className="rounded-3xl border border-slate-200 bg-white p-5">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-gold-dark">
              Pergunta {index + 1}
            </span>
            <h2 className="mt-2 text-xl font-black text-night">{question.prompt}</h2>
            <div className="mt-4 grid gap-3">
              {renderQuestion(question, answers, updateAnswer)}
            </div>
          </article>
        ))}
      </div>

      {state?.message ? (
        <p className={`rounded-2xl p-4 font-bold ${state.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
          {state.message}
        </p>
      ) : null}

      {quiz.final_verse ? <p className="text-center text-sm font-bold text-gold-dark">{quiz.final_verse}</p> : null}

      <button className="gold-button w-full" disabled={pending} type="submit">
        {pending ? "Enviando..." : "Enviar respostas"}
      </button>
    </form>
  );
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-night">{label}</span>
      <input
        className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
        name={name}
        type={type}
        required={required}
      />
    </label>
  );
}

function renderQuestion(
  question: PublicQuiz["questions"][number],
  answers: AnswerState,
  updateAnswer: (questionId: string, value: string, multiple?: boolean) => void
) {
  if (question.type === "short_text" || question.type === "long_text") {
    return (
      <textarea
        className="focus-ring min-h-24 rounded-2xl border border-slate-200 px-4 py-3"
        required={question.required}
        onChange={(event) => updateAnswer(question.id, event.target.value)}
      />
    );
  }

  if (question.type === "scale") {
    return (
      <input
        className="focus-ring rounded-2xl border border-slate-200 px-4 py-3"
        max={10}
        min={1}
        required={question.required}
        type="number"
        onChange={(event) => updateAnswer(question.id, event.target.value)}
      />
    );
  }

  const multiple = question.type === "multiple_choice";
  return question.options.map((option) => (
    <label key={option.id} className="cursor-pointer rounded-2xl border border-slate-200 bg-mist p-4 font-bold text-night">
      <input
        className="mr-2"
        name={question.id}
        type={multiple ? "checkbox" : "radio"}
        value={option.label}
        required={!multiple && question.required}
        onChange={() => updateAnswer(question.id, option.label, multiple)}
      />
      {option.label}
    </label>
  ));
}
