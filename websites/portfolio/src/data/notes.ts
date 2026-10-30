import acordaos from '../../MDs/University/Terceiro Ano/Projeto.md?raw'
import agar from '../../MDs/University/Terceiro Ano/PC.md?raw'
import atelier from '../../MDs/Projects/atelier.md?raw'
import casa from '../../MDs/University/Segundo Ano/POO.md?raw'
import dados from '../../MDs/University/Terceiro Ano/BD.md?raw'
import funcional from '../../MDs/University/Primeiro Ano/PF.md?raw'
import grafica from '../../MDs/University/Terceiro Ano/CG.md?raw'
import gralhas from '../../MDs/Projects/gralhas.md?raw'
import grover from '../../MDs/University/Terceiro Ano/IC.md?raw'
import imperativa from '../../MDs/University/Primeiro Ano/PI.md?raw'
import la1 from '../../MDs/University/Primeiro Ano/LA1.md?raw'
import linguagens from '../../MDs/University/Terceiro Ano/PL.md?raw'
import martrack from '../../MDs/Projects/martrack.md?raw'
import mceliece from '../../MDs/University/Mestrado/Teoria de Codigos.md?raw'
import processos from '../../MDs/University/Segundo Ano/SO.md?raw'
import reconstrucao from '../../MDs/Projects/3d.md?raw'
import redes from '../../MDs/University/Segundo Ano/SCR.md?raw'
import rover from '../../MDs/Projects/QuanticRover.md?raw'
import siem from '../../MDs/Projects/cyber.md?raw'
import vertice from '../../MDs/University/Mestrado/Projeto Integrado.md?raw'

const notes: Record<string, string> = {
  la1,
  funcional,
  imperativa,
  casa,
  processos,
  redes,
  dados,
  grafica,
  grover,
  agar,
  linguagens,
  acordaos,
  mceliece,
  vertice,
  atelier,
  martrack,
  gralhas,
  rover,
  reconstrucao,
  siem,
}

function plain(value: string) {
  return value
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
}

function isTableRow(line: string) {
  return line.trim().startsWith('|') && line.trim().endsWith('|')
}

function isRule(line: string) {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim())
}

function cells(line: string) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => plain(cell.trim()))
}

export type NoteBlock =
  | { type: 'h'; level: 1 | 2 | 3; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'pre'; text: string }
  | { type: 'table'; head: string[]; rows: string[][] }

const blockCache = new Map<string, NoteBlock[]>()

/** Blocos do markdown do projeto. Vazio se o marco não tiver ficha. */
export function noteBlocks(id: string): NoteBlock[] {
  const cached = blockCache.get(id)
  if (cached) return cached
  const blocks = parseNote(id)
  blockCache.set(id, blocks)
  return blocks
}

function parseNote(id: string): NoteBlock[] {
  const source = notes[id]
  if (!source) return []
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const blocks: NoteBlock[] = []
  let index = 0
  const paragraph: string[] = []
  const flushParagraph = () => {
    if (!paragraph.length) return
    blocks.push({ type: 'p', text: plain(paragraph.join(' ')) })
    paragraph.length = 0
  }

  while (index < lines.length) {
    const trimmed = lines[index].trim()

    if (!trimmed) {
      flushParagraph()
      index += 1
      continue
    }

    if (trimmed.startsWith('```')) {
      flushParagraph()
      const code: string[] = []
      index += 1
      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        code.push(lines[index])
        index += 1
      }
      blocks.push({ type: 'pre', text: code.join('\n') })
      index += 1
      continue
    }

    if (isTableRow(trimmed) && index + 1 < lines.length && isRule(lines[index + 1])) {
      flushParagraph()
      const head = cells(trimmed)
      index += 2
      const rows: string[][] = []
      while (index < lines.length && isTableRow(lines[index])) {
        rows.push(cells(lines[index]))
        index += 1
      }
      blocks.push({ type: 'table', head, rows })
      continue
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(trimmed)
    if (heading) {
      flushParagraph()
      blocks.push({
        type: 'h',
        level: heading[1].length as 1 | 2 | 3,
        text: plain(heading[2]),
      })
      index += 1
      continue
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph()
      const items: string[] = []
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(plain(lines[index].trim().replace(/^[-*]\s+/, '')))
        index += 1
      }
      blocks.push({ type: 'ul', items })
      continue
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph()
      const items: string[] = []
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(plain(lines[index].trim().replace(/^\d+\.\s+/, '')))
        index += 1
      }
      blocks.push({ type: 'ol', items })
      continue
    }

    paragraph.push(trimmed)
    index += 1
  }

  flushParagraph()
  return blocks
}
