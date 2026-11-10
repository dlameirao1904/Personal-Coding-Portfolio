export type CatalogProduct = {
  name: string
  detail?: string
  options?: string[]
  price?: string
}

export const padaria: CatalogProduct[] = [
  { name: 'Bijous', detail: 'Pão pequeno de trigo.', price: '0,18 € a unidade' },
  { name: 'Bijous da avó', detail: 'Pão pequeno de trigo, com um sabor mais rústico.', price: '0,25 € a unidade' },
  { name: 'Cacete da avó', detail: 'Formato de cacete, a mesma massa do bijou da avó.', price: '1,80 €' },
  { name: 'Sêmeas de trigo', detail: 'Formato de broa, a mesma massa do bijou.', price: '1,60 €' },
  { name: 'Cacete de rabanada', detail: 'Formato de cacete, um pouco mais fino, a mesma massa do bijou.', price: '1,10 €' },
  { name: 'Baguete de trigo', detail: 'Formato de baguete, a mesma massa do bijou da avó.', price: '1,20 €' },
  { name: 'Cacete de centeio', detail: 'Formato de cacete, massa de centeio, 1 kg.', price: '1,90 €' },
  { name: 'Broa de centeio', detail: 'Formato de broa, massa de centeio, 2 kg.', price: '3,40 €' },
  { name: 'Panoche de centeio', detail: 'Formato de broa, massa de centeio, 1 kg.', price: '1,90 €' },
  { name: 'Bica batida de centeio', detail: 'Formato de disco, massa de centeio, 1 kg.', price: '1,90 €' },
  { name: 'Cacete de mistura', detail: 'Formato de cacete, massa de centeio e trigo, 1 kg.', price: '1,90 €' },
  { name: 'Baguete de mistura', detail: 'Formato de baguete, massa de centeio e trigo, 500 g.', price: '1,20 €' },
  { name: 'Broa de mistura', detail: 'Formato de broa, massa de centeio e trigo, 1,5 kg.', price: '3 €' },
  {
    name: 'Bica de carne',
    detail: 'Massa de centeio batida, com barriga de porco fumada, chouriça, cebola à escolha e toucinho seco.',
    price: '7,50 €',
  },
  { name: 'Empanada de atum', detail: 'Massa de trigo com atum, ovos, pimento e cebola.', price: '16 €' },
  { name: 'Folar', detail: 'Massa de folar, com ovos e azeite, barriga de porco fumada e chouriça.', price: '16 €/kg' },
]

export const pastelaria: CatalogProduct[] = [
  {
    name: 'Rosca flor',
    detail: 'Massa brioche.',
    options: [
      'Creme pasteleiro no interior e coco ralado por cima',
      'Creme pasteleiro com canela no interior e amêndoa por cima',
      'Creme de chocolate e pepitas de chocolate',
    ],
  },
  {
    name: 'Pães de leite',
    detail: 'A mesma massa brioche, simples ou com pepitas de chocolate.',
  },
  {
    name: 'Tranças',
    detail: 'A mesma massa brioche, em trança, pincelada com ovo.',
    options: ['Pepitas de chocolate e açúcar por cima', 'Coco ralado por cima', 'Amêndoa por cima'],
  },
  { name: 'Rosca de chila e noz', detail: 'Massa brioche em formato de donut, com chila e noz no interior.' },
  { name: 'Pão-de-ló' },
  {
    name: 'Tartes',
    options: ['Chocolate', 'Noz', 'Chocolate e noz', 'Chocolate e laranja', 'Maçã', 'Pêssego', 'Ananás'],
  },
  { name: 'Tarte folhada de maçã' },
  { name: 'Tarte folhada variada' },
  { name: 'Tarte folhada de pêssego' },
  { name: 'Tarte de morango' },
  { name: 'Bolo de arroz' },
  { name: 'Pastéis de nata' },
  { name: 'Bolas de Berlim' },
  { name: 'Bolas de Berlim de chocolate' },
  { name: 'Queques', options: ['Chocolate', 'Noz'] },
  {
    name: 'Cornetos de chocolate',
    detail: 'Massa folhada em cone, com creme pasteleiro no interior e chocolate por cima.',
  },
  { name: 'Folhados mistos' },
  { name: 'Lanches mistos' },
  { name: 'Caracóis de passas' },
  { name: 'Caracóis de chocolate' },
  { name: 'Pastéis de Chaves' },
  { name: 'Croissant brioche' },
  { name: 'Croissant brioche de chocolate' },
  { name: 'Croissant brioche de amêndoa', detail: 'A amêndoa vai só por cima.' },
  { name: 'Croissant folhado' },
  { name: 'Croissant folhado de chocolate' },
  { name: 'Folhados de maçã' },
  { name: 'Mini tartes de maçã' },
  { name: 'Jesuítas' },
  { name: 'Bolo russo' },
  { name: 'Éclairs' },
  { name: 'Húngaros' },
  { name: 'Croissant de sementes' },
  { name: 'Palmiers' },
]
