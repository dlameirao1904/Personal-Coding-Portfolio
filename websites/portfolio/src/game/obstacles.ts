/** Círculos de colisão em grelha. Cada passo só testa o que está ao pé, não a floresta inteira. */

export type Circle = { x: number; z: number; r: number }

const CELL = 12

export function createObstacleIndex() {
  const buckets = new Map<number, Circle[]>()
  const placed = new Map<Circle, number>()

  const key = (ix: number, iz: number) => (ix + 4096) * 8192 + (iz + 4096)

  const insert = (item: Circle) => {
    if (placed.has(item)) return
    const bucketKey = key(Math.floor(item.x / CELL), Math.floor(item.z / CELL))
    let bucket = buckets.get(bucketKey)
    if (!bucket) buckets.set(bucketKey, (bucket = []))
    bucket.push(item)
    placed.set(item, bucketKey)
  }

  const remove = (item: Circle) => {
    const bucketKey = placed.get(item)
    if (bucketKey === undefined) return
    const bucket = buckets.get(bucketKey)
    if (bucket) {
      const index = bucket.indexOf(item)
      if (index >= 0) bucket.splice(index, 1)
    }
    placed.delete(item)
  }

  const hits = (x: number, z: number, inset: number) => {
    const ix = Math.floor(x / CELL)
    const iz = Math.floor(z / CELL)
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        const bucket = buckets.get(key(ix + dx, iz + dz))
        if (!bucket) continue
        for (let i = 0; i < bucket.length; i++) {
          const item = bucket[i]
          const gapX = x - item.x
          const gapZ = z - item.z
          const reach = inset > 0 ? Math.max(0.35, item.r - inset) : item.r
          if (gapX * gapX + gapZ * gapZ < reach * reach) return true
        }
      }
    }
    return false
  }

  return { insert, remove, hits }
}

export function trackObstacles(list: Circle[], index: ReturnType<typeof createObstacleIndex>) {
  const push = list.push.bind(list)
  const splice = list.splice.bind(list)
  list.push = (...items: Circle[]) => {
    const result = push(...items)
    for (const item of items) index.insert(item)
    return result
  }
  list.splice = ((start: number, deleteCount?: number, ...items: Circle[]) => {
    const removed = deleteCount === undefined ? splice(start) : splice(start, deleteCount, ...items)
    for (const item of removed) index.remove(item)
    for (const item of items) index.insert(item)
    return removed
  }) as typeof list.splice
  return list
}
