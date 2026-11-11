<script lang="ts" setup>
import { placePoint } from '@/data/route-points'
import { distributors, weekdays, type WeekdayId } from '@/data/site'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const personId = ref<string | 'todas'>('todas')
const dayId = ref<WeekdayId | 'todos'>('todos')
const host = ref<HTMLElement | null>(null)

// Extrai todas as localidades consoante os filtros ativos
const stops = computed(() => {
  const allStops = new Set<string>()
  const selectedPeople = personId.value === 'todas' 
    ? distributors 
    : distributors.filter(d => d.id === personId.value)
    
  selectedPeople.forEach(person => {
    weekdays.forEach(day => {
      if (dayId.value === 'todos' || dayId.value === day.id) {
        const places = person.routes[day.id] || []
        places.forEach(place => allStops.add(place))
      }
    })
  })
  return Array.from(allStops)
})

const isGlobalView = computed(() => personId.value === 'todas' || dayId.value === 'todos')

const plotted = computed(() =>
  stops.value.flatMap((name, index) => {
    const point = placePoint(name)
    return point ? [{ name, index, ...point }] : []
  }),
)

const missing = computed(() => stops.value.filter((name) => !placePoint(name)))

let map: L.Map | null = null
let layer: L.LayerGroup | null = null

function stopIcon(number?: number) {
  if (number === undefined) {
    return L.divIcon({
      className: 'route-stop-icon',
      html: `<span style="display:flex;height:18px;width:18px;border-radius:999px;background:#C4622D;border:2px solid #1A1410;"></span>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      popupAnchor: [0, -10],
    })
  }
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
  
  // Apenas desenha a linha da rota se for uma pessoa e um dia específicos
  if (!isGlobalView.value) {
    L.polyline(latlngs, { color: '#C4622D', weight: 3, opacity: 0.9 }).addTo(layer)
  }
  
  for (const stop of points) {
    const icon = isGlobalView.value ? stopIcon() : stopIcon(stop.index + 1)
    const label = isGlobalView.value ? `<strong>${stop.name}</strong>` : `<strong>${stop.index + 1}. ${stop.name}</strong>`
    L.marker([stop.lat, stop.lng], { icon })
      .bindPopup(label)
      .addTo(layer)
  }
  
  map.fitBounds(L.latLngBounds(latlngs), { padding: [40, 40], maxZoom: 12 })
}

function choosePerson(id: string) {
  personId.value = id
  if (id === 'todas') return
  
  const next = distributors.find((item) => item.id === id)
  if (!next) return
  
  // Se estiver num dia que esta pessoa não faz, muda para o primeiro dia válido dela
  if (dayId.value !== 'todos' && !next.routes[dayId.value as WeekdayId]?.length) {
    const day = weekdays.find((item) => next.routes[item.id]?.length)
    if (day) dayId.value = day.id
  }
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
        type="button"
        class="tw-rounded-full tw-border tw-px-4 tw-py-2 tw-text-sm"
        :class="personId === 'todas' ? 'tw-border-ink tw-bg-ink tw-text-flour' : 'tw-border-ink/15 tw-bg-white hover:tw-border-ink'"
        @click="choosePerson('todas')">
        Todas as rotas
      </button>
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
        type="button"
        class="tw-rounded-full tw-px-3 tw-py-1.5 tw-text-xs tw-uppercase tw-tracking-[0.14em]"
        :class="dayId === 'todos' ? 'tw-bg-crust tw-text-flour' : 'tw-bg-paper tw-text-ink/70 hover:tw-text-ink'"
        @click="dayId = 'todos'">
        Todos os dias
      </button>
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
        Não há localidades para a seleção atual.
      </p>
    </div>

    <p v-if="missing.length && !isGlobalView" class="tw-mt-3 tw-text-sm tw-leading-relaxed tw-text-ink/60">
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