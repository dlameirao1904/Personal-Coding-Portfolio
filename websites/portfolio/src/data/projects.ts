const university = 'https://github.com/dlameirao1904/University/tree/main'

export interface ShowcaseLink {
  href: string
  label: string
}

export interface ShowcaseProject {
  title: string
  summary: string
  stack: string[]
  links?: ShowcaseLink[]
  note?: string
}

export interface UniversityYear {
  id: string
  index: string
  title: string
  summary: string
  href: string
  projects: ShowcaseProject[]
}

export const marquee = [
  'Vue',
  'Python',
  'TypeScript',
  'Three.js',
  'C',
  'C++',
  'Java',
  'Haskell',
  'Erlang',
  'Flask',
  'Strapi',
  'Quantic Rover',
  'Vertice',
  'Gralhas',
  'Atelier',
  'Martrack',
  'McEliece',
]

export const universityYears: UniversityYear[] = [
  {
    id: 'ano-1',
    index: '01',
    title: 'Primeiro ano',
    summary:
      'Trabalhos do primeiro ano: um interpretador em C, fichas em Haskell e exercícios de programação imperativa.',
    href: `${university}/First`,
    projects: [
      {
        title: 'LA1',
        summary:
          'Interpretador em C de uma linguagem baseada em pilha. Lê uma linha, avalia os operadores e imprime o estado final da pilha.',
        stack: ['C'],
        links: [{ href: `${university}/First/LA1`, label: 'Código' }],
      },
      {
        title: 'Programação funcional',
        summary:
          'Resoluções em Haskell: nove fichas, as cinquenta questões feitas de forma recursiva, e testes de anos anteriores.',
        stack: ['Haskell'],
        links: [{ href: `${university}/First/PF`, label: 'Código' }],
      },
      {
        title: 'Programação imperativa',
        summary:
          'Exercícios em C. As fichas percorrem atribuições e controlo, e as cem questões estão em duas resoluções lado a lado.',
        stack: ['C'],
        links: [{ href: `${university}/First/PI`, label: 'Código' }],
      },
    ],
  },
  {
    id: 'ano-2',
    index: '02',
    title: 'Segundo ano',
    summary:
      'Projetos do segundo ano: uma casa de dispositivos inteligentes, um monitor de processos e relatórios de redes.',
    href: `${university}/Second`,
    projects: [
      {
        title: 'Casa inteligente',
        summary:
          'Simulação em Java de casas com lâmpadas, câmaras e colunas. Cada casa tem um comercializador, e o consumo dos dispositivos alimenta as faturas.',
        stack: ['Java'],
        links: [{ href: `${university}/Second/POO`, label: 'Código' }],
      },
      {
        title: 'Monitorização de processos',
        summary:
          'Dois programas em C ligados por um pipe. O tracer lança um comando e regista a duração. O monitor guarda os processos a correr e os que já terminaram.',
        stack: ['C'],
        links: [{ href: `${university}/Second/SO`, label: 'Código' }],
      },
      {
        title: 'Sistemas de redes e comunicação',
        summary:
          'Relatórios de capturas de rede: Ethernet e ARP, IP e ICMP, DNS, TCP e HTTP, e um estudo sobre a evolução das redes móveis até ao 5G.',
        stack: ['Redes'],
        links: [
          {
            href: `${university}/Second/SCR%20-%20Sistemas%20de%20Redes%20e%20Comunica%C3%A7%C3%A3o`,
            label: 'Relatórios',
          },
        ],
      },
    ],
  },
  {
    id: 'ano-3',
    index: '03',
    title: 'Terceiro ano',
    summary:
      'Trabalhos do terceiro ano, de bases de dados e de um motor 3D até um jogo concorrente e um site de acórdãos.',
    href: `${university}/Third`,
    projects: [
      {
        title: 'Bases de dados',
        summary:
          'Duas bases em SQL. A Beerlivery modela entregas de bebidas, com clientes, armazéns e estafetas. A de Eventos liga um pedido ao evento e aos funcionários. Em ambas há povoamento, vistas e procedimentos.',
        stack: ['SQL'],
        links: [{ href: `${university}/Third/BD`, label: 'Código' }],
      },
      {
        title: 'Computação gráfica',
        summary:
          'Motor 3D e gerador de geometria em C++ e OpenGL, em três fases: primitivas, cenas hierárquicas e animação com curvas de Catmull-Rom e superfícies de Bézier.',
        stack: ['C++', 'OpenGL'],
        links: [{ href: `${university}/Third/CG`, label: 'Código' }],
      },
      {
        title: 'Algoritmo de Grover',
        summary:
          'Algoritmo de Grover em Qiskit, para procurar as soluções de uma fórmula booleana de três variáveis. O circuito corre no simulador e o notebook mostra as medições.',
        stack: ['Python', 'Qiskit'],
        links: [{ href: `${university}/Third/IC`, label: 'Código' }],
      },
      {
        title: 'Versão de Agar.io',
        summary:
          'Jogo multijogador em tempo real. O servidor em Erlang trata de contas, sala e pontuação. O cliente em Processing desenha a arena, onde dois jogadores apanham bolas e se podem capturar.',
        stack: ['Erlang', 'Processing'],
        links: [{ href: `${university}/Third/PC`, label: 'Código' }],
      },
      {
        title: 'Processamento de linguagens',
        summary:
          'Dois trabalhos em Python com PLY. O primeiro passa CSV a JSON. O segundo compila uma linguagem imperativa pequena para o assembly de uma máquina virtual.',
        stack: ['Python', 'PLY'],
        links: [{ href: `${university}/Third/PL`, label: 'Código' }],
      },
      {
        title: 'Acórdãos',
        summary:
          'Aplicação em Flask para consultar um conjunto de acórdãos em JSON. Há a lista, a ficha de cada acórdão e as páginas de autores. O dataset é carregado no arranque.',
        stack: ['Python', 'Flask', 'HTML'],
        links: [{ href: `${university}/Third/PROJETO`, label: 'Código' }],
      },
    ],
  },
  {
    id: 'mestrado',
    index: '04',
    title: 'Mestrado',
    summary:
      'Dois trabalhos do mestrado: uma aplicação sobre criptografia, da cifra de César ao McEliece, e o Vertice, para planear produção.',
    href: `${university}/Master%20In%20Mathematics%20and%20Computing`,
    projects: [
      {
        title: 'Criptossistema de McEliece',
        summary:
          'Aplicação em Vue sobre criptografia, da substituição de letras até sistemas pensados para resistir a computadores quânticos. Percorre César, AES e RSA, e o McEliece, em que a segurança assenta num problema de descodificação.',
        stack: ['Vue', 'TypeScript'],
        links: [
          { href: 'https://tc-trabalho.vercel.app/homepage', label: 'Ver o site' },
          {
            href: `${university}/Master%20In%20Mathematics%20and%20Computing/TC`,
            label: 'Código',
          },
        ],
      },
      {
        title: 'Vertice',
        summary:
          'Painel para planear uma operação de produção. A interface em Vue lê clientes, vendas e modelos 3D no Strapi. Um otimizador em Python escalona as ordens nas máquinas, a minimizar energia, água e mudanças de preparação.',
        stack: ['Vue', 'Strapi', 'Python'],
      },
    ],
  },
]

export const personalProjects: ShowcaseProject[] = [
  {
    title: 'Gralhas',
    summary:
      'Site da associação da aldeia de Gralhas, no Larouco. Conta a aldeia, o que a associação faz e os eventos, que vivem no Supabase. Os pedidos de contacto, sócio e donativo saem por email.',
    stack: ['Vue', 'Supabase'],
    links: [
      { href: 'https://www.associacao-de-gralhas.com/', label: 'Ver o site' },
      {
        href: 'https://github.com/dlameirao1904/Personal-Coding-Portfolio/tree/main/websites/gralhas',
        label: 'Código',
      },
    ],
  },
  {
    title: 'Atelier da Marina',
    summary:
      'Site público do atelier de cake design da Marina, em Pitões das Júnias. O visitante vê a coleção, escolhe sabores e pede um orçamento. Os bolos visíveis vêm do Supabase e o pedido segue por email.',
    stack: ['Vue', 'Supabase'],
    links: [{ href: 'https://www.atelier-da-marina.pt/atelier', label: 'Ver o site' }],
  },
  {
    title: 'Martrack',
    summary:
      'Área privada do atelier: registo de bolos, agenda de entregas e números de faturação e lucro. Entra com sessão e usa a mesma base do site. Um bolo marcado como visível pode aparecer no portefólio.',
    stack: ['Vue', 'Supabase'],
  },
  {
    title: 'Quantic Rover',
    summary:
      'Painel de um rover: mapa, gémeo digital, câmara e comandos. O percurso no chão é calculado em Python. Há um caminho clássico em A* e uma simulação próxima de QAOA, com faixas ao lado dessa rota.',
    stack: ['Vue', 'Python', 'Three.js'],
  },
  {
    title: 'Reconstrução 3D',
    summary:
      'Reconstrução de uma cena a partir de fotografias. A API em Python segue o percurso clássico, de pontos e poses até triangulação e ajuste de feixe. O visualizador em Vue prepara, mostra e guarda os modelos.',
    stack: ['Python', 'Vue', 'Three.js'],
  },
  {
    title: 'SIEM local',
    summary:
      'Base de um SIEM para estudar, só com a biblioteca padrão do Python. O coletor lê o log de autenticação, a API guarda os eventos em SQLite e uma regra avisa quando o mesmo IP falha cinco vezes em cinco minutos.',
    stack: ['Python', 'SQLite'],
  },
]
