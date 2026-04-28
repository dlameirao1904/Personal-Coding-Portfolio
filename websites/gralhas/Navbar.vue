<template>
    <nav class="tw-fixed tw-top-0 tw-left-0 tw-z-50 tw-w-full tw-h-20 md:tw-h-32 tw-bg-primary tw-flex tw-items-center tw-justify-between tw-px-2 md:tw-px-8 tw-shadow-sm">
        <div class="tw-flex-shrink-0">
            <v-img
                @click="router.push({ name: 'Home' })"
                class="tw-cursor-pointer"
                src="@/assets/images/letters_logo.png"
                :width="isMobile ? 120 : 180"
                aspect-ratio="1/1"
                contain />
        </div>

        <div class="tw-flex tw-items-center tw-justify-center tw-gap-0 md:tw-gap-4">
            <v-btn
                variant="text"
                class="tw-text-secondary"
                :to="{ name: 'About' }">
                <v-icon v-if="isMobile">mdi-information-outline</v-icon>
                <span
                    v-else
                    class="tw-text-lg"
                    >Sobre</span
                >
            </v-btn>

            <v-btn
                variant="text"
                class="tw-text-secondary"
                :to="{ name: 'Pitões' }">
                <v-icon v-if="isMobile">mdi-map-marker-outline</v-icon>
                <span
                    v-else
                    class="tw-text-lg"
                    >Pitões</span
                >
            </v-btn>

            <v-btn
                variant="text"
                class="tw-text-secondary"
                :to="{ name: 'Categories' }">
                <v-icon v-if="isMobile">mdi-cake-variant-outline</v-icon>
                <span
                    v-else
                    class="tw-text-lg"
                    >Categorias</span
                >
            </v-btn>

            <v-btn
                variant="text"
                class="tw-text-secondary"
                :to="{ name: 'Portfolio' }">
                <v-icon v-if="isMobile">mdi-camera-outline</v-icon>
                <span
                    v-else
                    class="tw-text-lg"
                    >Portefólio</span
                >
            </v-btn>
        </div>

        <div class="tw-flex-shrink-0">
            <v-btn
                :variant="isMobile ? 'text' : 'outlined'"
                class="tw-text-secondary"
                color="secondary"
                :to="{ name: 'Order' }">
                <v-icon v-if="isMobile">mdi-cart-outline</v-icon>
                <span
                    v-else
                    class="tw-text-lg"
                    >Encomendar</span
                >
            </v-btn>
        </div>
    </nav>

    <div class="tw-h-20 md:tw-h-32"></div>
</template>

<script lang="ts" setup>
    import { useRouter } from 'vue-router';
    import { useDisplay } from 'vuetify';
    import { computed } from 'vue';

    const router = useRouter();
    // xs para telemóveis pequenos, smAndDown para tablets e abaixo
    const { xs } = useDisplay();

    const isMobile = computed(() => xs.value);
</script>

<style scoped>
    /* Garante que os botões não fiquem demasiado largos em mobile */
    @media (max-width: 600px) {
        .v-btn {
            min-width: 40px !important;
            padding: 0 4px !important;
        }
    }
</style>
