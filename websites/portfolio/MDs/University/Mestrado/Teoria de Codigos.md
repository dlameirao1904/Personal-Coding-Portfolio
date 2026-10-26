# Teoria de Códigos

Aplicação Vue que percorre a criptografia desde a substituição de letras até aos criptossistemas pensados para resistir a computadores quânticos. Foi feita para a unidade de Teoria de Códigos do Mestrado em Matemática e Computação.

Código: [`Master In Mathematics and Computing/TC`](../../Master%20In%20Mathematics%20and%20Computing/TC).

A interface é Vue 3, Vite, Vuetify e Vue Router. As cifras usam `crypto-js`; as fórmulas usam KaTeX.

## Percurso

A homepage apresenta os três eixos do tema: confidencialidade, o par cifração/decifração, e a ameaça do algoritmo de Shor ao RSA e às curvas elíticas.

| Rota | Página | O que mostra |
| --- | --- | --- |
| `/simetric-criptography` | Criptografia simétrica | Introdução à família |
| `/cifra-cesar` | Cifra de César | Substituição clássica |
| `/aes` | AES | Cifra simétrica moderna |
| `/assimetric-criptography` | Criptografia assimétrica | Introdução à família |
| `/rsa` | RSA | Cifra de chave pública baseada em fatorização |
| `/mceliece` | McEliece | Criptossistema baseado em códigos, candidato pós-quântico |
| `/point-of-view` | Análise | Comparação de segurança e desempenho, do clássico ao pós-quântico |

A página de análise (`PointOfView.vue`) põe os criptossistemas lado a lado e abre, para cada um, um painel com a leitura comparativa.

A página de McEliece é o ponto em que a cadeira de códigos e a criptografia se encontram: a segurança deixa de assentar na fatorização e passa a assentar num problema de descodificação.
