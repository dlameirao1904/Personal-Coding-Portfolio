<script setup lang="ts">
import { onMounted } from 'vue'
import AppShell from '@/components/AppShell.vue'
import { useAuth } from '@/composables/useAuth'

const { init } = useAuth()

onMounted(() => {
  void init()
})
</script>

<template>
  <AppShell />
</template>
