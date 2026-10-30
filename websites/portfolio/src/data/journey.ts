import {
  personalProjects,
  universityYears,
  type ShowcaseLink,
  type ShowcaseProject,
} from '@/data/projects'

export type Vec3 = [number, number, number]

export type PassageKind = 'education' | 'work' | 'project' | 'personal'

export interface AcademicProject {
  id: string
  short: string
  title: string
  period: string
  stack: string[]
  summary: string
  links?: ShowcaseLink[]
  position: Vec3
  radius: number
}

export interface JourneyStep {
  id: string
  kind: 'education' | 'work' | 'personal'
  short: string
  title: string
  organization: string
  period: string
  place: string
  summary: string
  stack: string[]
  relation?: string
  sceneNote?: string
  ongoing?: boolean
  position: Vec3
  radius: number
  landingRadius: number
  landingColor: string
  projects?: AcademicProject[]
}

export interface Passage {
  id: string
  kind: PassageKind
  kicker: string
  short: string
  title: string
  organization: string
  period: string
  place: string
  summary: string
  stack: string[]
  links?: ShowcaseLink[]
  relation?: string
  sceneNote?: string
  ongoing?: boolean
  position: Vec3
  radius: number
  parentId?: string
  parentTitle?: string
}

export const profile = {
  name: 'Diogo Aires',
  role: 'Computer scientist',
  location: 'Montalegre, Portugal',
  email: 'dl.rodrigues001@gmail.com',
  github: 'https://github.com/dlameirao1904',
  githubLabel: 'github.com/dlameirao1904',
  linkedin: 'https://www.linkedin.com/in/diogo-aires-298a47281',
  linkedinLabel: 'LinkedIn',
  languages: [
    { name: 'Português', level: 'Nativo' },
    { name: 'Inglês', level: 'C1' },
  ],
}

export const skillGroups = [
  {
    label: 'Linguagens',
    items: ['C', 'C++', 'Java', 'Python', 'JavaScript', 'TypeScript', 'Haskell', 'Erlang', 'R'],
  },
  {
    label: 'Web',
    items: ['HTML', 'CSS', 'Vue', 'React', 'Next.js', 'Node.js', 'Flask', 'Tailwind', 'Three.js'],
  },
  {
    label: 'Dados',
    items: ['MySQL', 'MongoDB', 'Strapi', 'DBeaver'],
  },
  {
    label: 'Ambiente',
    items: ['Linux', 'LaTeX', 'MATLAB', 'SageMath'],
  },
]

export const learning = ['Oracle', 'Django', 'Kotlin', 'React Native', 'Laravel', 'PHP']

export interface PersonalNote {
  id: string
  period: string
  title: string
  summary: string
}

/** O que fica fora do percurso de software. */
export const personalNotes: PersonalNote[] = [
  {
    id: 'restauracao',
    period: 'Desde os 16 anos',
    title: 'Restauração',
    summary:
      'Restaurantes, bares e discotecas, como servente. Foi o primeiro trabalho, bem antes do código.',
  },
  {
    id: 'padaria',
    period: 'Desde os 23 anos',
    title: 'Padaria',
    summary:
      'Ajudante de pasteleiro, e servente nas horas vagas e aos fins de semana. Continua, em paralelo com a IOTech e o mestrado.',
  },
  {
    id: 'desporto',
    period: 'Infância — hoje',
    title: 'Futebol, futsal e boxe',
    summary:
      'Futsal e futebol durante a infância toda. Continua a ser das coisas que mais me importam. Pratiquei boxe, e o desporto ao ar livre nunca saiu.',
  },
  {
    id: 'escuta',
    period: 'Fora do turno',
    title: 'Leitura e música',
    summary: 'Gosto de ler e adoro música, desde Radiohead a Tool.',
  },
]

export const SPAWN: Vec3 = [0, 0.45, 48]

/** Polilinha do trilho, do início até aos dois passos que decorrem agora. */
export const pathNodes: Vec3[] = [
  [0, 0, 58],
  [0, 0, 36],
  [0, 1.5, 26],
  [0, 2.6, 16],
  [0, 2.6, 0],
  [12, 4.1, -8],
  [22, 5.5, -16],
  [12, 8.4, -28],
  [-2, 11, -38],
  [-16, 13.4, -48],
  [-24, 15.2, -58],
  [-10, 16.8, -68],
  [4, 18, -76],
  [18, 18, -84],
  [-14, 18, -84],
  [-14, 18, -104],
]

interface MarkerSpot {
  id: string
  short: string
  position: Vec3
  radius: number
}

/** Lugares no chão, da entrada da licenciatura para a saída, e depois no mestrado e no largo pessoal. */
const markerSpots: Record<string, MarkerSpot> = {
  LA1: { id: 'la1', short: 'LA1', position: [-5.4, 2.6, 17.2], radius: 1.8 },
  'Programação funcional': {
    id: 'funcional',
    short: 'Funcional',
    position: [5.4, 2.6, 17.2],
    radius: 1.8,
  },
  'Programação imperativa': {
    id: 'imperativa',
    short: 'Imperativa',
    position: [9.4, 2.6, 14.4],
    radius: 1.8,
  },
  'Casa inteligente': {
    id: 'casa',
    short: 'Casa',
    position: [-9.2, 2.6, 13.6],
    radius: 1.8,
  },
  'Monitorização de processos': {
    id: 'processos',
    short: 'Processos',
    position: [11, 2.6, 10.2],
    radius: 1.8,
  },
  'Sistemas de redes e comunicação': {
    id: 'redes',
    short: 'Redes',
    position: [-11, 2.6, 8.6],
    radius: 1.8,
  },
  'Bases de dados': { id: 'dados', short: 'Dados', position: [-5.6, 2.6, 7.2], radius: 1.8 },
  'Computação gráfica': {
    id: 'grafica',
    short: 'Gráfica',
    position: [5.6, 2.6, 8.6],
    radius: 1.8,
  },
  'Algoritmo de Grover': {
    id: 'grover',
    short: 'Grover',
    position: [10.2, 2.6, 5],
    radius: 1.8,
  },
  'Versão de Agar.io': {
    id: 'agar',
    short: 'Agar.io',
    position: [-9.6, 2.6, 3.4],
    radius: 1.8,
  },
  'Processamento de linguagens': {
    id: 'linguagens',
    short: 'Linguagens',
    position: [8, 2.6, 0.6],
    radius: 1.8,
  },
  Acórdãos: { id: 'acordaos', short: 'Acórdãos', position: [-6.2, 2.6, -1.2], radius: 1.8 },
  'Criptossistema de McEliece': {
    id: 'mceliece',
    short: 'McEliece',
    position: [-20, 18, -80],
    radius: 2.05,
  },
  Vertice: { id: 'vertice', short: 'Vertice', position: [-20, 18, -88], radius: 2.05 },
  'Atelier da Marina': {
    id: 'atelier',
    short: 'Atelier',
    position: [-20, 18, -98.5],
    radius: 1.9,
  },
  Martrack: { id: 'martrack', short: 'Martrack', position: [-8, 18, -98.5], radius: 1.9 },
  Gralhas: { id: 'gralhas', short: 'Gralhas', position: [-20, 18, -104], radius: 1.9 },
  'Quantic Rover': {
    id: 'rover',
    short: 'Rover',
    position: [-8, 18, -104],
    radius: 1.9,
  },
  'Reconstrução 3D': {
    id: 'reconstrucao',
    short: 'Reconstrução',
    position: [-20, 18, -109.5],
    radius: 1.9,
  },
  'SIEM local': { id: 'siem', short: 'SIEM', position: [-8, 18, -109.5], radius: 1.9 },
}

export function noteIdForTitle(title: string) {
  return markerSpots[title]?.id ?? null
}

const yearPeriod: Record<string, string> = {
  'ano-1': '1.º ano',
  'ano-2': '2.º ano',
  'ano-3': '3.º ano',
  mestrado: 'Set 2025 — atual',
}

function toAcademic(project: ShowcaseProject, period: string): AcademicProject {
  const spot = markerSpots[project.title]
  if (!spot) throw new Error(`Sem lugar no trilho para ${project.title}`)
  return {
    id: spot.id,
    short: spot.short,
    title: project.title,
    period,
    stack: project.stack,
    summary: project.summary,
    links: project.links,
    position: spot.position,
    radius: spot.radius,
  }
}

function projectsOf(yearId: string) {
  const year = universityYears.find((item) => item.id === yearId)
  if (!year) throw new Error(`Ano em falta: ${yearId}`)
  return year.projects.map((project) => toAcademic(project, yearPeriod[yearId]))
}

const courseProjects: AcademicProject[] = ['ano-1', 'ano-2', 'ano-3'].flatMap(projectsOf)
const masterProjects: AcademicProject[] = projectsOf('mestrado')
const sideProjects: AcademicProject[] = personalProjects.map((project) =>
  toAcademic(project, 'À parte'),
)

export const steps: JourneyStep[] = [
  {
    id: 'licenciatura',
    kind: 'education',
    short: 'Licenciatura',
    title: 'Licenciatura em Ciência da Computação',
    organization: 'Universidade do Minho',
    period: 'Set 2019 — Jan 2024',
    place: 'Braga',
    summary: 'Aqui começa a minha jornada na programção.',
    stack: [],
    sceneNote:
      'Da entrada para a saída: primeiro ano, depois o segundo, e o terceiro mais à frente.',
    position: [0, 2.6, 8],
    radius: 10.5,
    landingRadius: 12.5,
    landingColor: '#c5cbbf',
    projects: courseProjects,
  },
  {
    id: 'micronet',
    kind: 'work',
    short: 'Micro-Net',
    title: 'Web developer',
    organization: 'Micro-Net',
    period: 'Out 2023 — Mar 2024',
    place: 'Braga',
    summary:
      'Primeiro trabalho como programador, ainda durante o último ano da licenciatura. Aplicações em Next.js e Flask.',
    stack: [
      'Next.js',
      'Flask',
      'React',
      'JavaScript',
      'Python',
      'HTML',
      'CSS',
      'Tailwind',
      'SQL Server',
    ],
    relation: 'Durante a licenciatura',
    sceneNote: 'O patamar fica logo a seguir ao da licenciatura, porque os dois tempos se cruzam.',
    position: [22, 5.5, -16],
    radius: 6.6,
    landingRadius: 6,
    landingColor: '#d2c0a6',
  },
  {
    id: 'aurum',
    kind: 'work',
    short: 'Aurum',
    title: 'Junior software developer',
    organization: 'Aurum Solutions',
    period: 'Abr 2024 — Jul 2024',
    place: 'Braga',
    summary: 'Alguns meses como junior, em aplicações .NET.',
    stack: ['.NET', 'C#', 'C++', 'SQL Server'],
    position: [-24, 15.2, -58],
    radius: 5.4,
    landingRadius: 4.8,
    landingColor: '#d2c0a6',
  },
  {
    id: 'iotech',
    kind: 'work',
    short: 'IOTech',
    title: 'Software developer',
    organization: 'IOTech',
    period: 'Out 2024 — atual',
    place: 'Vila Nova de Famalicão',
    summary:
      'Aplicações web em Vue e Node, com TypeScript, Vite e Three.js, e dados em SQL e NoSQL.',
    stack: [
      'Vue',
      'Node.js',
      'TypeScript',
      'JavaScript',
      'Vite',
      'Three.js',
      'HTML',
      'CSS',
      'Strapi',
      'MySQL',
      'PostgreSQL',
      'MongoDB',
    ],
    relation: 'Em paralelo com o mestrado',
    sceneNote: 'Este patamar está à mesma altura do mestrado. Os dois estão a decorrer.',
    ongoing: true,
    position: [18, 18, -84],
    radius: 8.5,
    landingRadius: 8,
    landingColor: '#e4e0d4',
  },
  {
    id: 'mestrado',
    kind: 'education',
    short: 'Mestrado',
    title: 'Mestrado em Matemática Computacional',
    organization: 'Universidade do Minho',
    period: 'Set 2025 — atual',
    place: 'Braga',
    summary:
      'Agora num perfi mais matemático, tento explorar todo o sistema de segurança criptográfica de um dispositivo.',
    stack: ['Criptografia'],
    relation: 'Em paralelo com a IOTech',
    sceneNote:
      'Este patamar está à mesma altura da IOTech. O McEliece e o Vertice ficam do lado oposto à ponte.',
    ongoing: true,
    position: [-14, 18, -84],
    radius: 8.5,
    landingRadius: 9,
    landingColor: '#e4e0d4',
    projects: masterProjects,
  },
  {
    id: 'pessoais',
    kind: 'personal',
    short: 'Pessoais',
    title: 'Projetos pessoais',
    organization: 'Fora das cadeiras',
    period: 'Em paralelo',
    place: 'Braga',
    summary:
      'O site da associação de Gralhas, o atelier da Marina e o Martrack, o painel do Quantic Rover, a reconstrução 3D e um SIEM local para estudar.',
    stack: [],
    sceneNote: 'À chegada estão o Atelier e o Martrack. Os outros quatro ficam mais à frente.',
    position: [-14, 18, -104],
    radius: 6.2,
    landingRadius: 9.6,
    landingColor: '#d7d3c6',
    projects: sideProjects,
  },
]

function kickerFor(kind: PassageKind) {
  if (kind === 'education') return 'Educação'
  if (kind === 'work') return 'Trabalho'
  if (kind === 'personal') return 'Pessoal'
  return 'Projeto'
}

function projectKicker(step: JourneyStep, project: AcademicProject) {
  if (step.id === 'licenciatura') return project.period
  if (step.id === 'mestrado') return 'Mestrado'
  return 'Pessoal'
}

function projectSceneNote(step: JourneyStep) {
  if (step.id === 'licenciatura') return 'Faz parte do patamar da licenciatura.'
  if (step.id === 'mestrado') return 'Faz parte do patamar do mestrado.'
  return 'Faz parte do largo dos projetos pessoais.'
}

export const passages: Passage[] = steps.flatMap((step) => {
  const main: Passage = {
    id: step.id,
    kind: step.kind,
    kicker: kickerFor(step.kind),
    short: step.short,
    title: step.title,
    organization: step.organization,
    period: step.period,
    place: step.place,
    summary: step.summary,
    stack: step.stack,
    relation: step.relation,
    sceneNote: step.sceneNote,
    ongoing: step.ongoing,
    position: step.position,
    radius: step.radius,
  }

  const projects: Passage[] = (step.projects ?? []).map((project) => ({
    id: project.id,
    kind: 'project' as const,
    kicker: projectKicker(step, project),
    short: project.short,
    title: project.title,
    organization: step.organization,
    period: project.period,
    place: step.place,
    summary: project.summary,
    stack: project.stack,
    links: project.links,
    position: project.position,
    radius: project.radius,
    parentId: step.id,
    parentTitle: step.title,
    sceneNote: projectSceneNote(step),
  }))

  return [main, ...projects]
})

export const passageById: Record<string, Passage> = Object.fromEntries(
  passages.map((passage) => [passage.id, passage]),
)
