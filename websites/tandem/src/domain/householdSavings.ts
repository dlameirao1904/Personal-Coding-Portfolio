import type { HouseholdSavingsMovement, Profile } from '@/types/supabase'

export const HOUSE_SAVINGS_UNASSIGNED_ID = '__house__'

export function savingsBalance(movements: HouseholdSavingsMovement[]): number {
  let total = 0
  for (const row of movements) {
    if (row.direction === 'deposit') total += Number(row.amount)
    else total -= Number(row.amount)
  }
  return Math.round(total * 100) / 100
}

export function contributionsByMember(
  movements: HouseholdSavingsMovement[],
  members: Profile[],
): { userId: string; name: string; deposited: number; withdrawn: number; net: number }[] {
  const map = new Map<string, { deposited: number; withdrawn: number }>()

  for (const row of movements) {
    const key = row.user_id ?? HOUSE_SAVINGS_UNASSIGNED_ID
    const entry = map.get(key) ?? { deposited: 0, withdrawn: 0 }
    if (row.direction === 'deposit') entry.deposited += Number(row.amount)
    else entry.withdrawn += Number(row.amount)
    map.set(key, entry)
  }

  const memberIds = new Set(members.map((m) => m.id))
  for (const id of map.keys()) {
    if (id !== HOUSE_SAVINGS_UNASSIGNED_ID) memberIds.add(id)
  }

  const rows = [...memberIds].map((userId) => {
    const member = members.find((m) => m.id === userId)
    const stats = map.get(userId) ?? { deposited: 0, withdrawn: 0 }
    const net = stats.deposited - stats.withdrawn
    return {
      userId,
      name: member?.display_name?.trim() || userId.slice(0, 8),
      deposited: Math.round(stats.deposited * 100) / 100,
      withdrawn: Math.round(stats.withdrawn * 100) / 100,
      net: Math.round(net * 100) / 100,
    }
  })

  if (map.has(HOUSE_SAVINGS_UNASSIGNED_ID)) {
    const stats = map.get(HOUSE_SAVINGS_UNASSIGNED_ID)!
    const net = stats.deposited - stats.withdrawn
    rows.push({
      userId: HOUSE_SAVINGS_UNASSIGNED_ID,
      name: 'Casa (sem pessoa)',
      deposited: Math.round(stats.deposited * 100) / 100,
      withdrawn: Math.round(stats.withdrawn * 100) / 100,
      net: Math.round(net * 100) / 100,
    })
  }

  return rows
}
