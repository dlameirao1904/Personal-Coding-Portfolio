# PC — jogo concorrente

Jogo multijogador em tempo real. O servidor é Erlang e fala TCP; o cliente é um sketch Processing. Dois jogadores movem-se numa arena, apanham bolas e podem capturar-se um ao outro.

Código: [`Third/PC`](../../Third/PC).

## Servidor

`Server/servidor.erl` escuta na porta `12345` (`gen_tcp`, pacotes terminados em linha). No arranque regista três processos: o dos utilizadores, o do servidor e um mapa de PIDs para nomes.

O protocolo é uma linha de texto. A primeira palavra é a ação:

| Ação | Efeito |
| --- | --- |
| `create` | Cria conta |
| `login` | Autentica e marca o jogador como online |
| resto | Encaminhado para a sala de jogo |

`users.erl` trata de contas, login, remoção e pontuações (há um `users.dat` com dados gravados). `jogo.erl` guarda o estado da partida: dois jogadores, cada um com posição, tamanho, pontos, direção, velocidade angular e aceleração, mais uma lista de bolas. `acao/3` aplica o movimento, verifica a captura de bolas e se um jogador captura o outro.

O servidor separa quem está à espera de adversário (`UsersWaiting`) de quem já está em jogo (`UsersON`).

## Cliente

`Client` é um sketch Processing de 700×700. `main.pde` tem três ecrãs: login, menu e partida. `cliente.pde` abre o socket (no código, para `172.26.12.186:12345`), `menu.pde` desenha o menu e `jogador.pde` desenha os jogadores. Enquanto procura adversário, o cliente fica à escuta de uma mensagem que mude o estado.
