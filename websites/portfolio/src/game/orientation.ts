import { ref } from 'vue'

/** The journey stage is CSS-rotated 90° clockwise to fake a landscape layout. */
export const journeyTurned = ref(false)

/**
 * Map a viewport delta into the stage's axes.
 * With rotate(90deg) and origin at the top-left, stage +x points down the screen
 * and stage +y points toward the left.
 */
export function toStageDelta(dx: number, dy: number) {
  if (!journeyTurned.value) return { x: dx, y: dy }
  return { x: dy, y: -dx }
}
