# POO — Programação Orientada aos Objetos

Simulação, em Java, de um parque de casas com dispositivos inteligentes, comercializadores de energia e faturação. É o trabalho prático de POO de 2021/22 (enunciado em `TP_POO_2122.pdf`).

Código: [`Second/POO`](../../Second/POO).

## Modelo

Uma `House` tem dono, NIF, divisões e um mapa de dispositivos. Cada casa está associada a um comercializador (`Fornecedor`) e acumula faturas (`Fatura`). O estado pode ser gravado: as classes principais implementam `Serializable`, e existe um `data.obj` com uma gravação.

`SmartDevice` é a classe abstrata. Guarda um identificador gerado automaticamente e o estado ligado/desligado. As especializações são:

| Classe | Dispositivo |
| --- | --- |
| `SmartBulb` | Lâmpada |
| `SmartCamera` | Câmara |
| `SmartSpeaker` | Coluna |

O consumo depende do tipo de dispositivo e do comercializador, e é isso que alimenta as faturas.

## Programa

`Main` arranca `Menus`, que é a interface de consola. À volta disso estão um `Parser` para carregar dados, exceções próprias (`JaExisteCasaException`, `NaoExisteCasaException`, `NaoExisteDeviceException`) e um ficheiro `Logs.txt`. O diagrama de classes está em `DiagramaClassesPOO.vpp`; o relatório do grupo 43 está em `Relatorio_POO_grupo43(1).docx`.
