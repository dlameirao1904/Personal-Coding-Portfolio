<template>
    <Navbar />
    <v-main class="tw-bg-white">
        <Suspense>
            <router-view />
        </Suspense>
    </v-main>
</template>

<script setup lang="ts">
    import Navbar from './Layout/Navbar.vue';
</script>


