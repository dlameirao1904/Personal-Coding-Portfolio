# LA1 — Laboratórios de Algoritmia

Interpretador, em C, de uma linguagem baseada em pilha. O programa lê uma linha do standard input, avalia-a e imprime o estado final da pilha.

Código: [`First/LA1`](../../First/LA1). O alvo CMake chama-se `CCPL3G05_main` (C11).

## O que faz

`main` lê uma linha (até 10240 caracteres), chama `eval` e imprime a pilha resultante. O parser percorre os tokens e despacha cada operador para o módulo certo.

A linguagem trabalha sobre uma stack. Os módulos cobrem as famílias de operações habituais neste tipo de interpretador:

| Módulo | Responsabilidade |
| --- | --- |
| `stack` | Estrutura da pilha e impressão |
| `parser` | Leitura da linha e despacho dos tokens |
| `math_operations` | Aritmética |
| `logic` | Operações lógicas e relacionais |
| `arrays` / `parse_Array` | Arrays |
| `mystring` / `parse_String` | Strings |
| `converter` | Conversões de tipo |
| `functions` | Operações de ordem superior e blocos |

A ligação à biblioteca matemática faz-se com `-lm`.

## Como está organizado

Cada família de operadores vive num par `.c` / `.h`. `parser.c` é o ponto de entrada da avaliação; `stack.c` é a estrutura partilhada por todos os módulos.
