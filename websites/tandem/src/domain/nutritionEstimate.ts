export type NumericRange = { min: number; max: number; mid: number }

export type MacroEstimate = {
  calories: NumericRange
  protein_g: NumericRange
  matchedParts: number
  totalParts: number
  source: 'local'
}

type FoodRule = {
  keys: string[]
  kcalPer100g: number
  proteinPer100g: number
  /** When text says (cru) or keyword massa/arroz without cozido */
  rawKcalPer100g?: number
  rawProteinPer100g?: number
  defaultGrams?: number
}

const FOODS: FoodRule[] = [
  { keys: ['frango', 'peru', 'peito'], kcalPer100g: 165, proteinPer100g: 31 },
  { keys: ['vaca', 'carne magra', 'bife', 'almôndega', 'hambúrguer'], kcalPer100g: 180, proteinPer100g: 26 },
  { keys: ['salmão', 'salmao'], kcalPer100g: 208, proteinPer100g: 20 },
  { keys: ['pescada', 'dourada', 'bacalhau', 'atum'], kcalPer100g: 120, proteinPer100g: 24 },
  {
    keys: ['arroz'],
    kcalPer100g: 130,
    proteinPer100g: 2.7,
    rawKcalPer100g: 360,
    rawProteinPer100g: 7,
  },
  {
    keys: ['massa', 'esparguete', 'spaghetti'],
    kcalPer100g: 131,
    proteinPer100g: 5,
    rawKcalPer100g: 350,
    rawProteinPer100g: 13,
  },
  { keys: ['batata-doce', 'batata doce'], kcalPer100g: 86, proteinPer100g: 1.6 },
  { keys: ['batata', 'puré'], kcalPer100g: 87, proteinPer100g: 1.9 },
  { keys: ['feijão', 'grão', 'grao'], kcalPer100g: 127, proteinPer100g: 8.7 },
  { keys: ['aveia', 'overnight oats', 'panqueca'], kcalPer100g: 389, proteinPer100g: 17 },
  { keys: ['skyr'], kcalPer100g: 59, proteinPer100g: 11 },
  { keys: ['quark', 'iogurte'], kcalPer100g: 70, proteinPer100g: 10 },
  { keys: ['queijo fresco', 'queijo'], kcalPer100g: 264, proteinPer100g: 18 },
  { keys: ['whey'], kcalPer100g: 400, proteinPer100g: 80, defaultGrams: 25 },
  { keys: ['pão', 'pao', 'wrap'], kcalPer100g: 250, proteinPer100g: 9, defaultGrams: 50 },
  { keys: ['banana'], kcalPer100g: 89, proteinPer100g: 1.1, defaultGrams: 120 },
  { keys: ['ovo', 'ovos'], kcalPer100g: 143, proteinPer100g: 13, defaultGrams: 55 },
  { keys: ['azeite'], kcalPer100g: 884, proteinPer100g: 0, defaultGrams: 10 },
  { keys: ['legumes', 'salada'], kcalPer100g: 35, proteinPer100g: 2, defaultGrams: 100 },
]

function band(value: number, pct: number): NumericRange {
  const v = Math.max(0, value)
  return {
    min: Math.round(v * (1 - pct)),
    max: Math.round(v * (1 + pct)),
    mid: Math.round(v),
  }
}

function mergeBands(a: NumericRange, b: NumericRange): NumericRange {
  return {
    min: a.min + b.min,
    max: a.max + b.max,
    mid: a.mid + b.mid,
  }
}

function parseGrams(fragment: string): number | null {
  const g = fragment.match(/(\d+(?:[.,]\d+)?)\s*g\b/i)
  if (g) return Number(g[1].replace(',', '.'))
  const ml = fragment.match(/(\d+(?:[.,]\d+)?)\s*ml\b/i)
  if (ml) return Number(ml[1].replace(',', '.'))
  const eggs = fragment.match(/(\d+)\s*ovos?\b/i)
  if (eggs) return Number(eggs[1]) * 55
  return null
}

function isRaw(fragment: string): boolean {
  return /\bcru\b|\bcrú\b|\(cru\)/i.test(fragment)
}

function matchFood(fragment: string): FoodRule | null {
  const lower = fragment.toLowerCase()
  for (const rule of FOODS) {
    if (rule.keys.some((k) => lower.includes(k))) return rule
  }
  return null
}

function macrosForFragment(fragment: string): { kcal: number; protein: number; matched: boolean } {
  const rule = matchFood(fragment)
  if (!rule) return { kcal: 0, protein: 0, matched: false }

  const grams = parseGrams(fragment) ?? rule.defaultGrams ?? 100
  const useRaw =
    rule.rawKcalPer100g != null && (isRaw(fragment) || /\barroz\b|\bmassa\b/i.test(fragment) && !/cozid/i.test(fragment))

  const kcal100 = useRaw && rule.rawKcalPer100g != null ? rule.rawKcalPer100g : rule.kcalPer100g
  const p100 = useRaw && rule.rawProteinPer100g != null ? rule.rawProteinPer100g : rule.proteinPer100g

  return {
    kcal: (kcal100 * grams) / 100,
    protein: (p100 * grams) / 100,
    matched: true,
  }
}

function splitMealTitle(title: string): string[] {
  return title
    .split(/[,;+]|(?:\s+e\s+)/i)
    .map((s) => s.trim())
    .filter(Boolean)
}

function uncertaintyPct(matched: number, total: number): number {
  if (total === 0) return 0.25
  const ratio = matched / total
  if (ratio >= 1) return 0.1
  if (ratio >= 0.66) return 0.14
  if (ratio >= 0.33) return 0.18
  return 0.22
}

export function estimateMealMacrosLocal(title: string): MacroEstimate | null {
  const parts = splitMealTitle(title)
  if (!parts.length) return null

  let kcal = 0
  let protein = 0
  let matched = 0

  for (const part of parts) {
    const m = macrosForFragment(part)
    if (m.matched) {
      kcal += m.kcal
      protein += m.protein
      matched += 1
    }
  }

  if (matched === 0) return null

  const pct = uncertaintyPct(matched, parts.length)
  let calRange = band(kcal, pct)
  let pRange = band(protein, pct)

  if (matched < parts.length) {
    const unknown = parts.length - matched
    const guessKcal = unknown * 80
    const guessP = unknown * 4
    const extraK = band(guessKcal, 0.35)
    const extraP = band(guessP, 0.35)
    calRange = mergeBands(calRange, extraK)
    pRange = mergeBands(pRange, extraP)
  }

  return {
    calories: calRange,
    protein_g: pRange,
    matchedParts: matched,
    totalParts: parts.length,
    source: 'local',
  }
}

export function estimateMealMacros(title: string): MacroEstimate {
  const local = estimateMealMacrosLocal(title)
  if (local) return local

  throw new Error('Não consegui estimar. Inclui alimentos e quantidades (ex.: «Frango 130 g, arroz 65 g (cru)»).')
}

export function formatMacroRange(range: NumericRange, unit: string): string {
  return `${range.min}–${range.max} ${unit}`
}

export function estimateConfidenceLabel(est: MacroEstimate): string {
  const ratio = est.totalParts > 0 ? est.matchedParts / est.totalParts : 0
  if (ratio >= 1) return 'Boa correspondência'
  if (ratio >= 0.66) return 'Estimativa razoável'
  return 'Estimativa ampla — confirma os valores'
}
