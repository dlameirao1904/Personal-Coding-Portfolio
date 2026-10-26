# SO — Sistemas Operativos

Dois programas em C que comunicam por um named pipe: um executa comandos e o outro monitoriza os processos.

Código: [`Second/SO`](../../Second/SO). As fontes estão em `src`; `bin`, `obj` e `tmp` são pastas de compilação.

## Papeis

`tracer` recebe um comando, faz `fork` e `execvp`, e escreve no pipe `tracer_to_monitor` o PID, o nome do programa e o instante de arranque. No fim espera pelo filho e regista o tempo decorrido (`gettimeofday`). Se o monitor ainda não criou o pipe, o tracer termina com erro.

`monitor` mantém duas listas ligadas:

| Estrutura | O que guarda |
| --- | --- |
| `Process_Executing` | Processos a correr: PID, programa, instante de início |
| `Process` | Processos já terminados: PID, programa, duração em milissegundos |

A partir daí responde a pedidos de estado (`runStatus`, `runStatusTime`) e trata sinais (`signal_handler_C`). O ciclo de vida é o habitual: um processo entra na lista dos que estão a correr quando o tracer o lança, e passa para a lista dos terminados quando acaba.

## Ficheiros

| Ficheiro | Conteúdo |
| --- | --- |
| `src/tracer.c`, `src/tracer.h` | Lançamento de comandos e escrita no pipe |
| `src/monitor.c`, `src/monitor.h` | Listas de processos, estado e sinais |
