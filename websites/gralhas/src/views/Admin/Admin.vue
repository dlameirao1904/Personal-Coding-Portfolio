<template>
    <div class="tw-bg-gray-50 tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-py-12 tw-px-6 lg:tw-px-8">
        <v-card
            v-if="!isLoggedIn"
            elevation="0"
            class="rise-in tw-w-full tw-max-w-md tw-rounded-[30px] tw-border tw-border-gray-100 tw-p-8 tw-shadow-2xl">
            <div class="tw-text-center tw-mb-8">
                <v-icon
                    color="primary"
                    size="x-large"
                    class="tw-mb-4"
                    >mdi-shield-lock</v-icon
                >
                <h2 class="tw-text-3xl tw-font-bold tw-text-gray-900">Área Reservada</h2>
                <p class="tw-text-gray-500 tw-mt-2">Acesso exclusivo à direção da Associação.</p>
            </div>

            <v-form @submit.prevent="fazerLogin">
                <v-text-field
                    v-model="login.user"
                    label="Utilizador"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    color="primary"
                    class="tw-mb-4"></v-text-field>

                <v-text-field
                    v-model="login.pass"
                    label="Palavra-passe"
                    type="password"
                    prepend-inner-icon="mdi-lock"
                    variant="outlined"
                    color="primary"
                    class="tw-mb-6"></v-text-field>

                <v-alert
                    v-if="erroLogin"
                    type="error"
                    variant="tonal"
                    class="tw-mb-6 tw-rounded-xl">
                    Credenciais inválidas. Tente novamente.
                </v-alert>

                <v-btn
                    type="submit"
                    color="primary"
                    size="x-large"
                    block
                    class="tw-rounded-full tw-font-bold">
                    Entrar
                </v-btn>
            </v-form>
        </v-card>

        <div
            v-else
            class="rise-in tw-w-full tw-max-w-5xl">
            <div class="tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-start md:tw-items-center tw-mb-10 tw-gap-4">
                <div>
                    <h1 class="tw-text-3xl tw-font-bold tw-text-gray-900">Gestão de Eventos</h1>
                    <p class="tw-text-gray-600 tw-mt-1">Bem-vindo, Direção. Adicione novos momentos à história de Gralhas.</p>
                </div>
                <v-btn
                    color="error"
                    variant="tonal"
                    class="tw-rounded-full tw-px-6 tw-font-bold"
                    @click="isLoggedIn = false">
                    Terminar Sessão
                </v-btn>
            </div>

            <v-card
                elevation="0"
                class="tw-p-8 md:tw-p-12 tw-rounded-[40px] tw-shadow-xl tw-border tw-border-gray-100">
                <h2 class="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-8 tw-flex tw-items-center tw-gap-3">
                    <v-icon color="primary">mdi-plus-circle-outline</v-icon>
                    Criar Novo Evento
                </h2>

                <v-form @submit.prevent="submeterEvento">
                    <v-row>
                        <v-col
                            cols="12"
                            md="7">
                            <v-text-field
                                v-model="eventoForm.titulo"
                                label="Título do Evento"
                                placeholder="Ex: Magusto da Aldeia 2026"
                                variant="outlined"
                                color="primary"
                                required></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            md="5">
                            <v-text-field
                                :model-value="slugPasta"
                                label="Identificador"
                                variant="filled"
                                disabled
                                prepend-inner-icon="mdi-link-variant"
                                hint="Gerado a partir do título e usado no endereço das fotografias"
                                persistent-hint></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-textarea
                                v-model="eventoForm.descricao"
                                label="Descrição do Evento"
                                placeholder="Escreva aqui os detalhes do evento, história, etc..."
                                variant="outlined"
                                color="primary"
                                rows="5"
                                required></v-textarea>
                        </v-col>

                        <v-col
                            cols="12"
                            md="6">
                            <v-file-input
                                v-model="eventoForm.capa"
                                label="Fotografia de Capa"
                                variant="outlined"
                                color="primary"
                                prepend-icon=""
                                prepend-inner-icon="mdi-image-filter-hdr"
                                accept="image/*"
                                required
                                hint="Esta foto aparecerá no cartão principal"
                                persistent-hint></v-file-input>
                        </v-col>

                        <v-col
                            cols="12"
                            md="6">
                            <v-file-input
                                v-model="eventoForm.galeria"
                                label="Outras Fotos do Evento"
                                variant="outlined"
                                color="primary"
                                prepend-icon=""
                                prepend-inner-icon="mdi-camera-plus-outline"
                                accept="image/*"
                                multiple
                                hint="Pode selecionar várias fotos ao mesmo tempo"
                                persistent-hint></v-file-input>
                        </v-col>

                        <v-col
                            cols="12"
                            class="tw-mt-6">
                            <v-btn
                                type="submit"
                                color="primary"
                                size="x-large"
                                block
                                :loading="enviando"
                                class="tw-rounded-full tw-font-bold tw-h-16 tw-text-lg tw-shadow-lg tw-shadow-primary/20">
                                Publicar Evento
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>

                <v-alert
                    v-if="feedback.visivel"
                    :type="feedback.tipo"
                    variant="tonal"
                    class="tw-mt-8 tw-rounded-2xl"
                    closable>
                    <div class="tw-font-bold">{{ feedback.titulo }}</div>
                    <div>{{ feedback.mensagem }}</div>
                </v-alert>
            </v-card>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive, computed } from 'vue';
    import { criarEvento, ficheirosDe, mensagemDeErro } from '@/services/eventosService';

    // --- ESTADO DE LOGIN ---
    const isLoggedIn = ref<boolean>(false);
    const erroLogin = ref<boolean>(false);
    const login = reactive({ user: '', pass: '' });

    const ADMIN_USER = 'direcao';
    const ADMIN_PASS = 'gralhas2026';

    const fazerLogin = () => {
        if (login.user === ADMIN_USER && login.pass === ADMIN_PASS) {
            isLoggedIn.value = true;
            erroLogin.value = false;
        } else {
            erroLogin.value = true;
        }
    };

    const enviando = ref<boolean>(false);
    const eventoForm = reactive({
        titulo: '',
        descricao: '',
        capa: null as File | File[] | null,
        galeria: null as File | File[] | null,
    });

    const feedback = reactive({
        visivel: false,
        tipo: 'success' as 'success' | 'error',
        titulo: '',
        mensagem: '',
    });

    const slugPasta = computed(() => {
        if (!eventoForm.titulo) return '';
        return eventoForm.titulo
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    });

    const submeterEvento = async () => {
        const capa = ficheirosDe(eventoForm.capa)[0];
        const galeria = ficheirosDe(eventoForm.galeria);

        if (!eventoForm.titulo.trim() || !eventoForm.descricao.trim() || !capa || !slugPasta.value) {
            feedback.visivel = true;
            feedback.tipo = 'error';
            feedback.titulo = 'Erro de Validação';
            feedback.mensagem = 'Preenche o título, a descrição e escolhe uma fotografia de capa.';
            return;
        }

        enviando.value = true;
        feedback.visivel = false;

        try {
            await criarEvento({
                titulo: eventoForm.titulo,
                slug: slugPasta.value,
                descricao: eventoForm.descricao,
                capa,
                galeria,
            });

            feedback.visivel = true;
            feedback.tipo = 'success';
            feedback.titulo = 'Evento publicado';
            feedback.mensagem = 'O evento já está visível na página de eventos.';
            eventoForm.titulo = '';
            eventoForm.descricao = '';
            eventoForm.capa = null;
            eventoForm.galeria = null;
        } catch (error) {
            feedback.visivel = true;
            feedback.tipo = 'error';
            feedback.titulo = 'Não foi possível publicar';
            feedback.mensagem = mensagemDeErro(error);
        } finally {
            enviando.value = false;
        }
    };
</script>

<style scoped>
    :deep(.v-field) {
        border-radius: 16px !important;
    }
</style>
