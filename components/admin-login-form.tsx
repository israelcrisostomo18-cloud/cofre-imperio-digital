"use client";

import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Entrando...");

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      setMessage("Configure as variaveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
      return;
    }

    const supabase = createClient(url, key);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("Nao foi possivel entrar. Confira email e senha.");
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <label className="block">
        <span className="text-sm font-black text-night">Email</span>
        <input className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label className="block">
        <span className="text-sm font-black text-night">Senha</span>
        <input className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      <button className="gold-button w-full" type="submit">Acessar painel</button>
      {message ? <p className="text-sm font-bold text-slate-700">{message}</p> : null}
    </form>
  );
}
