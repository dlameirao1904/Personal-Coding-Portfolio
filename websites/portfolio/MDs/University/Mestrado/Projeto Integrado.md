# Projeto Integrado

Plataforma de gestão de uma operação de produção. Junta um backoffice para clientes, vendas, encomendas e modelos 3D com um otimizador que escalona ordens de produção em máquinas, a minimizar energia, água e mudanças de setup.

Código: [`Master In Mathematics and Computing/Projeto Integrado`](../../Master%20In%20Mathematics%20and%20Computing/Projeto%20Integrado).

São três peças que comunicam entre si.

```
vertice (Vue)  --HTTP-->  edges (Strapi / PostgreSQL)
       |
       +--------HTTP-->  optimizer.py (FastAPI / PuLP)
```

## edges — API

Strapi 5 em TypeScript, com PostgreSQL (`pg`) e o plugin `users-permissions`. É a fonte de dados da interface.

Coleções próprias:

| Coleção | Para que serve |
| --- | --- |
| `client`, `individual`, `company`, `address` | Clientes e moradas |
| `supplier` | Fornecedores |
| `product`, `sale`, `expense` | Catálogo, vendas e despesas |
| `production-order`, `asset` | Ordens de produção e as máquinas onde correm |
| `component-variable`, `model-component`, `model-simulator` | Peças e variáveis dos modelos 3D |
| `transform-model`, `transform-last-model` | Transformações aplicadas aos modelos |
| `menu`, `log` | Navegação e registo de atividade |

Há também scripts de apoio na raiz do projeto: `seed-variables.ts` até `seed-variables4.ts` para povoar variáveis, e `fix-orders.ts` / `fiz-prod.ts` para corrigir ordens e produtos.

## vertice — interface

Vue 3 com Vite, Vuetify, Pinia, Vue Router e Axios. Three.js desenha os modelos; ECharts desenha os gráficos do dashboard.

A área autenticada (login, registo, recuperação de password) abre para:

| Vista | Função |
| --- | --- |
| Homepage | Dashboard com indicadores |
| Sales, Expenses | Vendas e despesas |
| Clients, Suppliers, Employees | Pessoas e empresas |
| Products | Catálogo |
| Agenda, Timeline | Calendário e linha temporal |
| 3D Models | Vista completa de um modelo e das suas componentes |
| Optimizer | Ecrã que pede uma escalonização ao serviço de otimização |
| Profile | Conta do utilizador |

## optimizer.py — escalonamento

API FastAPI. O endpoint `POST /api/optimize` recebe ordens, máquinas, tarifas e um horizonte temporal, e resolve um problema linear inteiro com PuLP (solver CBC).

Cada ordem tem duração, grupo de tipo e consumo de água. Cada máquina tem um fator de energia. A variável de decisão `x[ordem, máquina, instante]` é binária e indica onde e quando a ordem começa; `y[i, j]` indica que a ordem `j` segue a ordem `i` na mesma máquina.

O custo a minimizar soma três parcelas: energia (fator da máquina vezes tarifa, por cada bloco ocupado), água (consumo da ordem vezes tarifa) e setups (penalidade quando duas ordens seguidas são de grupos diferentes). Cada ordem é atribuída exatamente uma vez. Entre duas ordens na mesma máquina admite-se um intervalo até 4 blocos.

A resposta, quando o solver encontra ótimo, devolve o custo, a energia total, a água total, o número de setups e a sequência `(orderId, assetId, startTime)`. O CORS está aberto para `http://localhost:3000`, que é de onde a interface Vue chama o serviço.
