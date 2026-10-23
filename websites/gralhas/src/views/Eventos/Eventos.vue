<template>
    <div class="tw-min-h-screen tw-bg-gray-50">
        <section class="tw-bg-gray-900 tw-text-white tw-py-24 tw-rounded-b-[60px] tw-relative tw-overflow-hidden">
            <div
                class="tw-absolute tw-top-0 tw-right-0 tw-w-full tw-h-full tw-bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] tw-from-primary/20 tw-via-gray-900 tw-to-gray-900 tw-opacity-60"></div>

            <v-container class="rise-in tw-relative tw-z-10 tw-text-center">
                <h2 class="tw-text-primary tw-font-bold tw-text-sm tw-tracking-[0.2em] tw-uppercase tw-mb-4">Memórias Vivas</h2>
                <h1 class="tw-text-5xl md:tw-text-6xl tw-font-extrabold tw-tracking-tight tw-mb-6">Os Nossos <span class="tw-text-primary">Eventos</span></h1>
                <p class="tw-text-lg tw-text-gray-400 tw-max-w-2xl tw-mx-auto tw-leading-relaxed">
                    Reveja os momentos que unem a nossa comunidade. De festas tradicionais a encontros desportivos, celebramos Gralhas juntos.
                </p>
            </v-container>
        </section>

        <section class="tw--mt-12 tw-px-6 md:tw-px-16 tw-relative tw-z-20">
            <v-container>
                <div
                    v-if="carregando"
                    class="tw-flex tw-justify-center tw-py-20">
                    <v-progress-circular
                        indeterminate
                        color="primary"
                        size="52"></v-progress-circular>
                </div>

                <div
                    v-else-if="erroCarregar"
                    class="tw-mx-auto tw-max-w-xl tw-rounded-[30px] tw-bg-white tw-px-8 tw-py-14 tw-text-center tw-shadow-xl">
                    <h2 class="tw-text-2xl tw-font-bold tw-text-gray-900">Não foi possível carregar os eventos</h2>
                    <p class="tw-mt-3 tw-text-gray-600">{{ erroCarregar }}</p>
                </div>

                <v-row v-else-if="eventosLista.length">
                    <v-col
                        v-for="(evento, index) in eventosLista"
                        :key="evento.id"
                        cols="12"
                        md="6"
                        lg="4"
                        class="reveal"
                        :style="{ '--reveal-delay': `${index * 70}ms` }">
                        <v-card
                            class="lift tw-group tw-flex tw-h-full tw-cursor-pointer tw-flex-col tw-overflow-hidden tw-rounded-[30px] tw-border tw-border-gray-100 tw-shadow-xl hover:tw-shadow-2xl"
                            elevation="0"
                            @click="abrirEvento(evento)">
                            <div class="media-zoom tw-relative tw-h-64 tw-bg-gray-200">
                                <v-img
                                    v-if="evento.capa"
                                    :src="evento.capa"
                                    :alt="evento.titulo"
                                    class="tw-h-full tw-w-full"
                                    cover></v-img>
                            </div>

                            <div class="tw-p-8 tw-flex tw-flex-col tw-flex-grow">
                                <h3 class="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-3 group-hover:tw-text-primary tw-transition-colors">
                                    {{ evento.titulo }}
                                </h3>
                                <p class="tw-text-gray-600 tw-leading-relaxed tw-mb-6 tw-line-clamp-3 tw-whitespace-pre-line">
                                    {{ evento.descricao }}
                                </p>

                                <div class="tw-mt-auto tw-flex tw-items-center tw-text-primary tw-font-bold tw-gap-2 group-hover:tw-gap-4 tw-transition-all">
                                    <span>Ver Detalhes e Fotos</span>
                                    <v-icon size="small">mdi-arrow-right</v-icon>
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>

                <div
                    v-if="!carregando && !erroCarregar && eventosLista.length === 0"
                    class="tw-mx-auto tw-mt-8 tw-max-w-xl tw-rounded-[30px] tw-bg-white tw-px-8 tw-py-14 tw-text-center tw-shadow-xl">
                    <v-icon
                        color="primary"
                        size="42"
                        class="tw-mb-4"
                        >mdi-calendar-blank-outline</v-icon
                    >
                    <h2 class="tw-text-2xl tw-font-bold tw-text-gray-900">Ainda não há eventos publicados</h2>
                    <p class="tw-mt-3 tw-text-gray-600">Quando houver novas memórias da aldeia, aparecem aqui.</p>
                </div>
            </v-container>
        </section>

        <v-dialog
            v-model="dialogVisivel"
            max-w="900px">
            <v-card
                class="tw-rounded-[30px] tw-bg-white tw-overflow-hidden tw-max-h-[90vh] tw-flex tw-flex-col tw-relative"
                elevation="0">
                <v-btn
                    icon="mdi-close"
                    variant="flat"
                    color="white"
                    class="tw-absolute tw-top-4 tw-right-4 tw-z-50 tw-bg-black/20 hover:tw-bg-black/40 tw-backdrop-blur-sm"
                    @click="dialogVisivel = false"></v-btn>

                <div class="tw-overflow-y-auto tw-flex-grow">
                    <v-img
                        v-if="eventoSelecionado"
                        :src="eventoSelecionado.capa"
                        height="400"
                        cover
                        class="tw-relative">
                        <div class="tw-absolute tw-inset-0 tw-bg-gradient-to-t tw-from-black/90 tw-via-black/40 tw-to-transparent tw-flex tw-items-end tw-p-8 md:tw-p-12">
                            <h2 class="tw-text-4xl md:tw-text-5xl tw-font-bold tw-text-white tw-drop-shadow-lg">
                                {{ eventoSelecionado.titulo }}
                            </h2>
                        </div>
                    </v-img>

                    <div
                        v-if="eventoSelecionado"
                        class="tw-p-8 md:tw-p-12">
                        <p class="tw-text-lg tw-text-gray-700 tw-leading-relaxed tw-whitespace-pre-line tw-mb-10">
                            {{ eventoSelecionado.descricao }}
                        </p>

                        <div v-if="eventoSelecionado.fotos && eventoSelecionado.fotos.length > 0">
                            <h3 class="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-6 tw-flex tw-items-center tw-gap-3">
                                <v-icon color="primary">mdi-camera-burst</v-icon>
                                Galeria do Evento
                            </h3>

                            <v-row>
                                <v-col
                                    v-for="(foto, index) in eventoSelecionado.fotos"
                                    :key="index"
                                    cols="12"
                                    sm="6"
                                    md="4">
                                    <button
                                        type="button"
                                        class="thumb"
                                        @click="abrirFoto(index)">
                                        <v-img
                                            :src="foto"
                                            class="tw-rounded-2xl tw-shadow-md"
                                            height="200"
                                            cover
                                            :alt="`Fotografia ${index + 1} de ${eventoSelecionado.titulo}`">
                                            <template v-slot:placeholder>
                                                <div class="tw-flex tw-h-full tw-items-center tw-justify-center tw-bg-gray-100">
                                                    <v-progress-circular
                                                        indeterminate
                                                        color="primary"></v-progress-circular>
                                                </div>
                                            </template>
                                        </v-img>
                                    </button>
                                </v-col>
                            </v-row>
                        </div>
                    </div>
                </div>
            </v-card>
        </v-dialog>

        <Teleport to="body">
            <div
                v-if="fotoVisivel"
                class="lightbox"
                @click.self="fotoVisivel = false">
                <button
                    type="button"
                    class="lightbox-close"
                    aria-label="Fechar fotografia"
                    @click="fotoVisivel = false">
                    <v-icon color="white">mdi-close</v-icon>
                </button>

                <button
                    v-if="temMaisFotos"
                    type="button"
                    class="lightbox-nav lightbox-prev"
                    aria-label="Fotografia anterior"
                    @click="mudarFoto(-1)">
                    <v-icon color="white">mdi-chevron-left</v-icon>
                </button>

                <img
                    :key="fotoSelecionada"
                    :src="fotoSelecionada"
                    class="lightbox-photo"
                    alt="Fotografia do evento"
                    draggable="false"
                    @pointerdown="onSwipeStart"
                    @pointerup="onSwipeEnd" />

                <button
                    v-if="temMaisFotos"
                    type="button"
                    class="lightbox-nav lightbox-next"
                    aria-label="Fotografia seguinte"
                    @click="mudarFoto(1)">
                    <v-icon color="white">mdi-chevron-right</v-icon>
                </button>

                <p
                    v-if="temMaisFotos"
                    class="lightbox-count">
                    {{ fotoIndex + 1 }} / {{ eventoSelecionado?.fotos.length }}
                </p>
            </div>
        </Teleport>

        <Footer />
    </div>
</template>

<script setup lang="ts">
    import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
    import Footer from '../Layout/Footer.vue';
    import { useReveal } from '@/composables/useReveal';
    import { listarEventos, mensagemDeErro, type Evento } from '@/services/eventosService';

    const dialogVisivel = ref<boolean>(false);
    const eventoSelecionado = ref<Evento | null>(null);
    const eventosLista = ref<Evento[]>([]);
    const carregando = ref(true);
    const erroCarregar = ref('');

    const fotoVisivel = ref<boolean>(false);
    const fotoSelecionada = ref<string>('');
    const fotoIndex = ref(0);
    const temMaisFotos = computed(() => (eventoSelecionado.value?.fotos.length ?? 0) > 1);
    let swipeStartX = 0;

    const { refresh } = useReveal();

    const abrirFoto = (index: number) => {
        const fotos = eventoSelecionado.value?.fotos ?? [];
        if (!fotos[index]) return;
        fotoIndex.value = index;
        fotoSelecionada.value = fotos[index];
        fotoVisivel.value = true;
    };

    const mudarFoto = (direcao: number) => {
        const fotos = eventoSelecionado.value?.fotos ?? [];
        if (fotos.length < 2) return;
        fotoIndex.value = (fotoIndex.value + direcao + fotos.length) % fotos.length;
        fotoSelecionada.value = fotos[fotoIndex.value];
    };

    const onSwipeStart = (event: PointerEvent) => {
        swipeStartX = event.clientX;
    };

    const onSwipeEnd = (event: PointerEvent) => {
        const delta = event.clientX - swipeStartX;
        if (delta > 48) mudarFoto(-1);
        if (delta < -48) mudarFoto(1);
    };

    const onKeydown = (event: KeyboardEvent) => {
        if (!fotoVisivel.value) return;
        event.stopPropagation();
        if (event.key === 'Escape') {
            event.preventDefault();
            fotoVisivel.value = false;
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            mudarFoto(1);
        }
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            mudarFoto(-1);
        }
    };

    const carregarEventos = async () => {
        carregando.value = true;
        erroCarregar.value = '';

        try {
            eventosLista.value = await listarEventos();
        } catch (error) {
            erroCarregar.value = mensagemDeErro(error);
        } finally {
            carregando.value = false;
        }

        await nextTick();
        refresh();
    };

    watch(dialogVisivel, (aberto) => {
        if (!aberto) fotoVisivel.value = false;
    });

    onMounted(() => {
        carregarEventos();
        window.addEventListener('keydown', onKeydown, true);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', onKeydown, true);
    });

    const abrirEvento = (evento: Evento) => {
        eventoSelecionado.value = evento;
        dialogVisivel.value = true;
    };
</script>

<style scoped>
    .tw-line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .tw-whitespace-pre-line {
        white-space: pre-line;
    }

    .thumb {
        display: block;
        width: 100%;
        overflow: hidden;
        border-radius: 1rem;
        cursor: zoom-in;
    }

    .thumb :deep(.v-img) {
        transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .lightbox {
        position: fixed;
        z-index: 4000;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.92);
        animation: lightbox-in 0.22s ease;
    }

    .lightbox-photo {
        width: min(92vw, 1400px);
        height: 82vh;
        object-fit: contain;
        animation: lightbox-in 0.28s ease;
        touch-action: pan-y;
    }

    .lightbox-close,
    .lightbox-nav {
        position: absolute;
        display: grid;
        place-items: center;
        width: 48px;
        height: 48px;
        border: 0;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.16);
        cursor: pointer;
    }

    .lightbox-close {
        top: 1rem;
        right: 1rem;
    }

    .lightbox-prev {
        left: 1rem;
    }

    .lightbox-next {
        right: 1rem;
    }

    .lightbox-count {
        position: absolute;
        bottom: 1.25rem;
        margin: 0;
        color: white;
        font-weight: 700;
        letter-spacing: 0.08em;
    }

    @keyframes lightbox-in {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    @media (hover: hover) and (prefers-reduced-motion: no-preference) {
        .thumb:hover :deep(.v-img) {
            transform: scale(1.04);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .lightbox,
        .lightbox-photo,
        .thumb :deep(.v-img) {
            animation: none;
            transition: none;
        }
    }
</style>
