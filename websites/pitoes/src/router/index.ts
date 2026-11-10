import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, _from, saved) {
    if (typeof to.query.forno === 'string') return { el: '#forno', top: 0 }
    if (to.hash) return { el: to.hash, top: 96 }
    if (saved) return saved
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Homepage/Homepage.vue'),
      meta: { title: 'Padaria Pitões' },
    },
    {
      path: '/produtos',
      name: 'produtos',
      component: () => import('@/views/Produtos/Produtos.vue'),
      meta: { title: 'Produtos' },
    },
    {
      path: '/equipa',
      name: 'equipa',
      component: () => import('@/views/Equipa/Equipa.vue'),
      meta: { title: 'Equipa' },
    },
    {
      path: '/rotas',
      name: 'rotas',
      component: () => import('@/views/Rotas/Rotas.vue'),
      meta: { title: 'Rotas' },
    },
    {
      path: '/encomendas',
      name: 'encomendas',
      component: () => import('@/views/Encomendas/Encomendas.vue'),
      meta: { title: 'Encomendas' },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.afterEach((to) => {
  const title = typeof to.meta.title === 'string' ? to.meta.title : 'Padaria Pitões'
  document.title = title === 'Padaria Pitões' ? 'Padaria Pitões · Família Marinho' : `${title} · Padaria Pitões`
})
