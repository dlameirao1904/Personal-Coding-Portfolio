# Tandem

App Vue 3 + Vite + Tailwind (`tw-`) para **uma/duas ou mais pessoas**:

| Área | Dados |
| --- | --- |
| **Finanças** | Casa partilhada (ganhos/gastos por categoria), vista **soma** ou **individual** |
| **Alimentação** | Plano semanal + calorias, **só o utilizador autenticado** |
| **Treino** | Peso, sessões, **só o utilizador autenticado** |

## Porque não IndexedDB?

IndexedDB fica **só no browser** de cada pessoa. Para duas contas com finanças em comum precisas de **base de dados na cloud + autenticação**.

**Supabase** (a tua escolha): Postgres, Auth, Row Level Security (RLS).

O front na **Vercel** continua estático; os dados vivem no Supabase.

### Opcional mais tarde

- IndexedDB como **cache offline** (Dexie) com sync, se quiseres PWA offline a sério.

## Setup Supabase

1. Cria projeto em [supabase.com](https://supabase.com)
2. **SQL Editor** → migrations por ordem: `001` … `005`
3. **Authentication** → ativa Email (e desativa confirmação de email em dev, se quiseres)
4. **Project Settings → API** → copia URL e `anon` key
5. Na raiz do repo:

```bash
cp .env.example .env   # se existir; senão cria .env manualmente
```

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
# ou, no painel novo: VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

## Fluxo dos dois utilizadores

1. Pessoa A: registo → **Casa** → criar casa → partilhar `invite_code`
2. Pessoa B: registo → **Casa** → entrar com código
3. Finanças: ambos veem movimentos da casa; filtros “Casa (soma)”, “Só eu” ou por membro
4. Alimentação / Treino: RLS `user_id = auth.uid()` — nunca mistura

## Comandos

```bash
npm install
npm run dev
npm run build
```

## Vercel

- Define `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nas Environment Variables do projeto
- Build: `npm run build`, output `dist`

## Categorias de finanças (por casa)

Criadas automaticamente ao criar casa: poupança, alimentação, saídas, combustível, carro, saúde, educação, casa, salário, etc.

## Código fonte (GitHub)

Versionado no monorepo pessoal [`dlameirao1904/Personal-Coding-Portfolio`](https://github.com/dlameirao1904/Personal-Coding-Portfolio) → pasta `websites/tandem`.

## Próximos passos

- Gráfico de peso
- Metas de calorias diárias
- Orçamento mensal por categoria
- PWA offline com cache (opcional)
