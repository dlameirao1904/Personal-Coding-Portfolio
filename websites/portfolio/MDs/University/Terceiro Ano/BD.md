# BD — Bases de Dados

Dois trabalhos de modelação e SQL. O primeiro desenha um serviço de entregas de bebidas; o segundo fecha a cadeira com uma base de dados de eventos.

Código: [`Third/BD`](../../Third/BD).

## Beerlivery

Pasta: `TP`. Schema MySQL `beerlivery`, gerado a partir de um modelo do MySQL Workbench (`Modelo Logico/Entregas.mwb`).

O domínio é uma operação de entrega: clientes fazem encomendas, itens saem de armazéns e estafetas levam-nas em veículos.

Tabelas principais:

| Grupo | Tabelas |
| --- | --- |
| Clientes | `Tipo_Cliente`, `Cliente`, `Morada`, `Metodo_Pagamento` |
| Catálogo | `Marca`, `Categoria`, `Item`, `Item_Armazem` |
| Operação | `Armazem`, `Funcionario_Armazem`, `Estafeta`, `Tipo_Veiculo`, `Veiculo` |
| Encomendas | `Encomenda`, `Encomenda_Item`, `Estado` |

Além do `CREATE` (`SQL/CreateDB.sql`) há povoamento, queries, vistas, triggers e procedimentos armazenados. O modelo conceptual está em `Brmodelo conteito` e o relatório em `Relatorio_do_Trabalho.pdf`.

## Eventos

Pasta: `Last Project`. Base `Eventos` (2023/2024), escrita à mão em `create_tables.sql`.

Um cliente faz um pedido (local, data, preço máximo, tipo). Esse pedido torna-se um evento, com local final, preço, horário e número de pessoas. Funcionários são atribuídos ao evento pela tabela `Evento_tem_Funcionario`.

| Tabela | Papel |
| --- | --- |
| `Cliente` | Quem pede o evento |
| `Pedido` | Pedido, com morada pedida e preço máximo |
| `Funcionario` | Pessoas que executam o evento |
| `Evento` | Evento concreto, ligado a um pedido |
| `Evento_tem_Funcionario` | Atribuição de funcionários |

À volta do esquema estão `povoamento_tabelas.sql`, `Queries.sql`, `Views.sql`, `Function.sql`, `Procedures.sql` e o `Relatorio_Final_BD_2023_2024.pdf`.
