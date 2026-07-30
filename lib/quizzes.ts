import { getPublicSupabase } from "@/lib/supabase";
import { sampleQuiz, sampleQuizSummary } from "@/lib/sample-data";
import type { PublicQuestion, PublicQuiz, QuizSummary } from "@/lib/types";

type QuizRow = {
  id: string;
  title: string;
  description: string;
  slug: string;
  cover_image_url: string | null;
  show_score: boolean;
  require_identification: boolean;
  final_verse: string | null;
  final_message: string | null;
};

type QuestionRow = {
  id: string;
  prompt: string;
  question_type: PublicQuestion["type"];
  points: number;
  required: boolean;
  question_options: { id: string; label: string }[];
};

export async function getPublicQuizzes(): Promise<QuizSummary[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [sampleQuizSummary];

  const { data, error } = await supabase
    .from("quizzes")
    .select("id,title,description,slug,cover_image_url")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error || !data?.length) return [sampleQuizSummary];
  return data;
}

export async function getQuizBySlug(slug: string): Promise<PublicQuiz | null> {
  const supabase = getPublicSupabase();
  if (!supabase) return slug === sampleQuiz.slug ? sampleQuiz : null;

  const { data: quiz, error } = await supabase
    .from("quizzes")
    .select("id,title,description,slug,cover_image_url,show_score,require_identification,final_verse,final_message")
    .eq("slug", slug)
    .eq("status", "active")
    .single<QuizRow>();

  if (error || !quiz) return slug === sampleQuiz.slug ? sampleQuiz : null;

  const { data: questions } = await supabase
    .from("questions")
    .select("id,prompt,question_type,points,required,question_options(id,label)")
    .eq("quiz_id", quiz.id)
    .order("position", { ascending: true })
    .returns<QuestionRow[]>();

  return {
    ...quiz,
    questions: (questions ?? []).map((question) => ({
      id: question.id,
      prompt: question.prompt,
      type: question.question_type,
      points: question.points,
      required: question.required,
      options: question.question_options ?? []
    }))
  };
}
