<script lang="ts" setup>
import { placePoint } from '@/data/route-points'
import { distributors, weekdays, type WeekdayId } from '@/data/site'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const personId = ref('ramos')
const dayId = ref<WeekdayId>('segunda')
const host = ref<HTMLElement | null>(null)

const person = computed(() => distributors.find((item) => item.id === personId.value) ?? distributors[0])
const stops = computed(() => person.value?.routes[dayId.value] ?? [])

const plotted = computed(() =>
  stops.value.flatMap((name, index) => {
    const point = placePoint(name)
    return point ? [{ name, index, ...point }] : []
  }),
)

const missing = computed(() => stops.value.filter((name) => !placePoint(name)))

let map: L.Map | null = null
let layer: L.LayerGroup | null = null

function stopIcon(number: number) {
  return L.divIcon({
    className: 'route-stop-icon',
    html: `<span style="display:flex;height:26px;width:26px;align-items:center;justify-content:center;border-radius:999px;background:#C4622D;color:#F4EFE6;border:2px solid #1A1410;font:600 11px Outfit,sans-serif">${number}</span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -16],
  })
}

function spots() {
  const seen = new Map<string, number>()
  return plotted.value.map((stop) => {
    const key = `${stop.lat.toFixed(3)},${stop.lng.toFixed(3)}`
    const count = seen.get(key) ?? 0
    seen.set(key, count + 1)
    if (!count) return stop
    return {
      ...stop,
      lat: stop.lat + Math.sin(count) * 0.002,
      lng: stop.lng + Math.cos(count) * 0.002,
    }
  })
}

function draw() {
  if (!map || !layer) return
  layer.clearLayers()
  const points = spots()
  if (!points.length) {
    map.setView([41.75, -7.85], 8)
    return
  }
  const latlngs = points.map((stop) => [stop.lat, stop.lng] as [number, number])
  L.polyline(latlngs, { color: '#C4622D', weight: 3, opacity: 0.9 }).addTo(layer)
  for (const stop of points) {
    L.marker([stop.lat, stop.lng], { icon: stopIcon(stop.index + 1) })
      .bindPopup(`<strong>${stop.index + 1}. ${stop.name}</strong>`)
      .addTo(layer)
  }
  map.fitBounds(L.latLngBounds(latlngs), { padding: [40, 40], maxZoom: 12 })
}

function choosePerson(id: string) {
  personId.value = id
  const next = distributors.find((item) => item.id === id)
  if (!next || next.routes[dayId.value].length) return
  const day = weekdays.find((item) => next.routes[item.id].length)
  if (day) dayId.value = day.id
}

onMounted(async () => {
  if (!host.value) return
  map = L.map(host.value, { scrollWheelZoom: false })
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19,
  }).addTo(map)
  layer = L.layerGroup().addTo(map)
  map.on('focus', () => map?.scrollWheelZoom.enable())
  map.on('blur', () => map?.scrollWheelZoom.disable())
  await nextTick()
  map.invalidateSize()
  draw()
})

watch([personId, dayId], async () => {
  await nextTick()
  draw()
})

onUnmounted(() => {
  map?.remove()
  map = null
  layer = null
})
</script>

<template>
  <section class="tw-mx-auto tw-mt-10 tw-max-w-6xl tw-px-5 md:tw-px-8">
    <div class="tw-flex tw-flex-wrap tw-gap-2">
      <button
        v-for="item in distributors"
        :key="item.id"
        type="button"
        class="tw-rounded-full tw-border tw-px-4 tw-py-2 tw-text-sm"
        :class="item.id === personId ? 'tw-border-ink tw-bg-ink tw-text-flour' : 'tw-border-ink/15 tw-bg-white hover:tw-border-ink'"
        @click="choosePerson(item.id)">
        {{ item.name }}
      </button>
    </div>
    <div class="tw-mt-3 tw-flex tw-flex-wrap tw-gap-2">
      <button
        v-for="day in weekdays"
        :key="day.id"
        type="button"
        class="tw-rounded-full tw-px-3 tw-py-1.5 tw-text-xs tw-uppercase tw-tracking-[0.14em]"
        :class="day.id === dayId ? 'tw-bg-crust tw-text-flour' : 'tw-bg-paper tw-text-ink/70 hover:tw-text-ink'"
        @click="dayId = day.id">
        {{ day.label }}
      </button>
    </div>

    <div class="tw-isolate tw-relative tw-mt-5 tw-overflow-hidden tw-rounded-[1.75rem] tw-border tw-border-ink/10">
      <div ref="host" class="tw-h-[28rem] tw-w-full md:tw-h-[36rem]" role="application" aria-label="Mapa da volta" />
      <p
        v-if="!stops.length"
        class="tw-pointer-events-none tw-absolute tw-inset-x-0 tw-bottom-4 tw-mx-auto tw-w-fit tw-rounded-full tw-bg-flour/95 tw-px-4 tw-py-2 tw-text-sm tw-text-ink/70">
        Neste dia a volta ainda não tem localidades.
      </p>
    </div>

    <p v-if="missing.length" class="tw-mt-3 tw-text-sm tw-leading-relaxed tw-text-ink/60">
      Sem ponto no mapa: {{ missing.join(', ') }}.
    </p>
  </section>
</template>

<style>
.route-stop-icon {
  background: transparent;
  border: 0;
}
</style>
