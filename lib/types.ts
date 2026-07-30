export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "true_false"
  | "short_text"
  | "long_text"
  | "scale";

export type PublicQuiz = {
  id: string;
  title: string;
  description: string;
  slug: string;
  cover_image_url?: string | null;
  show_score: boolean;
  require_identification: boolean;
  final_verse?: string | null;
  final_message?: string | null;
  questions: PublicQuestion[];
};

export type PublicQuestion = {
  id: string;
  prompt: string;
  type: QuestionType;
  points: number;
  required: boolean;
  options: PublicOption[];
};

export type PublicOption = {
  id: string;
  label: string;
};

export type QuizSummary = Pick<PublicQuiz, "id" | "title" | "description" | "slug" | "cover_image_url">;
