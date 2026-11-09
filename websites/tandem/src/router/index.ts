import { createRouter, createWebHistory } from 'vue-router'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'inicio', component: () => import('@/views/Inicio/Inicio.vue') },
    { path: '/entrar', name: 'entrar', component: () => import('@/views/Entrar/Entrar.vue'), meta: { guest: true } },
    { path: '/casa', name: 'casa', component: () => import('@/views/Casa/Casa.vue') },
    { path: '/perfil', name: 'perfil', component: () => import('@/views/Perfil/Perfil.vue') },
    { path: '/financas', name: 'financas', component: () => import('@/views/Financas/Financas.vue') },
    { path: '/alimentacao', name: 'alimentacao', component: () => import('@/views/Alimentacao/Alimentacao.vue') },
    { path: '/treino', name: 'treino', component: () => import('@/views/Treino/Treino.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to) => {
  if (!isSupabaseConfigured) return true

  const { data } = await supabase!.auth.getSession()
  const isLoggedIn = Boolean(data.session)

  if (to.meta.guest && isLoggedIn) return { path: '/' }
  if (to.path !== '/entrar' && !isLoggedIn) return { path: '/entrar', query: { redirect: to.fullPath } }

  return true
})
