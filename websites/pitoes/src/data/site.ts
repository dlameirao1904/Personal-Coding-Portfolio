/**
 * Fotografias: põe o ficheiro em public/photos e mete o caminho em `photo`,
 * por exemplo '/photos/broa.jpg'. Vazio mostra o desenho.
 */

export const atelierSite = 'https://atelier-da-marina.pt'

export const contacts = {
  phoneDisplay: '276 563 103',
  phoneHref: 'tel:+351276563103',
  address: ['Rua do Outeiro, n.º 24', '5470-370 Pitões das Júnias', 'Montalegre'],
  maps: 'https://www.google.com/maps/search/?api=1&query=Rua%20do%20Outeiro%2024%20Pit%C3%B5es%20das%20J%C3%BAnias',
  instagram: 'https://www.instagram.com/pastelariapitoes/',
  facebook: 'https://www.facebook.com/PadariaaPitoes',
  breadTime: 'por volta das 11:30',
}

export const navigation = [
  { label: 'O forno', to: { path: '/', hash: '#forno' } },
  { label: 'Os nossos produtos', to: { name: 'produtos' } },
  { label: 'Rotas', to: { name: 'rotas' } },
  { label: 'Equipa', to: { name: 'equipa' } },
] as const

export type BreadKind = 'broa' | 'cacete' | 'rosca'

export type Product = {
  slug: string
  name: string
  kind: BreadKind
  summary: string
  detail: string
  featured: boolean
  photo: string
}

export const products: Product[] = [
  {
    slug: 'broa',
    name: 'Broa',
    kind: 'broa',
    summary: 'Redonda, de centeio, com a côdea que parte e o miolo húmido.',
    detail:
      'É o pão da casa. A bola fecha-se à mão, leva o corte em cruz e coze no forno até a côdea ficar escura e o miolo denso.',
    featured: true,
    photo: '',
  },
  {
    slug: 'cacete-de-centeio',
    name: 'Cacete de centeio',
    kind: 'cacete',
    summary: 'Comprido, para partir à mão e levar no caminho.',
    detail:
      'O centeio em formato longo, com os golpes na côdea. É o pão que se parte ao meio da mesa ou se mete no saco para a serra.',
    featured: true,
    photo: '',
  },
  {
    slug: 'rosca-flor',
    name: 'Rosca flor',
    kind: 'rosca',
    summary: 'Doce, em flor, a que se leva para casa no fim da manhã.',
    detail:
      'A rosca doce da padaria, aberta como uma flor. Sai do balcão junto do pão, para o pequeno-almoço e para levar.',
    featured: true,
    photo: '',
  },
]

export const featuredProducts = products.filter((item) => item.featured)

export const shelves = [
  {
    id: 'pao',
    title: 'Pão do forno',
    text: 'A broa, o cacete e a rosca flor abrem a montra. Os outros pães entram quando fecharmos a lista completa.',
  },
  {
    id: 'balcao',
    title: 'Balcão',
    text: 'A doçaria de todos os dias e o que se leva ao balcão. Os nomes e as fotografias ficam para a próxima volta.',
  },
  {
    id: 'eventos',
    title: 'Eventos',
    text: 'Bolos de aniversário e pastelaria para festas, feitos no Atelier da Marina, na mesma casa.',
  },
]

export const ovenSteps = [
  {
    kicker: 'A masseira',
    title: 'Sair da masseira',
    text: 'A massa deixa a masseira e segue para a direita, ainda mole, até à mesa.',
  },
  {
    kicker: 'A mesa',
    title: 'Ganhar forma',
    text: 'Na mesa a broa ganha forma e o corte. A cor fica a da massa.',
  },
  {
    kicker: 'O carrinho',
    title: 'Meter na tela',
    text: 'A broa segue para a direita e assenta na tela, em cima do carrinho.',
  },
  {
    kicker: 'O forno',
    title: 'Levar ao forno',
    text: 'O carrinho vai para a frente e encosta à direita. Os dois padeiros pegam na tela, um em cada ponta, e metem-na no forno.',
  },
]

export const ribbon = [
  'Broa de centeio',
  'Cacete de centeio',
  'Rosca flor',
  'Forno a lenha',
  'Pitões das Júnias',
  'Família Marinho',
]

export const weekdays = [
  { id: 'segunda', label: 'Segunda' },
  { id: 'terca', label: 'Terça' },
  { id: 'quarta', label: 'Quarta' },
  { id: 'quinta', label: 'Quinta' },
  { id: 'sexta', label: 'Sexta' },
  { id: 'sabado', label: 'Sábado' },
  { id: 'domingo', label: 'Domingo' },
] as const

export type WeekdayId = (typeof weekdays)[number]['id']

export type Distributor = {
  id: string
  name: string
  days: WeekdayId[]
  /** Dias em que sai, mas as localidades ainda não estão fechadas. */
  open?: WeekdayId[]
  note?: string
  routes: Record<WeekdayId, string[]>
}

export function dayList(days: WeekdayId[]) {
  const labels = weekdays.filter((day) => days.includes(day.id)).map((day) => day.label.toLowerCase())
  if (!labels.length) return ''
  const [first, ...rest] = labels
  const head = `${first.charAt(0).toUpperCase()}${first.slice(1)}`
  if (!rest.length) return head
  const tail = rest.at(-1)
  const middle = rest.slice(0, -1)
  return `${[head, ...middle].join(', ')} e ${tail}`
}

function blankRoutes(): Record<WeekdayId, string[]> {
  return {
    segunda: [],
    terca: [],
    quarta: [],
    quinta: [],
    sexta: [],
    sabado: [],
    domingo: [],
  }
}

const ramosSegunda = [
  'Covelães',
  'Travassos',
  'São Pedro',
  'Brandim',
  'Fervidelas',
  'Pisões',
  'Lama da Missa',
  'Viade de Baixo',
  'Viade de Cima',
  'Parafita',
  'Penedones',
  'Castanheira',
  'Travassos da Chã',
  'São Vicente',
  'Medeiros',
  'Morgade',
  'Lamachã',
  'Lavradas',
  'Atilhó',
  'Alturas do Barroso',
  'Vilarinho Seco',
  'Coimbro',
  'Telhado',
]

const ramosTerca = [
  'Covelães',
  'Paredes do Rio',
  'Outeiro',
  'Travassos',
  'São Pedro',
  'Pisões',
  'Lama da Missa',
  'Parafita',
  'Penedones',
  'Torgueda',
  'São Vicente',
  'Peireses',
  'Gorda',
  'Aldeia Nova',
  'Morgade',
  'Barracão',
  'Cortiço',
  'Vidoeiro',
  'Zebral',
  'Sarraquinhos',
  'Pedrário',
  'Cepeda',
  'São Mateus',
  'Fírvidas',
  'Gralhós',
  'Montalegre',
  'Padornelos',
  'Sendim',
  'Padroso',
  'Donões',
  'Sabuzedo',
  'Mourilhe',
  'Cambeses do Rio',
  'Frades',
  'Travassos',
]

const ramosQuarta = [
  'Covelães',
  'Paredes do Rio',
  'Outeiro',
  'Travassos',
  'São Pedro',
  'Brandim',
  'Fervidelas',
  'Pisões',
  'Cista',
  'Lama da Missa',
  'Viade de Cima',
  'Viade de Baixo',
  'Parafita',
  'Penedones',
  'Castanheira',
  'São Vicente',
  'Medeiros',
  'Morgade',
  'Lamachã',
  'Lavradas',
  'Atilhó',
  'Alturas do Barroso',
  'Vilarinho Seco',
  'Coimbro',
  'Telhado',
]

const ramosSexta = [
  'Covelães',
  'Travassos',
  'São Pedro',
  'Brandim',
  'Fervidelas',
  'Pisões',
  'Lama da Missa',
  'Cista',
  'Viade de Baixo',
  'Viade de Cima',
  'Parafita',
  'Penedones',
  'Castanheira',
  'Travassos da Chã',
  'São Vicente',
  'Medeiros',
  'Morgade',
  'Lamachã',
  'Lavradas',
  'Atilhó',
  'Alturas do Barroso',
  'Vilarinho Seco',
  'Coimbro',
  'Telhado',
]

const ramosSabado = [
  'Covelães',
  'Travassos',
  'São Pedro',
  'Pisões',
  'Cista',
  'Lama da Missa',
  'Parafita',
  'Penedones',
  'Torgueda',
  'São Vicente',
  'Maria do Diabo',
  'Peireses',
  'Gorda',
  'Aldeia Nova',
  'Morgade',
  'Barracão',
  'Cortiço',
  'Vidoeiro',
  'Zebral',
  'Sarraquinhos',
  'Pedrário',
  'Cepeda',
  'São Mateus',
  'Fírvidas',
  'Gralhós',
]

const ramosDomingo = [
  'Covelães',
  'Paredes do Rio',
  'Outeiro',
  'Paradela',
  'São Pedro',
  'Pisões',
  'Lama da Missa',
  'Vila da Ponte',
  'Parafita',
  'Penedones',
  'São Vicente',
  'Morgade',
  'Medeiros',
  'Montalegre',
]

const domingosSexta = [
  'Carvalhais',
  'Vilarinho da Mó',
  'Carvalhelhos',
  'Boticas',
  'Carreira da Lebre',
  'Vilar',
  'Campos',
  'Viveiro',
  'Gosto Frio',
  'Agralos',
  'Vila Pequena',
  'Vila Grande',
  'Cerdedo',
]

const domingosQuarta = [
  'Arcos',
  'Vilarinho de Arcos',
  'Bobadela',
  'Nogueira',
  'Ardãos',
  'Boticas',
  'Carreira da Lebre',
  'Carvalhelhos',
  'Vilar',
  'Espertina',
  'Vila Pequena',
  'Vila Grande',
  'Cerdedo',
]

const taniaSegunda = [
  'Covelães',
  'Paredes do Rio',
  'Outeiro',
  'Paradela',
  'Reigoso',
  'Currais',
  'Venda Nova',
  'Codeçoso',
  'Paio Afonso',
  'Pondras',
  'Ormeche',
  'Ladrugães',
  'Vila da Ponte',
  'Vilarinho de Negrões',
  'Negrões',
  'Bustelo',
  'Contim',
  'Vilaça',
  'Fiães',
  'Loivos',
]

const taniaSabado = [
  'Covelães',
  'Paredes do Rio',
  'Outeiro',
  'Cela',
  'Paradela',
  'Loivos',
  'Fiães',
  'Vilaça',
  'São Pedro',
  'Contim',
  'Brandim',
  'Fervidelas',
  'Bustelo',
  'Lamas',
]

const taniaSexta = [
  'Paredes do Rio',
  'Outeiro',
  'Paradela',
  'Currais',
  'Reigoso',
  'Venda Nova',
  'Paio Afonso',
  'Pondras',
  'Ormeche',
  'Ladrugães',
  'Vila da Ponte',
  'Vilarinho de Negrões',
  'Negrões',
  'Padornelos',
  'Sendim',
  'Padroso',
  'Sabuzedo',
  'Mourilhe',
  'Cambeses do Rio',
  'Frades',
  'Travassos',
]

const taniaTerca = [
  'Tourós',
  'Mugueimes',
  'Lóbios',
  'Ameijoeira',
  'Curveira',
  'Cainheiras',
  'Eiras',
  'Barreiro',
  'Teso',
  'Portela',
  'Castro Laboreiro',
  'Falagueiras',
  'Adofreire',
  'Coriscadas',
  'Várzea',
  'Vido',
  'Alcobaça',
  'Lamas de Mouro',
  'Cubalhão',
  'Orjães',
  'Pomares',
  'Parada do Monte',
  'Melgaço',
]

const domingosDomingo = [
  'Requiás',
  'Guntumil',
  'Mãos de Sala',
  'Porqueiros',
  'Muíños',
  'As Conchas',
  'Xaus',
  'Carreiras',
  'Ganceiros',
  'Lóbios',
  'Feira Velha',
  'Entrimo',
  'Castro Laboreiro',
]

const taniaDays: WeekdayId[] = ['segunda', 'terca', 'sexta', 'sabado', 'domingo']

export const distributors: Distributor[] = [
  {
    id: 'tania',
    name: 'Tânia',
    days: taniaDays,
    open: ['domingo'],
    note: 'O domingo ainda está por fechar.',
    routes: {
      ...blankRoutes(),
      segunda: taniaSegunda,
      terca: taniaTerca,
      sexta: taniaSexta,
      sabado: taniaSabado,
    },
  },
  {
    id: 'ramos',
    name: 'Ramos',
    days: ['segunda', 'terca', 'quarta', 'sexta', 'sabado', 'domingo'],
    routes: {
      ...blankRoutes(),
      segunda: ramosSegunda,
      terca: ramosTerca,
      quarta: ramosQuarta,
      sexta: ramosSexta,
      sabado: ramosSabado,
      domingo: ramosDomingo,
    },
  },
  {
    id: 'domingos',
    name: 'Domingos',
    days: ['segunda', 'quarta', 'sexta', 'sabado', 'domingo'],
    note: 'A segunda é a mesma volta da sexta, sem Campos.',
    routes: {
      ...blankRoutes(),
      segunda: domingosSexta.filter((place) => place !== 'Campos'),
      quarta: domingosQuarta,
      sexta: domingosSexta,
      sabado: [
        'Tasquinha, Vieira do Minho',
        'Casa Varanda, Cerdeirinhas',
        'Agro Elisa, Cerdeirinhas',
        'Peixaria, Gualtar, Braga',
        'Trivial, Lamaçais',
        'Loja das Couves, Quinta da Capela',
        'Mercado Salgado, Quinta da Capela',
        'Pomar Fresco, Avenida da Liberdade',
      ],
      domingo: domingosDomingo,
    },
  },
  {
    id: 'isaac',
    name: 'Isaac',
    days: ['segunda', 'terca', 'sexta', 'sabado', 'domingo'],
    note: 'A terça partilha a zona da sexta de manhã e depois sobe a Espanha.',
    routes: {
      ...blankRoutes(),
      segunda: ['Chaves'],
      terca: [
        'Murça',
        'Jou',
        'Carrazedo de Montenegro',
        'Lebução',
        'Fornos do Pinhal',
        'Xinzo de Limia',
        'Allariz',
        'Baños de Molgas',
        'Ourense',
      ],
      sexta: ['Murça', 'Jou', 'Carrazedo de Montenegro', 'Vassal', 'Sonim', 'Lebução'],
      sabado: ['Cavez', 'Arco de Baúlhe', 'Fermil de Basto', 'Mota', 'Gandarela de Basto', 'Mondim de Basto'],
      domingo: ['Tourém', 'Aldeias do Alto Tâmega até Montalegre'],
    },
  },
  {
    id: 'augusto',
    name: 'Augusto',
    days: ['sexta'],
    note: 'Aos sábados está na Feira das Varandas, em Chaves, de 15 em 15 dias.',
    routes: {
      ...blankRoutes(),
      sexta: ['Xinzo de Limia', 'Allariz', 'Baños de Molgas', 'Ourense'],
      sabado: ['Feira das Varandas, Chaves · de 15 em 15 dias'],
    },
  },
]

export const team: { name: string; role?: string; text?: string; photo: string }[] = [
  {
    name: 'Augusto Marinho',
    role: 'Fundador',
    text: 'Minhoto, de Celorico de Basto. Veio para a serra com a Gracinda e ficou. A padaria é dos dois desde 2004.',
    photo: '',
  },
  {
    name: 'Gracinda Marinho',
    role: 'Padeira e fundadora',
    text: 'Cresceu em Pitões das Júnias. Depois dos anos em França, voltou com três filhos pequenos para cozer pão na aldeia, onde antes ele só chegava uma vez por semana.',
    photo: '',
  },
  { name: 'Lionel Marinho', photo: '' },
  {
    name: 'Marina Marinho',
    role: 'Atelier de bolos e eventos',
    text: 'Filha da casa. No atelier faz os bolos de aniversário e a pastelaria para as ocasiões, com a aldeia à volta.',
    photo: '',
  },
  { name: 'Helena', photo: '' },
  { name: 'Francisca', photo: '' },
  { name: 'Hugo', photo: '' },
  { name: 'Tânia', role: 'Distribuição', photo: '' },
  { name: 'Ramos', role: 'Distribuição', photo: '' },
  { name: 'Domingos', role: 'Distribuição', photo: '' },
  { name: 'Isaac', role: 'Distribuição', photo: '' },
  { name: 'Ana Maria', photo: '' },
  { name: 'Daniel', photo: '' },
]

export function initials(name: string) {
  return name
    .split(' ')
    .filter((part) => part.length > 2)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}
