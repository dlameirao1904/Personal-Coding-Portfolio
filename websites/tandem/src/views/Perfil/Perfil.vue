<script setup lang="ts">
import { ref, watch } from 'vue'
import AvatarPicker from '@/components/AvatarPicker.vue'
import { useAuth } from '@/composables/useAuth'
import { uploadProfileAvatar } from '@/lib/avatars'

const { user, profile, displayName, updateProfile } = useAuth()

const nameDraft = ref(profile.value?.display_name ?? '')
const saving = ref(false)
const message = ref<string | null>(null)
const error = ref<string | null>(null)

watch(
  profile,
  (p) => {
    if (p?.display_name != null) nameDraft.value = p.display_name
  },
  { immediate: true },
)

async function saveName() {
  saving.value = true
  message.value = null
  error.value = null
  try {
    await updateProfile({ display_name: nameDraft.value.trim() })
    message.value = 'Perfil atualizado.'
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erro ao guardar.'
  } finally {
    saving.value = false
  }
}

async function onAvatar(file: File) {
  if (!user.value) return
  saving.value = true
  message.value = null
  error.value = null
  try {
    const url = await uploadProfileAvatar(user.value.id, file)
    await updateProfile({ avatar_url: url })
    message.value = 'Foto de perfil atualizada.'
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erro no upload.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="tw-mx-auto tw-max-w-lg tw-space-y-6 tw-px-4 tw-py-10">
    <header>
      <h1 class="tw-m-0 tw-text-2xl tw-font-semibold">O teu perfil</h1>
      <p class="tw-mt-2 tw-mb-0 tw-text-sm tw-text-muted">Só tu vês e editas estes dados (exceto nome na casa).</p>
    </header>

    <section class="tw-space-y-4 tw-rounded-2xl tw-bg-white tw-p-5 tw-shadow-card">
      <AvatarPicker
        label="Foto de perfil"
        :name="displayName"
        :image-url="profile?.avatar_url ?? null"
        :disabled="saving"
        @pick="onAvatar"
      />

      <label class="tw-block tw-space-y-1 tw-text-sm">
        <span class="tw-font-medium">Nome a mostrar</span>
        <input v-model="nameDraft" type="text" class="tw-w-full tw-rounded-xl tw-border tw-border-salt tw-px-3 tw-py-2" />
      </label>

      <label class="tw-block tw-space-y-1 tw-text-sm">
        <span class="tw-font-medium">Email</span>
        <input
          type="email"
          disabled
          class="tw-w-full tw-rounded-xl tw-border tw-border-salt tw-bg-salt/40 tw-px-3 tw-py-2 tw-text-muted"
          :value="user?.email ?? ''"
        />
      </label>

      <button
        type="button"
        class="tw-rounded-xl tw-bg-teal tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-paper disabled:tw-opacity-60"
        :disabled="saving"
        @click="saveName"
      >
        Guardar
      </button>

      <p v-if="message" class="tw-m-0 tw-text-sm tw-text-teal">{{ message }}</p>
      <p v-if="error" class="tw-m-0 tw-text-sm tw-text-danger">{{ error }}</p>
    </section>
  </div>
</template>
