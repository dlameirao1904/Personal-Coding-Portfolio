import type { WorkoutActivityType, WorkoutLog } from '@/types/supabase'

export function parseMinutesSeconds(minutes: number, seconds: number): number | null {
  const m = Math.max(0, Math.floor(minutes))
  const s = Math.max(0, Math.floor(seconds))
  if (m === 0 && s === 0) return null
  return m * 60 + Math.min(s, 59)
}

export function formatDuration(totalSec: number): string {
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export interface WorkoutTypeStats {
  type: WorkoutActivityType
  label: string
  personalBestSec: number | null
  latestSec: number | null
  sessions: { occurred_on: string; duration_sec: number; distance_km: number | null }[]
}

export function buildWorkoutStats(
  logs: WorkoutLog[],
  labels: Record<WorkoutActivityType, string>,
): WorkoutTypeStats[] {
  const types = Object.keys(labels) as WorkoutActivityType[]

  return types.map((type) => {
    const withTime = logs
      .filter((l) => l.activity_type === type && l.duration_sec != null && l.duration_sec > 0)
      .sort((a, b) => a.occurred_on.localeCompare(b.occurred_on))

    const personalBestSec =
      withTime.length > 0 ? Math.min(...withTime.map((l) => l.duration_sec!)) : null
    const latest = withTime[withTime.length - 1]
    const latestSec = latest?.duration_sec ?? null

    return {
      type,
      label: labels[type],
      personalBestSec,
      latestSec,
      sessions: withTime.map((l) => ({
        occurred_on: l.occurred_on,
        duration_sec: l.duration_sec!,
        distance_km: l.distance_km ?? null,
      })),
    }
  })
}

/** Para o gráfico: largura relativa ao melhor tempo (100% = mais lento na amostra). */
export function barPercent(durationSec: number, maxSec: number, minSec: number): number {
  if (maxSec <= minSec) return 100
  const range = maxSec - minSec
  return 20 + ((durationSec - minSec) / range) * 80
}
