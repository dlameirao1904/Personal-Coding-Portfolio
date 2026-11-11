<script lang="ts" setup>
import PageHeading from '@/components/PageHeading.vue'
import RouteMap from '@/components/RouteMap.vue'
import { distributors, weekdays, type WeekdayId } from '@/data/site'
import { ref, computed } from 'vue'

const searchQuery = ref('')

// Estrutura de dados para a pesquisa: devolve { lugar, visitas: [{ pessoa, dia }] }
const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []
  
  const term = searchQuery.value.trim().toLowerCase()
  const results = new Map<string, { place: string; visits: { person: string; day: string }[] }>()

  distributors.forEach((person) => {
    weekdays.forEach((day) => {
      const places = person.routes[day.id] || []
      places.forEach((place) => {
        if (place.toLowerCase().includes(term)) {
          if (!results.has(place)) {
            results.set(place, { place, visits: [] })
          }
          results.get(place)!.visits.push({ person: person.name, day: day.label })
        }
      })
    })
  })

  // Retorna os resultados ordenados alfabeticamente
  return Array.from(results.values()).sort((a, b) => a.place.localeCompare(b.place))
})

function goesOut(days: WeekdayId[], day: WeekdayId) {
  return days.includes(day)
}

function isOpen(open: WeekdayId[] | undefined, day: WeekdayId) {
  return open?.includes(day) ?? false
}
</script>

<template>
  <div class="tw-pb-24">
    <PageHeading
      eyebrow="Distribuição"
      lede="Cinco percursos, o mesmo compromisso. A nossa equipa de distribuição percorre as estradas do Barroso, e não só, para fazer chegar a qualidade da nossa padaria à sua porta.">
      As rotas <span class="tw-italic tw-text-rye">da semana.</span>
    </PageHeading>

    <!-- Campo de Pesquisa -->
    <div class="tw-mx-auto tw-mt-12 tw-max-w-xl tw-px-5 text-center">
      <h3 class="tw-font-serif tw-text-2xl tw-mb-4">O pão passa na sua aldeia?</h3>
      <div class="tw-relative">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Ex: Montalegre, Salto, Venda Nova..."
          class="tw-w-full tw-rounded-full tw-border tw-border-ink/20 tw-bg-paper tw-px-6 tw-py-4 tw-text-ink placeholder:tw-text-ink/40 focus:tw-border-rye focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-rye"
        />
      </div>
      
      <!-- Resultados da Pesquisa -->
      <div v-if="searchQuery" class="tw-mt-6 tw-text-left tw-space-y-4">
        <p v-if="searchResults.length === 0" class="tw-text-center tw-text-ink/60">
          Não encontrámos "{{ searchQuery }}" nas nossas rotas atuais.
        </p>
        <div 
          v-for="result in searchResults" 
          :key="result.place"
          class="tw-rounded-2xl tw-bg-paper tw-p-5 tw-border tw-border-ink/10"
        >
          <p class="tw-font-serif tw-text-xl tw-text-ink">{{ result.place }}</p>
          <ul class="tw-mt-3 tw-flex tw-flex-wrap tw-gap-2">
            <li 
              v-for="(visit, idx) in result.visits" 
              :key="idx"
              class="tw-rounded-full tw-bg-flour tw-px-3 tw-py-1 tw-text-sm tw-text-ink/80"
            >
              <span class="tw-font-medium">{{ visit.person }}</span> - {{ visit.day }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Mapa -->
    <RouteMap class="tw-mt-8" />

    <!-- Listagem Completa -->
    <div class="tw-mx-auto tw-mt-24 tw-grid tw-max-w-6xl tw-gap-6 tw-px-5 md:tw-px-8">
      <h2 class="tw-font-serif tw-text-4xl tw-mb-2">Todas as voltas</h2>
      <article v-for="person in distributors" :key="person.id" class="tw-rounded-[1.75rem] tw-bg-paper tw-p-6 md:tw-p-8">
        <div class="tw-flex tw-flex-wrap tw-items-baseline tw-justify-between tw-gap-3">
          <div>
            <h2 class="tw-font-serif tw-text-3xl">{{ person.name }}</h2>
            <p v-if="person.note" class="tw-mt-2 tw-max-w-md tw-text-sm tw-leading-relaxed tw-text-ink/60">{{ person.note }}</p>
          </div>
        </div>
        <ul class="tw-mt-6 tw-grid tw-gap-3 sm:tw-grid-cols-2 lg:tw-grid-cols-4">
          <li v-for="day in weekdays" :key="day.id" class="tw-rounded-2xl tw-bg-flour tw-px-4 tw-py-3">
            <p class="tw-text-[11px] tw-uppercase tw-tracking-[0.16em] tw-text-ink/45">{{ day.label }}</p>
            <ul v-if="person.routes[day.id].length" class="tw-mt-2 tw-flex tw-flex-wrap tw-gap-1.5">
              <li v-for="(place, index) in person.routes[day.id]" :key="`${day.id}-${index}`" class="tw-rounded-full tw-bg-white tw-px-2.5 tw-py-1 tw-text-xs tw-leading-snug">
                {{ place }}
              </li>
            </ul>
            <p v-else-if="isOpen(person.open, day.id)" class="tw-mt-2 tw-text-sm">Ainda por definir</p>
            <p v-else-if="goesOut(person.days, day.id)" class="tw-mt-2 tw-text-sm">Em distribuição</p>
            <p v-else class="tw-mt-2 tw-text-sm tw-text-ink/35">—</p>
          </li>
        </ul>
      </article>
    </div>
  </div>
</template>