<script lang="ts" setup>
import PageHeading from '@/components/PageHeading.vue'
import { computed, ref, watch } from 'vue'

const deliveryMethod = ref<'padaria' | 'rota'>('padaria')
const name = ref('')
const phone = ref('')
const village = ref('')
const items = ref('')
const when = ref('')

const tried = ref(false)
const loading = ref(false)
const success = ref(false)

const missing = computed(() => {
  if (!tried.value) return false
  const baseMissing = !name.value.trim() || !phone.value.trim() || !items.value.trim()
  const routeMissing = deliveryMethod.value === 'rota' && !village.value.trim()
  return baseMissing || routeMissing
})

async function submit() {
  tried.value = true
  success.value = false
  
  if (missing.value) return

  // Inicia o estado de carregamento
  loading.value = true

  try {
    // Aqui entraria a tua chamada real à API, ex:
    // await fetch('/api/encomendas', { method: 'POST', body: JSON.stringify({...}) })
    
    // Simulação do tempo de resposta do servidor (1.5 segundos)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Sucesso!
    success.value = true
    
    // Opcional: Limpar o formulário após envio
    // name.value = ''
    // phone.value = ''
    // village.value = ''
    // items.value = ''
    // when.value = ''
    // tried.value = false
    
  } catch (error) {
    console.error('Erro ao enviar o pedido:', error)
    // Aqui podes tratar o erro, mostrando uma mensagem ao utilizador
  } finally {
    loading.value = false
  }
}

// Limpa a mensagem de sucesso se o utilizador começar a escrever um novo pedido
watch([deliveryMethod, name, phone, village, items, when], () => {
  if (success.value) success.value = false
})
</script>

<template>
  <div class="tw-pb-24">
    <PageHeading
      eyebrow="Encomendas"
      lede="Diz-nos o que precisas e onde queres receber. Nós recebemos o teu pedido e ligamos de volta para confirmar tudo.">
      Faz o teu <span class="tw-italic tw-text-rye">pedido.</span>
    </PageHeading>

    <form class="tw-mx-auto tw-mt-12 tw-grid tw-max-w-xl tw-gap-6 tw-px-5 md:tw-px-8" @submit.prevent="submit">
      
      <!-- Seletor de Método de Entrega -->
      <div class="tw-flex tw-rounded-full tw-bg-paper tw-p-1.5 tw-border tw-border-ink/10">
        <button
          type="button"
          class="tw-flex-1 tw-rounded-full tw-py-2.5 tw-text-sm tw-font-medium tw-transition-colors"
          :class="deliveryMethod === 'padaria' ? 'tw-bg-ink tw-text-flour tw-shadow-sm' : 'tw-text-ink/60 hover:tw-text-ink'"
          @click="deliveryMethod = 'padaria'">
          Na Padaria
        </button>
        <button
          type="button"
          class="tw-flex-1 tw-rounded-full tw-py-2.5 tw-text-sm tw-font-medium tw-transition-colors"
          :class="deliveryMethod === 'rota' ? 'tw-bg-ink tw-text-flour tw-shadow-sm' : 'tw-text-ink/60 hover:tw-text-ink'"
          @click="deliveryMethod = 'rota'">
          Na Rota
        </button>
      </div>

      <div class="tw-grid tw-gap-5 sm:tw-grid-cols-2">
        <label class="tw-block">
          <span class="tw-text-xs tw-uppercase tw-tracking-[0.18em] tw-text-ink/50">Nome</span>
          <input v-model="name" name="nome" autocomplete="name" :disabled="loading" class="tw-mt-2 tw-w-full tw-rounded-2xl tw-border tw-border-ink/15 tw-bg-white tw-px-4 tw-py-3 tw-text-sm tw-outline-none focus:tw-border-rye focus:tw-ring-1 focus:tw-ring-rye tw-transition-all disabled:tw-opacity-50" />
        </label>
        <label class="tw-block">
          <span class="tw-text-xs tw-uppercase tw-tracking-[0.18em] tw-text-ink/50">Telefone</span>
          <input v-model="phone" name="telefone" type="tel" autocomplete="tel" :disabled="loading" class="tw-mt-2 tw-w-full tw-rounded-2xl tw-border tw-border-ink/15 tw-bg-white tw-px-4 tw-py-3 tw-text-sm tw-outline-none focus:tw-border-rye focus:tw-ring-1 focus:tw-ring-rye tw-transition-all disabled:tw-opacity-50" />
        </label>
      </div>

      <!-- Campo condicional: Localidade -->
      <transition name="slide-down">
        <label v-if="deliveryMethod === 'rota'" class="tw-block">
          <span class="tw-text-xs tw-uppercase tw-tracking-[0.18em] tw-text-ink/50">Localidade (Aldeia)</span>
          <input v-model="village" name="localidade" :disabled="loading" class="tw-mt-2 tw-w-full tw-rounded-2xl tw-border tw-border-ink/15 tw-bg-white tw-px-4 tw-py-3 tw-text-sm tw-outline-none focus:tw-border-rye focus:tw-ring-1 focus:tw-ring-rye tw-transition-all disabled:tw-opacity-50" placeholder="Ex: Salto, Montalegre..." />
        </label>
      </transition>

      <label class="tw-block">
        <span class="tw-text-xs tw-uppercase tw-tracking-[0.18em] tw-text-ink/50">O que levas</span>
        <textarea v-model="items" name="pedido" rows="4" :disabled="loading" class="tw-mt-2 tw-w-full tw-resize-y tw-rounded-2xl tw-border tw-border-ink/15 tw-bg-white tw-px-4 tw-py-3 tw-text-sm tw-outline-none focus:tw-border-rye focus:tw-ring-1 focus:tw-ring-rye tw-transition-all disabled:tw-opacity-50" placeholder="Ex: 2 Broas e 4 cacetes..." />
      </label>

      <label class="tw-block">
        <span class="tw-text-xs tw-uppercase tw-tracking-[0.18em] tw-text-ink/50">Para quando</span>
        <input v-model="when" name="quando" :disabled="loading" class="tw-mt-2 tw-w-full tw-rounded-2xl tw-border tw-border-ink/15 tw-bg-white tw-px-4 tw-py-3 tw-text-sm tw-outline-none focus:tw-border-rye focus:tw-ring-1 focus:tw-ring-rye tw-transition-all disabled:tw-opacity-50" :placeholder="deliveryMethod === 'rota' ? 'Ex: Terça-feira, com o Ramos' : 'Ex: Amanhã de manhã'" />
      </label>

      <p v-if="missing" class="tw-text-sm tw-text-rye">Por favor, preenche os campos obrigatórios em falta.</p>
      
      <button 
        type="submit" 
        :disabled="loading || success"
        class="tw-mt-2 tw-inline-flex tw-w-full tw-justify-center tw-items-center tw-gap-3 tw-rounded-full tw-bg-ink tw-px-5 tw-py-4 tw-text-sm tw-font-medium tw-text-flour hover:tw-bg-rye tw-transition-colors sm:tw-w-fit disabled:tw-opacity-70 disabled:tw-cursor-not-allowed">
        
        <!-- Ícone de loading a girar -->
        <svg v-if="loading" class="tw-w-5 tw-h-5 tw-animate-spin tw-text-flour" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="tw-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="tw-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>

        <span v-if="loading">A enviar pedido...</span>
        <span v-else-if="success">Enviado!</span>
        <span v-else>Enviar Encomenda</span>
      </button>
    </form>

    <!-- Feedback de Sucesso -->
    <transition name="fade-slide">
      <section v-if="success" class="tw-mx-auto tw-mt-12 tw-max-w-xl tw-px-5 md:tw-px-8" id="sucesso">
        <div class="tw-rounded-[2rem] tw-bg-paper tw-p-8 tw-border tw-border-green-800/10 tw-shadow-sm tw-text-center">
          <div class="tw-mx-auto tw-flex tw-h-16 tw-w-16 tw-items-center tw-justify-center tw-rounded-full tw-bg-green-100 tw-text-green-800 tw-mb-6">
            <svg class="tw-w-8 tw-h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="tw-font-serif tw-text-3xl tw-text-ink">Pedido a caminho!</h3>
          <p class="tw-mt-4 tw-text-base tw-leading-relaxed tw-text-ink/70">
            Obrigado, <span class="tw-font-medium">{{ name }}</span>. Recebemos o teu pedido com sucesso. 
            Vamos ligar-te em breve para o <span class="tw-font-medium">{{ phone }}</span> para confirmar os detalhes finais.
          </p>
        </div>
      </section>
    </transition>
  </div>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 100px;
  opacity: 1;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0 !important;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>