<template>
    <Navbar />
    <v-main class="tw-bg-white">
        <router-view v-slot="{ Component }">
            <transition
                name="route-fade"
                mode="out-in">
                <component
                    :is="Component"
                    :key="route.path" />
            </transition>
        </router-view>
    </v-main>
</template>

<script setup lang="ts">
    import { useRoute } from 'vue-router';
    import Navbar from './Layout/Navbar.vue';

    const route = useRoute();
</script>

<style>
    .route-fade-enter-active,
    .route-fade-leave-active {
        transition: opacity 0.28s ease;
    }

    .route-fade-enter-from,
    .route-fade-leave-to {
        opacity: 0;
    }

    @media (prefers-reduced-motion: reduce) {
        .route-fade-enter-active,
        .route-fade-leave-active {
            transition: none;
        }
    }
</style>


