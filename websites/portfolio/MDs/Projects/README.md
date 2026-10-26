# Marina

Workspace do Atelier da Marina, em Pitões das Júnias. Tem duas aplicações Vue e uma pasta de fotografias.

| Pasta | O que é | Documento |
| --- | --- | --- |
| [`atelier`](../atelier) | Site público: história, portefólio e pedidos de orçamento | [atelier.md](./atelier.md) |
| [`martrack`](../martrack) | Área privada: bolos, agenda e números do atelier | [martrack.md](./martrack.md) |
| [`nePhotos`](../nePhotos) | Fotografias de origem, copiadas para o site | — |

As duas apps nasceram do mesmo template Vue 3 (Vite, Vuetify, Pinia, Tailwind). Ainda trazem peças desse template que o site e o MarTrack não usam, como `GoogleMap` e `WelcomeToAgrovilaDialog`.

Partilham a mesma base Supabase. O MarTrack grava bolos na tabela `cake`. O site lê essa tabela para completar o portefólio e usa o storage `encomendas` para as fotos dos pedidos.
