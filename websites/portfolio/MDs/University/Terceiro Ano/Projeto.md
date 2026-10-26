# Projeto — consulta de acórdãos

Aplicação Flask para consultar um conjunto de acórdãos. O dataset é um JSON carregado no arranque; as páginas são templates HTML.

Código: [`Third/PROJETO/Proj`](../../Third/PROJETO/Proj). O enunciado está em `Projeto.pdf`.

## Aplicação

`app.py` lê `datasets/atco1_acordaos_Ids.json` e expõe cinco rotas:

| Rota | Página |
| --- | --- |
| `/` | `homepage.html` |
| `/informações` | `informações.html` |
| `/informações/autores` | `autores.html` |
| `/acordaos` | lista, `acordaos.html` |
| `/acordaos/<id>` | ficha de um acórdão, ou um JSON de erro se o id não existir |

A pesquisa do acórdão percorre a lista `acordaos` e compara o campo `id`.

## Outros ficheiros

`data.py`, `novoIds.py` e `novoPost.py` tratam da preparação dos dados (identificadores e carregamento). Os templates usam `static/w3.css`. As imagens em `static/images` incluem os autores e um exemplo do ficheiro JSON.

O servidor arranca com `app.run(debug=True)`.
