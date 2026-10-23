import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import Portfolio from '@/views/Portfolio/Portfolio.vue'
import Homepage from '@/views/Homepage/Homepage.vue'

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '',
        name: 'Portfolio',
        component: Portfolio,
      },
      {
        path: 'jornada',
        name: 'Jornada',
        component: Homepage,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router
