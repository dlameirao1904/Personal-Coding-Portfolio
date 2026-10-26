# PL — Processamento de Linguagens

Dois trabalhos de Processamento de Linguagens e Compiladores, ambos em Python com PLY. O primeiro transforma CSV em JSON; o segundo compila uma linguagem imperativa pequena para o assembly de uma máquina virtual.

Código: [`Third/PL`](../../Third/PL).

## TP1 — CSV para JSON

`TP1/tp1_ex5.py` é um analisador léxico. Os tokens reconhecem campos de cabeçalho, separadores, números e campos que declaram uma lista, no formato `Notas{5}` ou `Notas{5}::func`. A ideia, escrita no próprio ficheiro, é passar de CSV para JSON: o número entre chavetas diz quantos valores pertencem àquele campo.

Há três CSV de alunos (`alunos.csv`, `alunos2.csv`, `alunos3.csv`) e um resultado, `alunosconver.json`. O enunciado está em `plc22tp1.pdf`.

## TP2 — linguagem li_PLC

`TP2` define uma linguagem imperativa, a li_PLC, inspirada em C, e compila-a para o assembly da VM da cadeira. As notas de desenho estão em `PLC_TP2.txt`.

A linguagem tem:

- inteiros, com aritmética, relações e lógica (`E`, `OU`);
- atribuição, leitura (`LER`) e escrita (`ESCREVER`);
- seleção (`SE`, `SENAO`, `SENAOSE`) e ciclos (`ENQUANTO`, `PARA`, e `repeat-until`);
- arrays de uma dimensão e matrizes;
- subprogramas sem parâmetros que devolvem um inteiro.

`toks_file.py` é o lexer e `language.py` é a gramática YACC. Cada produção emite instruções da VM (`PUSH`, `PUSHN`, `STOREG`, `START`/`STOP`). O parser guarda os nomes num mapa de registos e recusa redeclarar uma variável ou atribuir a um nome que não é inteiro.

`testes` tem programas de exemplo (arrays, matrizes, erros) e o `.vm` gerado para cada um. `ply/` é a cópia da biblioteca usada pelo trabalho. O enunciado está em `plc22tp2.pdf`.
