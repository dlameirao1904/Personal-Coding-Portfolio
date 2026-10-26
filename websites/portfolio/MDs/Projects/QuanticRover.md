# Quantic Rover

Painel de operação de um rover e o servidor que planeia o percurso dentro de um mapa 3D.

O frontend chama-se `quantum-rover`. O servidor, INSYS, é a API em Python. Os comandos do rover passam pelo INSYS e ficam registados; não vão direitos para o ESP32.

## quantum-rover

Deck em Vue, Vuetify, Tailwind e Three.js. A entrada é um login. Depois há seis vistas:

- **Dashboard.** Estado do INSYS e o ciclo do posto: ver o ambiente, perceber o chassis, agir, e deixar o que aconteceu gravado.
- **Map Viewer.** Carrega salas e casas em GLB, marca o início e o fim do circuito e pede o plano.
- **Digital Twin.** O rover em 3D, com bateria e estado ao lado.
- **Logs.** Ambientes, comandos e notas do deck.
- **Rover Control.** Joystick e imagem da câmara. A decisão fica guardada, não listada nesta página.
- **Settings.** Configuração do posto, incluindo o endereço do INSYS.

## server

API FastAPI (`Quantum Rover INSYS`) com SQLite. No arranque cria as pastas de mapas, modelos e câmara, as tabelas, e um registo inicial de telemetria se a base estiver vazia.

- **Auth.** Operadores com PIN de quatro dígitos e sessão.
- **Mapas.** Upload de um GLB, escala em metros por unidade, margem do rover, e pontos de início e de fim. O plano parte daqui.
- **Rover.** Telemetria (bateria, tensão, rumo, pose, motores, estado), modelo GLB do chassis, frame da câmara, e comandos `drive` ou `emergency-stop`.
- **Logs.** O que o deck e o INSYS registam.

O plano está em `algorithms/`. O GLB vira um chão em grelha: triângulos do modelo, células livres e ocupadas, com uma folga à volta do corpo. O chassis de referência mede 1,55 m por 0,92 m, e a margem nunca desce abaixo de 10%.

Há dois percursos:

- **Clássico.** Caminho mais curto em A* sobre as células livres.
- **Quântico.** Simulação próxima de QAOA com uma camada. Oito qubits descrevem quatro camadas de quatro faixas ao lado da rota clássica. Cada salto entre faixas é um caminho livre na grelha. O resultado devolve comprimento, pontos, bitstring, probabilidade de pico e os parâmetros gamma e beta.
