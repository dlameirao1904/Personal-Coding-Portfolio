<template>
    <div class="tw-bg-gray-50 tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-py-12 tw-px-6 lg:tw-px-8">
        <v-card
            v-if="!isLoggedIn"
            elevation="0"
            class="tw-max-w-md tw-w-full tw-p-8 tw-rounded-[30px] tw-shadow-2xl tw-border tw-border-gray-100">
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
            class="tw-w-full tw-max-w-5xl">
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
                                :value="slugPasta"
                                label="Nome da Pasta (Automático)"
                                variant="filled"
                                disabled
                                prepend-inner-icon="mdi-folder-outline"
                                hint="Nome da pasta que será criada no sistema"
                                persistent-hint></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-textarea
                                v-model="eventoForm.descricao"
                                label="Descrição do Evento (Conteúdo do desc.txt)"
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
                                label="Fotografia de Capa (capa.jpg)"
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

            <div class="tw-mt-8 tw-bg-blue-50 tw-p-6 tw-rounded-2xl tw-border tw-border-blue-100 tw-flex tw-gap-4 tw-items-start">
                <v-icon color="blue">mdi-information-outline</v-icon>
                <p class="tw-text-sm tw-text-blue-800 tw-leading-relaxed">
                    <strong>Nota de Apresentação:</strong> Este formulário está preparado para ligar ao seu backend ou base de dados. Atualmente, ele simula o processo de validação de dados e upload
                    de imagens.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive, computed } from 'vue';

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
        capa: null as File | null,
        galeria: [] as File[],
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

    const submeterEvento = () => {
        if (!eventoForm.titulo || !eventoForm.descricao || !eventoForm.capa) {
            feedback.visivel = true;
            feedback.tipo = 'error';
            feedback.titulo = 'Erro de Validação';
            feedback.mensagem = 'Por favor, preencha o título, a descrição e selecione uma foto de capa.';
            return;
        }

        enviando.value = true;
        feedback.visivel = false;

        setTimeout(() => {
            enviando.value = false;
            feedback.visivel = true;
            feedback.tipo = 'success';
            feedback.titulo = 'Evento Criado com Sucesso!';
            feedback.mensagem = `A pasta /assets/eventos/${slugPasta.value} foi estruturada com os ficheiros capa.jpg e desc.txt.`;

            eventoForm.titulo = '';
            eventoForm.descricao = '';
            eventoForm.capa = null;
            eventoForm.galeria = [];
        }, 2000);
    };
</script>

<style scoped>
    :deep(.v-field) {
        border-radius: 16px !important;
    }
</style>
