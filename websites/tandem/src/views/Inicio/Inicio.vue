<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { user, hasHousehold, household, profile, isSupabaseConfigured } = useAuth()
</script>

<template>
  <div class="tw-mx-auto tw-max-w-3xl tw-space-y-6 tw-px-4 tw-py-10">
    <h1 class="tw-m-0 tw-text-3xl tw-font-semibold">Tandem</h1>
    <p class="tw-m-0 tw-text-muted">
      Ganhos e gastos em conjunto. Alimentação e treino só para ti.
    </p>

    <article v-if="!isSupabaseConfigured" class="tw-rounded-2xl tw-border tw-border-amber/40 tw-bg-amber/10 tw-p-4 tw-text-sm">
      Configura o Supabase no ficheiro <code class="tw-font-mono">.env</code> e aplica a migration SQL antes de usar a app.
    </article>

    <article v-else-if="!user" class="tw-rounded-2xl tw-bg-white tw-p-5 tw-shadow-card tw-text-sm">
      <p class="tw-m-0">Ainda não entraste.</p>
      <RouterLink to="/entrar" class="tw-mt-3 tw-inline-block tw-font-semibold tw-text-teal">Entrar ou criar conta</RouterLink>
    </article>

    <template v-else>
      <section class="tw-rounded-2xl tw-bg-white tw-p-5 tw-shadow-card">
        <p class="tw-m-0 tw-text-sm">
          Olá, <strong>{{ profile?.display_name ?? 'utilizador' }}</strong
          >.
          <span v-if="hasHousehold && household"> Casa: {{ household.name }}.</span>
          <span v-else> Falta juntar-te a uma casa para finanças.</span>
        </p>
      </section>

      <div class="tw-grid tw-gap-3 sm:tw-grid-cols-3">
        <RouterLink
          to="/financas"
          class="tw-rounded-2xl tw-border tw-border-salt tw-bg-white tw-p-4 tw-no-underline tw-text-ink hover:tw-border-teal"
        >
          <p class="tw-m-0 tw-font-semibold">Finanças</p>
          <p class="tw-m-0 tw-mt-1 tw-text-xs tw-text-muted">Casa + vista individual</p>
        </RouterLink>
        <RouterLink
          to="/alimentacao"
          class="tw-rounded-2xl tw-border tw-border-salt tw-bg-white tw-p-4 tw-no-underline tw-text-ink hover:tw-border-teal"
        >
          <p class="tw-m-0 tw-font-semibold">Alimentação</p>
          <p class="tw-m-0 tw-mt-1 tw-text-xs tw-text-muted">Plano semanal e kcal</p>
        </RouterLink>
        <RouterLink
          to="/treino"
          class="tw-rounded-2xl tw-border tw-border-salt tw-bg-white tw-p-4 tw-no-underline tw-text-ink hover:tw-border-teal"
        >
          <p class="tw-m-0 tw-font-semibold">Treino</p>
          <p class="tw-m-0 tw-mt-1 tw-text-xs tw-text-muted">Peso e sessões</p>
        </RouterLink>
      </div>
    </template>
  </div>
</template>
