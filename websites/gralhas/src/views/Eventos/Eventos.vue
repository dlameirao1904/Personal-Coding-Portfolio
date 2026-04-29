<template>
    <div class="tw-bg-gray-50 tw-min-h-screen tw-pb-24">
        <section class="tw-bg-gray-900 tw-text-white tw-py-24 tw-rounded-b-[60px] tw-relative tw-overflow-hidden">
            <div
                class="tw-absolute tw-top-0 tw-right-0 tw-w-full tw-h-full tw-bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] tw-from-primary/20 tw-via-gray-900 tw-to-gray-900 tw-opacity-60"></div>

            <v-container class="tw-relative tw-z-10 tw-text-center">
                <h2 class="tw-text-primary tw-font-bold tw-text-sm tw-tracking-[0.2em] tw-uppercase tw-mb-4">Memórias Vivas</h2>
                <h1 class="tw-text-5xl md:tw-text-6xl tw-font-extrabold tw-tracking-tight tw-mb-6">Os Nossos <span class="tw-text-primary">Eventos</span></h1>
                <p class="tw-text-lg tw-text-gray-400 tw-max-w-2xl tw-mx-auto tw-leading-relaxed">
                    Reveja os momentos que unem a nossa comunidade. De festas tradicionais a encontros desportivos, celebramos Gralhas juntos.
                </p>
            </v-container>
        </section>

        <section class="tw--mt-12 tw-px-6 md:tw-px-16 tw-relative tw-z-20">
            <v-container>
                <v-row>
                    <v-col
                        v-for="evento in eventosLista"
                        :key="evento.id"
                        cols="12"
                        md="6"
                        lg="4">
                        <v-card
                            class="tw-group tw-h-full tw-rounded-[30px] tw-shadow-xl hover:tw-shadow-2xl hover:tw--translate-y-2 tw-transition-all tw-duration-300 tw-border tw-border-gray-100 tw-overflow-hidden tw-cursor-pointer tw-flex tw-flex-col"
                            elevation="0"
                            @click="abrirEvento(evento)">
                            <div class="tw-h-64 tw-overflow-hidden tw-relative">
                                <v-img
                                    :src="evento.capa"
                                    :alt="evento.titulo"
                                    class="tw-w-full tw-h-full tw-transform group-hover:tw-scale-110 tw-transition-transform tw-duration-700 tw-object-cover"
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
                                    <v-img
                                        :src="foto"
                                        class="tw-rounded-2xl tw-shadow-md hover:tw-shadow-xl hover:tw-scale-[1.02] tw-transition-all tw-duration-300"
                                        height="200"
                                        cover
                                        @click="abrirFoto(foto)">
                                        <template v-slot:placeholder>
                                            <div class="tw-flex tw-items-center tw-justify-center tw-h-full tw-bg-gray-100">
                                                <v-progress-circular
                                                    indeterminate
                                                    color="primary"></v-progress-circular>
                                            </div>
                                        </template>
                                    </v-img>
                                </v-col>
                            </v-row>
                            <v-overlay
                                v-model="fotoVisivel"
                                class="align-center justify-center"
                                scrim="black"
                                opacity="0.95"
                                z-index="3000"
                                @click:outside="fotoVisivel = false">
                                <div class="tw-relative tw-w-screen tw-h-screen tw-flex tw-items-center tw-justify-center">
                                    <v-btn
                                        icon="mdi-close"
                                        variant="flat"
                                        color="white"
                                        size="large"
                                        class="tw-absolute tw-top-4 tw-right-4 tw-z-50 tw-bg-black/30 hover:tw-bg-black/60 tw-backdrop-blur-sm"
                                        @click="fotoVisivel = false"></v-btn>

                                    <img
                                        :src="fotoSelecionada"
                                        class="tw-w-[95vw] tw-h-[85vh] tw-object-contain tw-transition-all tw-duration-300"
                                        alt="Foto em tamanho gigante" />
                                </div>
                            </v-overlay>
                        </div>
                    </div>
                </div>
            </v-card>
        </v-dialog>
    </div>
    <Footer />
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import Footer from '../Layout/Footer.vue';

    interface Evento {
        id: string;
        titulo: string;
        capa: string;
        descricao: string;
        fotos: string[];
    }

    const dialogVisivel = ref<boolean>(false);
    const eventoSelecionado = ref<Evento | null>(null);
    const eventosLista = ref<Evento[]>([]);

    const capasFiles = import.meta.glob('@/assets/eventos/*/capa.jpg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
    const descricoesFiles = import.meta.glob('@/assets/eventos/*/desc.txt', { eager: true, as: 'raw' }) as Record<string, string>;
    const todasFotosFiles = import.meta.glob('@/assets/eventos/*/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

    const fotoVisivel = ref<boolean>(false);
    const fotoSelecionada = ref<string>('');

    const abrirFoto = (foto: string) => {
        fotoSelecionada.value = foto;
        fotoVisivel.value = true;
    };

    const carregarEventos = () => {
        const eventosTemp: Evento[] = [];

        for (const path in capasFiles) {
            const regex = /eventos\/([^/]+)\/capa\.jpg$/i;
            const match = path.match(regex);

            if (match) {
                const nomePasta = match[1];

                const tituloFormatado = nomePasta
                    .split('-')
                    .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
                    .join(' ');

                const descPath = Object.keys(descricoesFiles).find((p) => p.includes(`eventos/${nomePasta}/desc.txt`));
                const descricaoTexto = descPath ? descricoesFiles[descPath] : 'Descrição não disponível.';

                const fotosDaPasta = Object.keys(todasFotosFiles)
                    .filter((p) => p.includes(`eventos/${nomePasta}/`) && !p.toLowerCase().endsWith('capa.jpg'))
                    .map((p) => todasFotosFiles[p]);

                eventosTemp.push({
                    id: nomePasta,
                    titulo: tituloFormatado,
                    capa: capasFiles[path],
                    descricao: descricaoTexto,
                    fotos: fotosDaPasta,
                });
            }
        }

        eventosLista.value = eventosTemp;
    };

    onMounted(() => {
        carregarEventos();
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
</style>
