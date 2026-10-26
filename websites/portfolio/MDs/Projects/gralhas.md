# Gralhas

Site da associação da aldeia de Gralhas, no Larouco. Apresenta a aldeia, o que a associação faz, os eventos, e as formas de participar. Está publicado em [associacao-de-gralhas.com](https://www.associacao-de-gralhas.com/).

É uma aplicação Vue com Vuetify. O código está em `gralhas/websites/gralhas`. Os eventos vivem no Supabase. Os formulários de contacto, sócio e donativo saem por EmailJS.

## Páginas

- **Entrada.** Hero com a aldeia no verão e no inverno, a história na encosta da Serra do Larouco, o propósito da associação e os valores.
- **Associação.** A localidade e a A.R.D.S.C.G., o que a associação é e um convite a juntar-se.
- **Ações.** Cultura e tradição, desporto e lazer, apoio social e combate à desertificação.
- **Eventos.** Lista e detalhe do que está publicado: título, capa, descrição e galeria. Se não houver nada, a página diz isso.
- **Contactos.** Telefone, email, sede, a equipa e um formulário de mensagem.
- **Agir.** Tornar-se sócio ou fazer um donativo.
- **Admin.** Área reservada à direção, em `/admin_gralhas`. Depois do login dá para criar eventos: título, descrição, capa e fotografias, gravados no Supabase.
