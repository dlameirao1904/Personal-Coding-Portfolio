# IC — Interação e Concorrência

Trabalho prático de computação quântica da unidade de Interação e Concorrência. O núcleo é uma implementação do algoritmo de Grover, em Qiskit, para procurar as soluções de uma fórmula booleana de três variáveis.

Código: [`Third/IC`](../../Third/IC). Autores no notebook: Diogo Aires (A91685) e Nuno Machado (A68702).

## Grover

`TP - CQ/grover.ipynb` constrói o circuito para a fórmula

```
f(v1, v2, v3) = (¬v1 ∨ ¬v2 ∨ ¬v3) ∧ (v1 ∨ ¬v2 ∨ v3) ∧ (v1 ∨ v2 ∨ ¬v3)
              ∧ (v1 ∨ ¬v2 ∨ ¬v3) ∧ (¬v1 ∨ v2 ∨ v3)
```

O notebook usa `QuantumCircuit`, registos quânticos e clássicos, `ZGate` e `MCXGate`, corre o circuito no simulador `Aer` e desenha o histograma das medições. O enunciado e uma exportação do trabalho estão em `IC2223.pdf` e `grover.pdf`.

## Material de apoio

`images` junta figuras usadas na parte conceptual: bits e qubits, esfera de Bloch, sobreposição, endianness e empresas de computação quântica.

`Untitled.ipynb` é um apontamento à parte, em Sage, que calcula a ordem multiplicativa de 2 no anel dos inteiros módulo 5. O trabalho entregue é o notebook do Grover.
