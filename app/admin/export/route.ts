import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return new NextResponse("Supabase nao configurado", { status: 503 });
  }

  const { data, error } = await supabase
    .from("submissions")
    .select("participant_name,age,phone,cell_group,leader_name,is_visitor,wants_follow_up,prayer_request,created_at")
    .order("created_at", { ascending: false });

  if (error) return new NextResponse("Erro ao exportar", { status: 500 });

  const header = ["nome", "idade", "telefone", "celula", "lider", "visitante", "acompanhamento", "pedido_oracao", "data"];
  const rows = (data ?? []).map((row) =>
    header
      .map((key) => {
        const value = row[key as keyof typeof row] ?? "";
        return `"${String(value).replaceAll('"', '""')}"`;
      })
      .join(",")
  );

  return new NextResponse([header.join(","), ...rows].join("\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=mirje-respostas.csv"
    }
  });
}
