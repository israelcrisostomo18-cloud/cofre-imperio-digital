import type { PublicQuiz, QuizSummary } from "@/lib/types";

export const sampleQuiz: PublicQuiz = {
  id: "demo-conectados",
  title: "Quiz Conectados no Altar",
  description: "Um quiz biblico rapido para jovens, visitantes e celulas da MIRJE.",
  slug: "conectados-no-altar",
  show_score: true,
  require_identification: true,
  final_verse: "Reconstruirei o tabernaculo caido de Davi. Atos 15:16",
  final_message: "Obrigado por participar. A lideranca podera acompanhar suas respostas no painel.",
  questions: [
    {
      id: "q1",
      prompt: "Qual livro narra a reconstrucao dos muros de Jerusalem?",
      type: "single_choice",
      points: 10,
      required: true,
      options: [
        { id: "q1-a", label: "Neemias" },
        { id: "q1-b", label: "Jonas" },
        { id: "q1-c", label: "Romanos" }
      ]
    },
    {
      id: "q2",
      prompt: "Em uma escala de 1 a 10, quanto voce deseja se envolver nas atividades dos jovens?",
      type: "scale",
      points: 0,
      required: true,
      options: []
    }
  ]
};

export const sampleQuizSummary: QuizSummary = {
  id: sampleQuiz.id,
  title: sampleQuiz.title,
  description: sampleQuiz.description,
  slug: sampleQuiz.slug,
  cover_image_url: null
};
