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
    summary: 'Trabalhos computacionais do primeiro ano da licenciatura.',
    href: `${university}/First`,
    projects: [
      {
        title: 'LA1',
        summary: 'Exercícios em C: arrays, strings, parser e stack.',
        stack: ['C'],
        links: [{ href: `${university}/First/LA1`, label: 'Código' }],
      },
      {
        title: 'Programação funcional',
        summary: 'Fichas, cinquenta questões e testes em Haskell.',
        stack: ['Haskell'],
        links: [{ href: `${university}/First/PF`, label: 'Código' }],
      },
      {
        title: 'Programação imperativa',
        summary: 'Fichas em C.',
        stack: ['C'],
        links: [{ href: `${university}/First/PI`, label: 'Código' }],
      },
    ],
  },
  {
    id: 'ano-2',
    index: '02',
    title: 'Segundo ano',
    summary: 'Projetos do segundo ano da licenciatura.',
    href: `${university}/Second`,
    projects: [
      {
        title: 'Casa inteligente',
        summary:
          'Trabalho de POO: uma casa com lâmpadas, câmaras e colunas, e o consumo de cada uma.',
        stack: ['Java'],
        links: [{ href: `${university}/Second/POO`, label: 'Código' }],
      },
      {
        title: 'Monitorização de processos',
        summary: 'Tracer e monitor para programas em execução numa máquina.',
        stack: ['C'],
        links: [{ href: `${university}/Second/SO`, label: 'Código' }],
      },
      {
        title: 'Sistemas de redes e comunicação',
        summary: 'Trabalhos práticos da cadeira, com os relatórios no repositório.',
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
    summary: 'Trabalhos práticos das cadeiras do terceiro ano.',
    href: `${university}/Third`,
    projects: [
      {
        title: 'Bases de dados',
        summary: 'Esquema relacional, povoamento, vistas, procedimentos e funções.',
        stack: ['SQL'],
        links: [{ href: `${university}/Third/BD`, label: 'Código' }],
      },
      {
        title: 'Computação gráfica',
        summary: 'Motor e gerador de modelos, desenvolvidos em três fases.',
        stack: ['C++'],
        links: [{ href: `${university}/Third/CG`, label: 'Código' }],
      },
      {
        title: 'Algoritmo de Grover',
        summary: 'Notebook do algoritmo de Grover, com notas sobre bits, qubits e sobreposição.',
        stack: ['Python'],
        links: [{ href: `${university}/Third/IC`, label: 'Código' }],
      },
      {
        title: 'Versão de Agar.io',
        summary: 'Jogo multijogador com cliente em Java e servidor em Erlang.',
        stack: ['Java', 'Erlang'],
        links: [{ href: `${university}/Third/PC`, label: 'Código' }],
      },
      {
        title: 'Processamento de linguagens',
        summary: 'Parser escrito em Python.',
        stack: ['Python'],
        links: [{ href: `${university}/Third/PL`, label: 'Código' }],
      },
      {
        title: 'Acórdãos',
        summary: 'Aplicação em Flask para consultar um conjunto de acórdãos em JSON.',
        stack: ['Python', 'Flask', 'HTML'],
        links: [{ href: `${university}/Third/PROJETO`, label: 'Código' }],
      },
    ],
  },
  {
    id: 'mestrado',
    index: '04',
    title: 'Mestrado',
    summary: 'Matemática computacional, no perfil de criptografia. Em curso.',
    href: `${university}/Master%20In%20Mathematics%20and%20Computing`,
    projects: [
      {
        title: 'Criptossistema de McEliece',
        summary: 'Página sobre o criptossistema de McEliece, feita em Vue. Está publicada.',
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
          'Painel para planear produção. Vue e Strapi do lado da aplicação, e um otimizador em Python que reduz o custo de energia, água e mudanças de preparação entre ordens. Também lê modelos 3D.',
        stack: ['Vue', 'Strapi', 'Python'],
      },
    ],
  },
]

export const personalProjects: ShowcaseProject[] = [
  {
    title: 'Gralhas',
    summary:
      'Site da associação da aldeia de Gralhas, no Larouco: a história da aldeia, o propósito da associação e um convite a participar.',
    stack: ['Vue'],
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
      'Site do atelier de cake design da Marina, em Pitões das Júnias. A coleção de bolos está no Supabase, e o pedido de encomenda segue por email.',
    stack: ['Vue', 'Supabase'],
    links: [{ href: 'https://www.atelier-da-marina.pt/atelier', label: 'Ver o site' }],
  },
  {
    title: 'Martrack',
    summary:
      'Ferramenta do atelier para a Marina: os bolos, a agenda e a conta da faturação e do lucro. Entra com sessão, sobre os mesmos dados do site.',
    stack: ['Vue', 'Supabase'],
  },
  {
    title: 'Quantic Rover',
    summary:
      'Painel de um rover: mapa, gémeo digital e controlo. O percurso no chão é escolhido em Python, com uma rotina de quatro camadas próxima de QAOA.',
    stack: ['Vue', 'Python', 'Three.js'],
  },
  {
    title: 'Reconstrução 3D',
    summary:
      'Uma API recebe fotografias e reconstrói a cena: pontos, pose, triangulação e ajuste de feixe. O visualizador em Vue serve para varrer e ver o modelo.',
    stack: ['Python', 'Vue', 'Three.js'],
  },
  {
    title: 'SIEM local',
    summary:
      'Base de um SIEM para estudar: o coletor lê logs, a API guarda eventos em SQLite e uma regra avisa quando o mesmo IP falha a autenticação cinco vezes em cinco minutos.',
    stack: ['Python', 'SQLite'],
  },
]
