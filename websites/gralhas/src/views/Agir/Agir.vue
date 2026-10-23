<template>
    <div class="tw-min-h-screen tw-bg-gray-50">
        <section class="tw-bg-gray-900 tw-text-white tw-py-20 tw-rounded-b-[60px] tw-relative tw-overflow-hidden">
            <div
                class="tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full tw-bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] tw-from-primary/30 tw-via-gray-900 tw-to-gray-900 tw-opacity-80"></div>

            <v-container class="rise-in tw-relative tw-z-10 tw-text-center">
                <h2 class="tw-text-primary tw-font-bold tw-text-sm tw-tracking-[0.2em] tw-uppercase tw-mb-4">Faça a Diferença</h2>
                <h1 class="tw-text-5xl md:tw-text-6xl tw-font-extrabold tw-tracking-tight tw-mb-6">
                    O Futuro de Gralhas <br class="tw-hidden md:tw-block" />
                    <span class="tw-text-primary">Começa Consigo</span>
                </h1>
                <p class="tw-text-lg tw-text-gray-400 tw-max-w-2xl tw-mx-auto tw-leading-relaxed">
                    A nossa associação vive do apoio e da energia da nossa comunidade. Escolha como quer ajudar a manter vivas as nossas raízes e a dinamizar a nossa aldeia.
                </p>
            </v-container>
        </section>

        <section class="tw--mt-12 tw-px-6 md:tw-px-16 tw-relative tw-z-20">
            <v-container>
                <v-row class="tw-gap-y-12">
                    <v-col
                        cols="12"
                        md="7"
                        class="reveal">
                        <v-card
                            elevation="0"
                            class="tw-h-full tw-p-8 md:tw-p-12 tw-rounded-[40px] tw-shadow-xl tw-border tw-border-gray-100">
                            <div class="tw-flex tw-items-center tw-gap-4 tw-mb-8">
                                <div class="tw-w-16 tw-h-16 tw-bg-primary/10 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                                    <v-icon
                                        size="32"
                                        color="primary"
                                        >mdi-account-heart-outline</v-icon
                                    >
                                </div>
                                <div>
                                    <h3 class="tw-text-3xl tw-font-bold tw-text-gray-900">Tornar-me Sócio</h3>
                                    <p class="tw-text-primary tw-font-bold">Quota Anual: 20€ <span class="tw-text-gray-500 tw-font-normal tw-text-sm">(Apenas 1.70€ por mês)</span></p>
                                </div>
                            </div>

                            <p class="tw-text-gray-600 tw-leading-relaxed tw-mb-8">
                                Ao tornar-se sócio da A.R.D.S.C.G, passa a ter voz ativa nas decisões da aldeia, descontos nos nossos eventos e o orgulho de contribuir para o desenvolvimento de
                                Gralhas. Preencha o formulário e entraremos em contacto para finalizar a inscrição.
                            </p>

                            <v-form @submit.prevent="submeterSocio">
                                <v-row>
                                    <v-col
                                        cols="12"
                                        md="6">
                                        <v-text-field
                                            v-model="formSocio.nome"
                                            label="Nome Completo"
                                            variant="outlined"
                                            color="primary"
                                            hide-details="auto"
                                            class="tw-mb-4"
                                            required></v-text-field>
                                    </v-col>
                                    <v-col
                                        cols="12"
                                        md="6">
                                        <v-text-field
                                            v-model="formSocio.nif"
                                            label="NIF"
                                            variant="outlined"
                                            color="primary"
                                            hide-details="auto"
                                            class="tw-mb-4"
                                            required></v-text-field>
                                    </v-col>
                                    <v-col
                                        cols="12"
                                        md="6">
                                        <v-text-field
                                            v-model="formSocio.email"
                                            label="E-mail"
                                            type="email"
                                            variant="outlined"
                                            color="primary"
                                            hide-details="auto"
                                            class="tw-mb-4"
                                            required></v-text-field>
                                    </v-col>
                                    <v-col
                                        cols="12"
                                        md="6">
                                        <v-text-field
                                            v-model="formSocio.telefone"
                                            label="Telemóvel"
                                            variant="outlined"
                                            color="primary"
                                            hide-details="auto"
                                            class="tw-mb-4"></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea
                                            v-model="formSocio.morada"
                                            label="Morada Completa"
                                            variant="outlined"
                                            color="primary"
                                            rows="2"
                                            hide-details="auto"
                                            class="tw-mb-6"
                                            required></v-textarea>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-btn
                                            type="submit"
                                            color="primary"
                                            size="x-large"
                                            block
                                            class="tw-h-16 tw-rounded-full tw-text-lg tw-font-bold tw-transition-transform tw-duration-300 hover:tw--translate-y-1 hover:tw-shadow-lg"
                                            :loading="enviando"
                                            :disabled="enviando">
                                            Enviar Pedido de Inscrição
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-form>

                            <v-alert
                                v-if="sucessoSocio"
                                type="success"
                                variant="tonal"
                                class="tw-mt-6 tw-rounded-xl"
                                icon="mdi-check-circle">
                                Pedido enviado com sucesso! Em breve receberá as instruções de pagamento no seu e-mail.
                            </v-alert>
                        </v-card>
                    </v-col>

                    <v-col
                        cols="12"
                        md="5"
                        class="reveal"
                        style="--reveal-delay: 90ms">
                        <v-card
                            elevation="0"
                            class="tw-h-full tw-p-8 md:tw-p-12 tw-bg-gray-900 tw-text-white tw-rounded-[40px] tw-shadow-2xl tw-border tw-border-gray-800 tw-relative tw-overflow-hidden">
                            <div class="tw-absolute tw--bottom-10 tw--right-10 tw-w-40 tw-h-40 tw-bg-primary/20 tw-rounded-full tw-blur-2xl"></div>

                            <div class="tw-relative tw-z-10">
                                <div class="tw-flex tw-items-center tw-gap-4 tw-mb-8">
                                    <div class="tw-w-16 tw-h-16 tw-bg-white/10 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                                        <v-icon
                                            size="32"
                                            color="primary"
                                            >mdi-hand-coin-outline</v-icon
                                        >
                                    </div>
                                    <h3 class="tw-text-3xl tw-font-bold tw-text-white">Fazer um Donativo</h3>
                                </div>

                                <p class="tw-text-gray-400 tw-leading-relaxed tw-mb-10">
                                    Cada donativo, por menor que seja, é fundamental para restaurar o nosso património, organizar eventos para a comunidade e apoiar os nossos idosos. Agradecemos a sua
                                    generosidade.
                                </p>

                                <div class="tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-2xl tw-p-6 tw-mb-6 hover:tw-bg-white/10 tw-transition-colors tw-group">
                                    <div class="tw-flex tw-justify-between tw-items-center tw-mb-2">
                                        <div class="tw-flex tw-items-center tw-gap-2">
                                            <v-icon color="white">mdi-cellphone</v-icon>
                                            <span class="tw-font-bold tw-text-lg">MBWay</span>
                                        </div>
                                    </div>
                                    <div class="tw-flex tw-justify-between tw-items-center">
                                        <span class="tw-text-2xl tw-font-mono tw-tracking-widest tw-text-primary">920 667 099</span>
                                        <v-btn
                                            :icon="copiado === 'MBWay' ? 'mdi-check' : 'mdi-content-copy'"
                                            variant="text"
                                            size="small"
                                            :color="copiado === 'MBWay' ? 'primary' : 'gray-400'"
                                            aria-label="Copiar número MBWay"
                                            @click="copiarTexto('920667099', 'MBWay')"
                                            class="group-hover:tw-text-white"></v-btn>
                                    </div>
                                </div>

                                <div class="tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-2xl tw-p-6 hover:tw-bg-white/10 tw-transition-colors tw-group">
                                    <div class="tw-flex tw-justify-between tw-items-center tw-mb-2">
                                        <div class="tw-flex tw-items-center tw-gap-2">
                                            <v-icon color="white">mdi-bank</v-icon>
                                            <span class="tw-font-bold tw-text-lg">Transferência (IBAN)</span>
                                        </div>
                                    </div>
                                    <div class="tw-flex tw-justify-between tw-items-center">
                                        <span class="tw-text-sm md:tw-text-base tw-font-mono tw-text-primary">PT50 0000 0000 0000 0000 000 00</span>
                                        <v-btn
                                            :icon="copiado === 'IBAN' ? 'mdi-check' : 'mdi-content-copy'"
                                            variant="text"
                                            size="small"
                                            :color="copiado === 'IBAN' ? 'primary' : 'gray-400'"
                                            aria-label="Copiar IBAN"
                                            @click="copiarTexto('PT50000000000000000000000', 'IBAN')"
                                            class="group-hover:tw-text-white"></v-btn>
                                    </div>
                                    <p class="tw-text-xs tw-text-gray-500 tw-mt-4">Titular: A.R.D.S.C.G</p>
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </section>

        <v-snackbar
            v-model="snackbar.visivel"
            :color="snackbar.cor"
            timeout="3000"
            location="top right">
            <div class="tw-flex tw-items-center tw-gap-2 tw-font-bold">
                <v-icon>{{ snackbar.cor === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
                {{ snackbar.mensagem }}
            </div>
        </v-snackbar>

        <Footer />
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive } from 'vue';
    import Footer from '../Layout/Footer.vue';
    import { enviarEmail } from '@/services/emailService';
    import { useReveal } from '@/composables/useReveal';

    useReveal();

    const enviando = ref(false);
    const sucessoSocio = ref(false);
    const formSocio = reactive({
        nome: '',
        nif: '',
        email: '',
        telefone: '',
        morada: '',
    });

    const TEMPLATE_ID_SOCIO = 'template_3ov2q6n';

    const submeterSocio = async () => {
        if (!formSocio.nome.trim() || !formSocio.nif.trim() || !formSocio.email.includes('@') || !formSocio.morada.trim()) {
            snackbar.mensagem = 'Preencha o nome, o NIF, o e-mail e a morada.';
            snackbar.cor = 'error';
            snackbar.visivel = true;
            return;
        }

        enviando.value = true;
        sucessoSocio.value = false;

        try {
            const params = {
                nome: formSocio.nome,
                nif: formSocio.nif,
                email: formSocio.email,
                telefone: formSocio.telefone,
                morada: formSocio.morada,
            };

            await enviarEmail(TEMPLATE_ID_SOCIO, params);

            sucessoSocio.value = true;

            Object.assign(formSocio, { nome: '', nif: '', email: '', telefone: '', morada: '' });

            setTimeout(() => {
                sucessoSocio.value = false;
            }, 5000);
            snackbar.mensagem = 'Pedido enviado com sucesso! Aguarde uma resposta para pagamento da quota.';
            snackbar.cor = 'success';
            snackbar.visivel = true;
        } catch (error) {
            snackbar.mensagem = 'Erro ao enviar o pedido. Tente novamente.';
            snackbar.cor = 'error';
            snackbar.visivel = true;
        } finally {
            enviando.value = false;
        }
    };

    const snackbar = reactive({ visivel: false, mensagem: '', cor: 'success' });
    const copiado = ref('');
    const copiarTexto = async (texto: string, tipo: string) => {
        try {
            await navigator.clipboard.writeText(texto);
            copiado.value = tipo;
            window.setTimeout(() => {
                if (copiado.value === tipo) copiado.value = '';
            }, 1600);
            snackbar.mensagem = `${tipo} copiado!`;
            snackbar.cor = 'success';
            snackbar.visivel = true;
        } catch (err) {
            snackbar.mensagem = 'Erro ao copiar.';
            snackbar.cor = 'error';
            snackbar.visivel = true;
        }
    };
</script>

<style scoped>
    /* Estilização para arredondar os inputs do Vuetify neste contexto */
    :deep(.v-field) {
        border-radius: 12px !important;
    }
</style>
