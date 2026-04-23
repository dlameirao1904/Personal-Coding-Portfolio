import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import Homepage from '@/views/Homepage/Homepage.vue'

import About from '@/views/About/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: { name: 'Homepage' },
    component: Home,
    children: [
      {
        path: '/',
        name: 'Homepage',
        component: Homepage,
      },
      {
        path: 'about',
        name: 'About',
        component: About,
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
