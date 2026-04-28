import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

import Home from '@/views/Home.vue';
import Homepage from '@/views/Homepage/Homepage.vue';
import Associacao from '@/views/Associaçao/Associacao.vue';
import Acoes from '@/views/Acoes/Acoes.vue';
import Eventos from '@/views/Eventos/Eventos.vue';
import Contactos from '@/views/Contactos/Contactos.vue';
import Agir from '@/views/Agir/Agir.vue';
import Admin from '@/views/Admin/Admin.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        redirect: { name: 'Homepage' },
        component: Home,
        children: [
            {
                path: '',
                name: 'Homepage',
                component: Homepage,
            },
            {
                path: 'associacao',
                name: 'Associacao',
                component: Associacao,
            },
            {
                path: 'eventos',
                name: 'Eventos',
                component: Eventos,
            },
            {
                path: 'acoes',
                name: 'Acoes',
                component: Acoes,
            },
            {
                path: 'contactar',
                name: 'Contactar',
                component: Contactos,
            },
            {
                path: 'agir',
                name: 'Agir',
                component: Agir,
            },
            {
                path: 'admin_gralhas',
                name: 'Admin',
                component: Admin,
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    },
});

export default router;
