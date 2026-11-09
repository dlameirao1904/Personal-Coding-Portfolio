import { computed, onMounted, onUnmounted, ref } from 'vue'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isPwaInstalled(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(display-mode: standalone)').matches) return true
  if (window.matchMedia('(display-mode: fullscreen)').matches) return true
  const nav = navigator as Navigator & { standalone?: boolean }
  return Boolean(nav.standalone)
}

function isIosSafari(): boolean {
  const ua = navigator.userAgent
  const isAppleMobile = /iPad|iPhone|iPod/.test(ua)
  const isIpadOs =
    navigator.platform === 'MacIntel' && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1
  return isAppleMobile || isIpadOs
}

export function usePwaInstall() {
  const canPromptInstall = ref(false)
  const iosInstallHint = ref(false)
  let deferredPrompt: BeforeInstallPromptEvent | null = null

  const showInstallBanner = computed(
    () => !isPwaInstalled() && (canPromptInstall.value || iosInstallHint.value),
  )

  function onBeforeInstallPrompt(event: Event) {
    event.preventDefault()
    deferredPrompt = event as BeforeInstallPromptEvent
    canPromptInstall.value = true
  }

  function onAppInstalled() {
    canPromptInstall.value = false
    iosInstallHint.value = false
    deferredPrompt = null
  }

  onMounted(() => {
    if (isPwaInstalled()) return

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)

    if (isIosSafari()) {
      iosInstallHint.value = true
    }
  })

  onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.removeEventListener('appinstalled', onAppInstalled)
  })

  async function installApp() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      canPromptInstall.value = false
    }
    deferredPrompt = null
  }

  return {
    canPromptInstall,
    iosInstallHint,
    showInstallBanner,
    installApp,
  }
}
