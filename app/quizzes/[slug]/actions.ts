"use server";

import { z } from "zod";
import { getServiceSupabase } from "@/lib/supabase";

const participantSchema = z.object({
  fullName: z.string().trim().min(3).max(120),
  age: z.coerce.number().int().min(1).max(120).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional(),
  cellGroup: z.string().trim().max(120).optional(),
  leaderName: z.string().trim().max(120).optional(),
  isVisitor: z.boolean().default(false),
  wantsFollowUp: z.boolean().default(false),
  prayerRequest: z.string().trim().max(1200).optional()
});

const answerSchema = z.object({
  questionId: z.string().uuid().or(z.string().min(1)),
  value: z.union([z.string(), z.array(z.string())])
});

export async function submitQuiz(_: unknown, formData: FormData) {
  const rawParticipant = {
    fullName: String(formData.get("fullName") ?? ""),
    age: formData.get("age") ? String(formData.get("age")) : "",
    phone: String(formData.get("phone") ?? ""),
    cellGroup: String(formData.get("cellGroup") ?? ""),
    leaderName: String(formData.get("leaderName") ?? ""),
    isVisitor: formData.get("isVisitor") === "on",
    wantsFollowUp: formData.get("wantsFollowUp") === "on",
    prayerRequest: String(formData.get("prayerRequest") ?? "")
  };

  const participant = participantSchema.safeParse(rawParticipant);
  const quizId = String(formData.get("quizId") ?? "");
  const answersPayload = String(formData.get("answers") ?? "[]");
  const idempotencyKey = String(formData.get("idempotencyKey") ?? "");

  if (!participant.success || !quizId || !idempotencyKey) {
    return { ok: false, message: "Confira os dados obrigatorios antes de enviar." };
  }

  let answers: z.infer<typeof answerSchema>[] = [];
  try {
    answers = z.array(answerSchema).parse(JSON.parse(answersPayload));
  } catch {
    return { ok: false, message: "Nao foi possivel validar as respostas." };
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    return {
      ok: true,
      message: "Resposta registrada no modo de teste. Configure o Supabase para salvar envios reais."
    };
  }

  const { data: submission, error } = await supabase
    .from("submissions")
    .insert({
      quiz_id: quizId,
      participant_name: participant.data.fullName,
      age: participant.data.age || null,
      phone: participant.data.phone || null,
      cell_group: participant.data.cellGroup || null,
      leader_name: participant.data.leaderName || null,
      is_visitor: participant.data.isVisitor,
      wants_follow_up: participant.data.wantsFollowUp,
      prayer_request: participant.data.prayerRequest || null,
      idempotency_key: idempotencyKey
    })
    .select("id")
    .single();

  if (error || !submission) {
    return { ok: false, message: "Nao foi possivel salvar agora. Tente novamente em alguns instantes." };
  }

  if (answers.length) {
    const { error: answersError } = await supabase.from("answers").insert(
      answers.map((answer) => ({
        submission_id: submission.id,
        question_id: answer.questionId,
        answer_text: Array.isArray(answer.value) ? answer.value.join(", ") : answer.value
      }))
    );

    if (answersError) {
      return { ok: false, message: "O envio foi criado, mas houve erro ao salvar as respostas." };
    }
  }

  return { ok: true, message: "Resposta enviada com sucesso. Deus abencoe sua participacao!" };
}
