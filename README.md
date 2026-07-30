# MIRJE Quizzes

Plataforma de quizzes biblicos da **MIRJE - Ministerio Internacional Reconstruindo Jerusalem**, criada para a rede **Conectados no Altar**.

## Comandos

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm start
```

## Rotas

- `/` - lista ou apresenta o quiz ativo.
- `/quizzes/[slug]` - area publica de resposta.
- `/admin` - painel administrativo protegido por Supabase Auth.
- `/admin/login` - login de administradores.
- `/admin/export` - exportacao CSV das respostas.

## Ambiente

Copie `.env.example` para `.env.local` e preencha as variaveis do Supabase. Nunca publique a chave `SUPABASE_SERVICE_ROLE_KEY` em variaveis `NEXT_PUBLIC_`.

Leia `SETUP.md` para o passo a passo completo.
