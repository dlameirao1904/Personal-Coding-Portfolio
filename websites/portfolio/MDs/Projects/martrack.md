# MarTrack

Área privada para gerir o atelier: registo de bolos, agenda de entregas e números de faturação e lucro. O nome mostrado na barra é MarTrack. No Vite chama-se `Martrack`. O `package.json` ainda diz `app-template`.

Tudo o que está dentro de `/` exige sessão. Sem sessão, o router manda para `/login`. Com sessão, `/login` manda para o dashboard.

## Como correr

Na pasta `martrack`:

```sh
npm install
npm run dev
```

`npm run build` gera a versão de produção.

Variáveis:

| Variável | Uso |
| --- | --- |
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anónima, para auth, tabela `cake`, tabela `profile` e storage `avatars` |

O cliente está em `src/lib/supabaseClient.ts`. Se faltar alguma variável, o arranque escreve um erro na consola e as chamadas falham.

## Autenticação

Login por email e palavra-passe, em `views/Auth/Login.vue`, via `composables/useAuth.ts` e `api/auth.ts` (`signInWithPassword` do Supabase).

A store `store/auth.ts` guarda o utilizador da sessão e ouve `onAuthStateChange`. O guarda em `src/router/index.ts` chama `fetchUser` antes de deixar passar uma rota protegida.

O logout está na barra e volta ao login. A API também tem `register`, mas o ecrã de login não o usa.

## Páginas

A barra abre um menu lateral com Dashboard, Perfil, Bolos e A minha Agenda. O avatar e o nome vêm da tabela `profile`.

| Rota | Vista | O que faz |
| --- | --- | --- |
| `/login` | `views/Auth/Login.vue` | Entrada. Só para quem não tem sessão. |
| `/dashboard` | `views/Dashboards/Dashboard.vue` | Totais e gráficos. É o destino de `/`. |
| `/profile/info` | `views/Profile/Info.vue` | Nome, telefone e foto. O email da conta não se edita aqui. |
| `/cakes` | `views/Cake/Cakes.vue` | Grelha de bolos e formulário de criar ou editar. |
| `/agenda` | `views/Agenda/Agenda.vue` | Calendário das entregas. |

## Bolos

`api/cake.ts` lê, cria e actualiza a tabela `cake`. Não há apagar.

O formulário (`views/Cake/CakeForm.vue`) grava:

- nome e cliente
- preço de venda e custo de produção
- local e data de entrega
- URL da foto
- `seeInWebSite`, se o bolo deve aparecer no site
- `addToAnnualCounting`, se entra nas contas do dashboard

A listagem mostra foto, nome, cliente e preço, e abre o mesmo formulário para editar.

O dashboard também soma `priceOtherProductsWithCakes` à faturação. Esse campo não está no formulário: se existir na linha do Supabase, conta; a partir do MarTrack não se preenche.

## Dashboard

Lê todos os bolos e fica com os que têm `addToAnnualCounting`, data válida e ano posterior a 1970.

No topo: faturação total (preço mais extras), lucro (faturação menos custo de produção), número de bolos e margem.

Por baixo, um selector de ano com os mesmos números só desse ano, o mês com mais bolos, um gráfico de barras mensal (faturação e lucro, ApexCharts), os locais de entrega mais frequentes e os cinco clientes com mais encomendas.

## Agenda

Três vistas, com Moment em português: dia, semana (a vista inicial) e mês. Dá para andar para trás e para a frente e voltar a hoje.

Um bolo é **concluído** quando a data é anterior a hoje, e **próxima encomenda** quando é hoje ou depois. Na semana, cada dia mostra os dois grupos em cartões (`CakeTimeLineCard`). No dia e no mês, os grupos aparecem em secções (`AgendaSection`).

## Perfil

`api/user.ts` lê e faz upsert na tabela `profile` pelo id do utilizador. A foto vai para o bucket `avatars` e o URL público fica em `fotoUrl`.

## Ligação ao site

Os dois projectos usam o mesmo Supabase. Um bolo criado aqui pode entrar no portefólio do Atelier se a foto tiver URL e o site o considerar visível.

Há um desencontro de nome: o formulário grava `seeInWebSite` e o portefólio filtra `seeInWebSIte`. Com os nomes diferentes, o interruptor **Visível no Website** não é o que o site lê. As fotos estáticas do portefólio aparecem à mesma, porque não dependem desta flag.

Os pedidos feitos no site chegam por email. Não criam uma linha em `cake`. Para entrarem na agenda ou nas contas, alguém regista o bolo no MarTrack.

## Stack

A mesma base do Atelier: Vue 3, Vue Router, Vuetify 3, Pinia, Tailwind, TypeScript e Vite 5. A diferença relevante é `apexcharts` / `vue3-apexcharts` no dashboard. Auth, bolos e perfil passam pelo Supabase; Axios fica do template e não é o caminho destes ecrãs.
