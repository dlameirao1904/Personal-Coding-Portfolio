# Atelier da Marina

Site público do atelier de cake design da Marina, em Pitões das Júnias (Padaria Pitões). O visitante vê o trabalho, escolhe sabores e pede um orçamento. Não há login.

O nome interno no Vite é `Atelier da Marina`. O `package.json` ainda diz `app-template`. O deploy está preparado para a Vercel: `vercel.json` reescreve todas as rotas para `index.html`.

## Como correr

Na pasta `atelier`:

```sh
npm install
npm run dev
```

`npm run build` gera a versão de produção. `npm run preview` serve essa build.

Variáveis usadas pelo site:

| Variável | Uso |
| --- | --- |
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anónima, para ler bolos e enviar fotos de referência |

Sem estas duas, o portefólio continua a mostrar as fotos locais e o pedido de orçamento falha no envio das imagens. O EmailJS está configurado no código do formulário.

## Páginas

A rota `/` redirecciona para `/atelier`. A navegação principal está na barra: Sobre, Pitões, Portefólio, Sabores e o botão **Criar o meu bolo**. No telemóvel esses links passam para um menu lateral. O rodapé acrescenta Categorias e os contactos (telefone, morada, Instagram e Facebook da Padaria Pitões).

| Rota | Vista | O que faz |
| --- | --- | --- |
| `/atelier` | `views/Homepage/Homepage.vue` | Entrada. Apresenta a Marina, três bolos em destaque com botão de encomenda e um excerto da história. |
| `/about` | `views/About/About.vue` | História do atelier, da Padaria Pitões e da família Marinho. |
| `/pitoes` | `views/Pitões/Pitoes.vue` | A aldeia, o mosteiro e a padaria. |
| `/portfolio` | `views/Portfolio/Portfolio.vue` | Galeria por separadores. |
| `/sabores` | `views/Flavors/Flavors.vue` | Massas e recheios, lidos de `src/data/flavors.ts`. |
| `/categories` | `views/Categories/Categories.vue` | Menu por estilo: bento, florais, pasta de açúcar, toppers, personalizados e vintage. As fotos vêm das pastas em `src/assets/images`. O botão de encomendar abre o pedido sem levar a categoria. |
| `/order` | `views/Order/Order.vue` | Pedido de orçamento em quatro passos. |

Há um ticker por cima da barra. O preço base mostrado no pedido é 17 € por kg. Modelagens 3D ficam de fora desse valor.

## Portefólio

Os separadores são Bolos, Miniaturas, Bolachas, Fatias e Modelagens.

A maior parte das fotos está no código, em `src/assets/images` e em `src/assets/images/nePhotos`. Os originais dessa segunda pasta estão também na raiz do workspace, em `nePhotos`.

Ao abrir o portefólio, a vista lê a tabela `cake` e fica com os registos em que `seeInWebSIte` é verdadeiro. Essas fotos entram na grelha de bolos (e nas modelagens, se o nome ou o ficheiro for classificado assim). Miniaturas, bolachas e fatias vêm só das fotos locais.

Clicar numa foto (excepto fatias) mostra o botão de encomenda. Esse botão guarda nome e imagem em `sessionStorage` (`atelier-inspiration`) e abre `/order?inspiracao=1`. O formulário mostra a foto escolhida e deixa retirá-la.

## Pedido de orçamento

Quatro passos, em `Order.vue`:

1. **O momento.** Nome, nome para o bolo, contacto, idade opcional, data de entrega, e número de pessoas ou peso.
2. **A tua ideia.** Notas e fotos de referência.
3. **Os sabores.** Uma ou mais massas e um ou mais recheios, os mesmos de `src/data/flavors.ts`.
4. **O resumo.** Confirmação antes de enviar.

No envio, as fotos vão para o bucket Supabase `encomendas`. O texto do pedido, com os links dessas fotos, sai por EmailJS. O pedido não é gravado na tabela `cake`. Quem o recebe trata-o à parte; o MarTrack não o importa sozinho.

## Stack

Vue 3, Vue Router, Vuetify 3, Pinia, Tailwind, Sass, TypeScript e Vite 5. Plugins de Vite: auto-import, componentes, layouts, PWA, optimização de imagens e Sentry. Axios e Yup estão no projecto por virem do template; o fluxo do site não depende deles.

O cliente Supabase é criado dentro de `Portfolio.vue` e de `Order.vue`, não num módulo partilhado.
