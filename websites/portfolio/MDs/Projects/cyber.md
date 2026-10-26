# SIEM local

MVP educativo de um SIEM (Security Information and Event Management). Está em `cyber/siem`. A base é pequena e usa só a biblioteca padrão do Python, para se perceber e substituir cada peça. Não é um produto para produção e a API não deve ficar exposta à Internet.

O fluxo é este: o coletor lê o log de autenticação, normaliza cada linha num evento JSON, a API guarda o evento em SQLite e corre uma regra. O painel mostra o que entrou e os alertas.

## Coletor

`agent/collector.py` segue o fim de um ficheiro de log (por defeito `/var/log/auth.log`) e fica à espera de linhas novas. Só trata SSH. Reconhece palavra-passe falhada e autenticação aceite, e grava um evento em `logs.jsonl` com timestamp, origem, serviço, tipo, utilizador, IP, estado e a mensagem original. `SIEM_LOG_FILE` e `SIEM_OUTPUT_FILE` mudam a entrada e a saída, para experimentar sem ler o log do sistema.

Nesta versão o coletor ainda não envia sozinho para a API. O contrato está feito para um `POST /events` a seguir.

## API

`backend/main.py` escuta em `http://127.0.0.1:8000`.

- `POST /events` valida o evento (obrigatórios: timestamp, source, event_type, message) e guarda-o.
- `GET /events` e `GET /alerts` devolvem os registos recentes, com um limite.
- `GET /health` confirma que a API está de pé.

`database.py` cria `siem.db` e trata de eventos e alertas. `rules.py` tem uma regra, `AUTH-BRUTE-FORCE-001`: severidade alta quando o mesmo IP falha a autenticação pelo menos cinco vezes numa janela de cinco minutos.

## Frontend

Páginas estáticas em `frontend/`. Servidas à parte (por exemplo na porta 5500), consultam saúde, eventos e alertas e mostram contagens, a lista recente e as deteções. O CORS da API está limitado a esse endereço local.
