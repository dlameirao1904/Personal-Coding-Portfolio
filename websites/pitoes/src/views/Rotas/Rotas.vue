<script lang="ts" setup>
import PageHeading from '@/components/PageHeading.vue'
import RouteMap from '@/components/RouteMap.vue'
import { distributors, weekdays, type WeekdayId } from '@/data/site'

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
      lede="Cinco pessoas levam o pão para fora de Pitões. A Tânia já tem segunda, terça, sexta e sábado; o domingo ainda falta fechar.">
      As rotas <span class="tw-italic tw-text-rye">da semana.</span>
    </PageHeading>

    <RouteMap />

    <div class="tw-mx-auto tw-mt-16 tw-grid tw-max-w-6xl tw-gap-6 tw-px-5 md:tw-px-8">
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
