# CG — Computação Gráfica

Motor 3D e gerador de geometria, desenvolvidos em três fases ao longo do semestre. O gerador escreve ficheiros `.3d` com vértices; o engine lê uma cena em XML e desenha-a com OpenGL (GLEW, GLUT, pugixml).

Código: [`Third/CG`](../../Third/CG). Cada fase tem as suas pastas `Generator`, `Engine` e `data`.

Grupo da fase 2, pelo relatório: Jorge Silva (A80931), Diogo Aires (A91685), Márlon Ferreira (A81735), Cristiana Ribeiro (A91679).

## Fase 1 — primitivas

O gerador produz plano, caixa, esfera e cone. Cada primitiva é uma lista de triângulos gravada em `.3d` (número de vértices na primeira linha, depois coordenadas). O engine da fase 1 abre esses ficheiros e desenha os modelos referidos por um XML simples.

Ficheiros de geometria: `plane.cpp`, `box.cpp`, `sphere.cpp`, `cone.cpp`, orquestrados por `generator.cpp`.

## Fase 2 — cenas hierárquicas

A cena passa a ser uma árvore. Cada `group` pode ter transformações (translação, rotação, escala), modelos e grupos filhos. As transformações aplicam-se aos modelos e aos subgrupos, e a ordem conta.

O engine foi partido em módulos: `World`, `Group`, `Transform`, `Model`, `Camera`, `XMLParser`, `point`. O cenário pedido é um sistema solar estático. A câmara move-se com `w` `a` `s` `d`, aproxima com `e` e afasta com `q`. O relatório desta fase está em `Fase2/relatorio.tex`.

## Fase 3 — curvas e animação

Entram dependências do tempo. O engine ganha curvas de Catmull-Rom (`Curva_CATMR_H`) para trajetórias: calcula pontos, derivadas, o comprimento da curva e a matriz de rotação alinhada com a tangente. O gerador ganha superfícies de Bézier (`bezier.cpp`), com leitura de patches e o algoritmo de De Casteljau.

As fases anteriores mantêm-se: as primitivas e a árvore de grupos continuam a ser a base sobre a qual a animação assenta.
