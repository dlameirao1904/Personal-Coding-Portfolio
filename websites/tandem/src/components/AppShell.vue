<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import UserAvatar from '@/components/UserAvatar.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()

const { user, profile, household, signOut, isSupabaseConfigured, displayName, houseLabel, ready } =
  useAuth()

const drawerOpen = ref(false)

const links = [
  { to: '/', label: 'Início' },
  { to: '/financas', label: 'Finanças' },
  { to: '/alimentacao', label: 'Alimentação' },
  { to: '/treino', label: 'Treino' },
  { to: '/perfil', label: 'Perfil' },
  { to: '/casa', label: 'Casa' },
]

const showChrome = computed(() => ready.value && Boolean(user.value))
const headerSubtitle = computed(() => (household.value ? houseLabel.value : 'Sem casa'))

watch(
  () => route.fullPath,
  () => {
    drawerOpen.value = false
  },
)

async function onSignOut() {
  drawerOpen.value = false
  await signOut()
  await router.replace('/entrar')
}
</script>

<template>
  <div class="tw-min-h-dvh tw-flex tw-flex-col" :class="showChrome ? 'tw-bg-paper' : ''">
    <header
      v-if="showChrome"
      class="tw-sticky tw-top-0 tw-z-30 tw-border-b tw-border-salt tw-bg-paper/95 tw-backdrop-blur"
    >
      <div
        class="tw-mx-auto tw-flex tw-max-w-5xl tw-items-center tw-justify-between tw-gap-3 tw-px-4 tw-py-3"
      >
        <div class="tw-flex tw-min-w-0 tw-flex-1 tw-items-center tw-gap-1">
          <button
            type="button"
            class="tw-inline-flex tw-h-10 tw-w-10 tw-shrink-0 tw-items-center tw-justify-center tw-rounded-lg tw-border tw-border-salt md:tw-hidden"
            aria-label="Abrir menu"
            @click="drawerOpen = true"
          >
            <span class="tw-flex tw-flex-col tw-gap-1">
              <span class="tw-block tw-h-0.5 tw-w-5 tw-rounded tw-bg-ink" />
              <span class="tw-block tw-h-0.5 tw-w-5 tw-rounded tw-bg-ink" />
              <span class="tw-block tw-h-0.5 tw-w-5 tw-rounded tw-bg-ink" />
            </span>
          </button>

          <nav class="tw-hidden tw-flex-wrap tw-items-center tw-gap-1 md:tw-flex">
            <RouterLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="tw-rounded-lg tw-px-3 tw-py-1.5 tw-text-sm tw-font-medium tw-text-muted tw-no-underline hover:tw-bg-salt hover:tw-text-ink"
              active-class="!tw-bg-teal !tw-text-paper"
            >
              {{ link.label }}
            </RouterLink>
            <button
              v-if="isSupabaseConfigured"
              type="button"
              class="tw-rounded-lg tw-px-3 tw-py-1.5 tw-text-sm tw-font-semibold tw-text-danger hover:tw-bg-danger/10"
              @click="onSignOut"
            >
              Sair
            </button>
          </nav>
        </div>

        <RouterLink
          to="/perfil"
          class="tw-flex tw-max-w-[55%] tw-shrink-0 tw-items-center tw-gap-2 tw-no-underline tw-text-ink sm:tw-max-w-none"
        >
          <div class="tw-min-w-0 tw-text-right">
            <p class="tw-m-0 tw-truncate tw-font-semibold tw-leading-tight">{{ displayName }}</p>
            <p class="tw-m-0 tw-truncate tw-text-xs tw-text-muted">{{ headerSubtitle }}</p>
          </div>
          <UserAvatar :name="displayName" :image-url="profile?.avatar_url" size="md" />
        </RouterLink>
      </div>
    </header>

    <Teleport to="body">
      <div v-if="showChrome && drawerOpen" class="tw-fixed tw-inset-0 tw-z-40 md:tw-hidden">
        <button
          type="button"
          class="tw-absolute tw-inset-0 tw-bg-ink/40"
          aria-label="Fechar menu"
          @click="drawerOpen = false"
        />
        <aside
          class="tw-absolute tw-left-0 tw-top-0 tw-flex tw-h-full tw-w-[min(100%,18rem)] tw-flex-col tw-bg-paper tw-shadow-card"
        >
          <div class="tw-border-b tw-border-salt tw-px-4 tw-py-4">
            <div class="tw-flex tw-items-center tw-gap-3">
              <UserAvatar :name="displayName" :image-url="profile?.avatar_url" size="lg" />
              <div class="tw-min-w-0">
                <p class="tw-m-0 tw-truncate tw-font-semibold">{{ displayName }}</p>
                <p class="tw-m-0 tw-truncate tw-text-xs tw-text-muted">{{ headerSubtitle }}</p>
              </div>
            </div>
          </div>

          <nav class="tw-flex-1 tw-overflow-y-auto tw-p-3">
            <RouterLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="tw-mb-1 tw-block tw-rounded-xl tw-px-4 tw-py-3 tw-text-sm tw-font-medium tw-text-ink tw-no-underline hover:tw-bg-salt"
              active-class="!tw-bg-teal !tw-text-paper"
              @click="drawerOpen = false"
            >
              {{ link.label }}
            </RouterLink>
          </nav>

          <div class="tw-border-t tw-border-salt tw-p-3">
            <button
              type="button"
              class="tw-w-full tw-rounded-xl tw-bg-danger/10 tw-py-3 tw-text-sm tw-font-semibold tw-text-danger"
              @click="onSignOut"
            >
              Sair
            </button>
          </div>
        </aside>
      </div>
    </Teleport>

    <main class="tw-flex-1" :class="showChrome ? '' : 'tw-min-h-dvh'">
      <RouterView />
    </main>

    <footer
      v-if="showChrome"
      class="tw-border-t tw-border-salt tw-py-4 tw-text-center tw-text-xs tw-text-muted"
    >
      Tandem · life balance
    </footer>
  </div>
</template>
