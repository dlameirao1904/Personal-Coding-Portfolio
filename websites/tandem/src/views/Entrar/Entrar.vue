<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { usePwaInstall } from '@/composables/usePwaInstall'

const route = useRoute()
const router = useRouter()
const { signInWithPassword, signUp, isSupabaseConfigured, authError } = useAuth()
const {
  canPromptInstall,
  iosInstallHint,
  iosInstallGuide,
  copiedLink,
  showInstallBanner,
  installApp,
  copyPageLink,
} = usePwaInstall()

const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const displayName = ref('')
const loading = ref(false)
const message = ref<string | null>(null)

async function submit() {
  loading.value = true
  message.value = null
  try {
    const ok =
      mode.value === 'login'
        ? await signInWithPassword(email.value.trim(), password.value)
        : await signUp(email.value.trim(), password.value, displayName.value.trim())

    if (ok) {
      if (mode.value === 'register') {
        message.value = 'Conta criada. Confirma o email se o projeto Supabase tiver confirmação ativa.'
      }
      const redirect =
        typeof route.query.redirect === 'string' &&
        route.query.redirect.startsWith('/') &&
        !route.query.redirect.startsWith('//')
          ? route.query.redirect
          : '/'
      await router.push(redirect)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="tw-flex tw-min-h-dvh tw-flex-col tw-bg-ink">
    <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-6 tw-pt-12 tw-pb-8">
      <img
        src="/tandem-logo.png"
        alt="Tandem"
        class="tw-w-full tw-max-w-xs tw-select-none"
        width="320"
        height="320"
      />
      <p class="tw-m-0 tw-mt-4 tw-text-center tw-text-sm tw-text-white/70">
        Finanças em conjunto. Alimentação e treino só contigo.
      </p>
    </div>

    <div class="tw-flex-1 tw-rounded-t-3xl tw-bg-paper tw-px-4 tw-py-8">
      <div class="tw-mx-auto tw-max-w-md">
        <h1 class="tw-m-0 tw-text-xl tw-font-semibold">{{ mode === 'login' ? 'Entrar' : 'Criar conta' }}</h1>

        <section
          v-if="showInstallBanner"
          class="tw-mt-4 tw-rounded-2xl tw-border tw-border-teal/25 tw-bg-teal/10 tw-p-4 tw-text-sm"
          aria-label="Instalar aplicação"
        >
          <div class="tw-flex tw-flex-col tw-gap-3 sm:tw-flex-row sm:tw-items-start sm:tw-justify-between">
            <div class="tw-min-w-0">
              <p class="tw-m-0 tw-font-semibold tw-text-ink">Instala o Tandem</p>
              <p v-if="canPromptInstall" class="tw-m-0 tw-mt-0.5 tw-text-muted">
                Abre como app — mais rápido no telemóvel.
              </p>
              <template v-else-if="iosInstallHint && iosInstallGuide === 'chrome'">
                <p class="tw-m-0 tw-mt-1 tw-text-muted">
                  No <strong class="tw-font-medium tw-text-ink">Chrome</strong> o menu Partilhar
                  <em>não</em> mostra «Adicionar ao Ecrã Principal». Usa uma destas:
                </p>
                <ol class="tw-m-0 tw-mt-2 tw-list-decimal tw-space-y-1 tw-pl-4 tw-text-muted">
                  <li>
                    Ícone <strong class="tw-font-medium tw-text-ink">⋯</strong> (canto inferior) →
                    <strong class="tw-font-medium tw-text-ink">Adicionar ao Ecrã Principal</strong>.
                  </li>
                  <li>
                    Ou copia o link, abre o <strong class="tw-font-medium tw-text-ink">Safari</strong>,
                    cola o URL, Partilhar
                    <span class="tw-whitespace-nowrap">(□↑)</span> → desliza →
                    <strong class="tw-font-medium tw-text-ink">Adicionar ao Ecrã Principal</strong>.
                  </li>
                </ol>
              </template>
              <template v-else-if="iosInstallHint">
                <p class="tw-m-0 tw-mt-1 tw-text-muted">
                  No <strong class="tw-font-medium tw-text-ink">Safari</strong>: toca Partilhar
                  <span class="tw-whitespace-nowrap">(□↑)</span>, desliza a lista e escolhe
                  <strong class="tw-font-medium tw-text-ink">Adicionar ao Ecrã Principal</strong>.
                  Se não aparecer: <strong class="tw-font-medium tw-text-ink">Editar ações</strong> e
                  ativa essa opção.
                </p>
              </template>
            </div>
            <div class="tw-flex tw-shrink-0 tw-flex-col tw-gap-2">
              <button
                v-if="canPromptInstall"
                type="button"
                class="tw-rounded-xl tw-bg-teal tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-paper"
                @click="installApp"
              >
                Instalar
              </button>
              <button
                v-else-if="iosInstallHint && iosInstallGuide === 'chrome'"
                type="button"
                class="tw-rounded-xl tw-border tw-border-teal/40 tw-bg-white tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-teal"
                @click="copyPageLink"
              >
                {{ copiedLink ? 'Link copiado' : 'Copiar link' }}
              </button>
            </div>
          </div>
        </section>

        <article
          v-if="!isSupabaseConfigured"
          class="tw-mt-6 tw-rounded-2xl tw-border tw-border-amber/50 tw-bg-amber/10 tw-p-4 tw-text-sm"
        >
          Falta configurar o Supabase no <code class="tw-font-mono">.env</code>.
        </article>

        <form v-else class="tw-mt-6 tw-space-y-4" @submit.prevent="submit">
          <div class="tw-flex tw-gap-2">
            <button
              type="button"
              class="tw-flex-1 tw-rounded-lg tw-py-2 tw-text-sm"
              :class="mode === 'login' ? 'tw-bg-teal tw-text-paper' : 'tw-bg-salt'"
              @click="mode = 'login'"
            >
              Login
            </button>
            <button
              type="button"
              class="tw-flex-1 tw-rounded-lg tw-py-2 tw-text-sm"
              :class="mode === 'register' ? 'tw-bg-teal tw-text-paper' : 'tw-bg-salt'"
              @click="mode = 'register'"
            >
              Registar
            </button>
          </div>

          <label v-if="mode === 'register'" class="tw-block tw-space-y-1 tw-text-sm">
            <span class="tw-font-medium">Nome</span>
            <input
              v-model="displayName"
              type="text"
              required
              class="tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2"
            />
          </label>

          <label class="tw-block tw-space-y-1 tw-text-sm">
            <span class="tw-font-medium">Email</span>
            <input
              v-model="email"
              type="email"
              required
              class="tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2"
            />
          </label>

          <label class="tw-block tw-space-y-1 tw-text-sm">
            <span class="tw-font-medium">Palavra-passe</span>
            <input
              v-model="password"
              type="password"
              required
              minlength="6"
              class="tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2"
            />
          </label>

          <button
            type="submit"
            class="tw-w-full tw-rounded-xl tw-bg-teal tw-py-2.5 tw-text-sm tw-font-semibold tw-text-paper disabled:tw-opacity-60"
            :disabled="loading"
          >
            {{ loading ? 'A aguardar…' : mode === 'login' ? 'Entrar' : 'Criar conta' }}
          </button>

          <p v-if="authError" class="tw-m-0 tw-text-sm tw-text-danger">{{ authError }}</p>
          <p v-if="message" class="tw-m-0 tw-text-sm tw-text-teal">{{ message }}</p>
        </form>
      </div>
    </div>
  </div>
</template>
