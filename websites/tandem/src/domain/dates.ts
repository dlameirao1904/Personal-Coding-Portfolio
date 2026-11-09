export function toISODate(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10)
}

/** Segunda-feira da semana que contém `date`. */
export function weekStartMonday(date: Date = new Date()): string {
  const copy = new Date(date)
  const day = copy.getDay()
  const diff = day === 0 ? -6 : 1 - day
  copy.setDate(copy.getDate() + diff)
  return toISODate(copy)
}

export function monthStart(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}
