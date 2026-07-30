# Setup da plataforma MIRJE Quizzes

## 1. Criar projeto no Supabase

1. Acesse o Supabase e crie um novo projeto.
2. Abra `Project Settings > API`.
3. Copie a URL do projeto, a chave publishable/anon e a service role key.

## 2. Configurar variaveis

Crie `.env.local` no desenvolvimento e configure na Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no navegador.

## 3. Executar migrations

No painel do Supabase, abra o SQL Editor e execute:

`supabase/migrations/001_mirje_quiz_platform.sql`

Isso cria:

- `admin_profiles`
- `quizzes`
- `quiz_settings`
- `questions`
- `question_options`
- `submissions`
- `answers`

As tabelas usam UUID, timestamps, chaves estrangeiras, indices e Row Level Security.

## 4. Criar primeiro administrador

1. Em `Authentication > Users`, crie um usuario com email e senha.
2. Copie o `id` do usuario.
3. Execute no SQL Editor:

```sql
insert into public.admin_profiles (id, full_name, role)
values ('UUID_DO_USUARIO', 'Nome do administrador', 'owner');
```

## 5. Testar quiz

1. Rode `npm run dev`.
2. Abra `/`.
3. Acesse o quiz ativo.
4. Preencha os dados e envie.
5. Confira se a resposta entrou em `submissions` e `answers`.

## 6. Testar painel

1. Abra `/admin/login`.
2. Entre com o usuario criado no Supabase Auth.
3. Abra `/admin`.
4. Confira metricas, participantes recentes e exportacao CSV.

## 7. Publicar preview

1. Mantenha a branch `quiz-igreja`.
2. Envie a branch ao GitHub.
3. A Vercel deve gerar uma URL de Preview.
4. Teste pelo celular antes de substituir a producao.

## 8. Substituir o site antigo

Depois de aprovado:

1. Faça merge da `quiz-igreja` para `main` ou altere a branch de producao na Vercel.
2. Confirme que o dominio atual abre o sistema de quiz.
3. Verifique HTTPS, console do navegador e logs da Vercel.

## 9. Voltar para a versao anterior

O historico anterior continua preservado no Git. Para voltar:

1. Na Vercel, promova um deploy antigo.
2. Ou reverta o merge/commit que substituiu a landing.

## 10. Criar quiz

Use as tabelas `quizzes`, `questions` e `question_options`. O painel atual ja lista quizzes e participantes; as telas completas de criacao/edicao podem evoluir sobre a estrutura criada.

## 11. QR Code

Use a URL publica do quiz, por exemplo:

`https://seu-dominio.com/quizzes/conectados-no-altar`

Essa URL pode ser transformada em QR Code e compartilhada nas celulas e cultos.

## 12. Exportar respostas

Acesse `/admin/export` autenticado. O arquivo CSV contem dados dos participantes, filtros podem ser adicionados conforme a necessidade da lideranca.
