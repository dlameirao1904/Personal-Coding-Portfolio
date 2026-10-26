# Portefólio

Site pessoal do Diogo Aires. Há duas formas de ler o mesmo percurso: uma página escrita e uma caminhada numa montanha em 3D. O código está em `portfolio/diogo`. Vue, Vuetify e Three.js, este último através de TresJS.

## Página

`/` é o portefólio. Apresenta quem é (software developer na IOTech, mestrado em Matemática Computacional na Universidade do Minho, perfil de Criptografia, licenciatura em Ciências da Computação), o percurso de trabalho e os projetos.

Os dados estão em `src/data/projects.ts` e `src/data/journey.ts`: anos da licenciatura, mestrado, e projetos pessoais (Gralhas, Atelier da Marina, Martrack, Quantic Rover, reconstrução 3D, SIEM local), com resumo, stack e ligações quando existem.

## Jornada

`/jornada` é uma cena 3D. Uma montanha, um trilho e um montanhista. No computador anda-se com WASD ou setas, salta-se com espaço e olha-se ao arrastar o rato. No telemóvel há joystick, botão de salto e o mesmo arrasto para a câmara.

Ao longo do trilho estão os passos da licenciatura, do mestrado, do trabalho e dos projetos pessoais. Chegar a um marco abre o texto dessa passagem: período, sítio, resumo e stack. Os projetos académicos ficam como marcos à volta do ano a que pertencem. Dá para voltar ao início do trilho e regressar à página escrita.
