<template>
    <div class="tw-bg-gray-50 tw-min-h-screen tw-pb-24">
        <section class="tw-bg-gray-900 tw-text-white tw-py-20 tw-rounded-b-[60px] tw-relative tw-overflow-hidden">
            <div
                class="tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full tw-bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] tw-from-primary/20 tw-via-gray-900 tw-to-gray-900 tw-opacity-60"></div>

            <v-container class="tw-relative tw-z-10 tw-text-center">
                <h1 class="tw-text-5xl md:tw-text-6xl tw-font-extrabold tw-tracking-tight tw-mb-4">Fale <span class="tw-text-primary">Connosco</span></h1>
                <p class="tw-text-lg tw-text-gray-400 tw-max-w-2xl tw-mx-auto">
                    A Associação é feita de pessoas e para as pessoas. Estamos sempre de portas abertas para ouvir as suas ideias, dúvidas ou sugestões.
                </p>
            </v-container>
        </section>

        <section class="tw--mt-12 tw-px-6 md:tw-px-16 tw-relative tw-z-20">
            <v-container>
                <v-row class="tw-justify-center">
                    <v-col
                        cols="12"
                        md="4">
                        <v-card
                            class="tw-h-full tw-p-8 tw-text-center tw-rounded-[30px] tw-shadow-xl hover:tw--translate-y-2 tw-transition-transform tw-duration-300 tw-border tw-border-gray-100"
                            elevation="0">
                            <div class="tw-w-16 tw-h-16 tw-mx-auto tw-bg-primary/10 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mb-6">
                                <v-icon
                                    size="32"
                                    color="primary"
                                    >mdi-phone</v-icon
                                >
                            </div>
                            <h3 class="tw-text-xl tw-font-bold tw-text-gray-900 tw-mb-2">Telefone</h3>
                            <p class="tw-text-gray-600 tw-mb-4">Ligue-nos para qualquer assunto urgente ou esclarecimento.</p>
                            <a
                                href="tel:+351919981950"
                                class="tw-text-lg tw-font-bold tw-text-primary hover:tw-text-secondary tw-transition-colors">
                                919 981 950
                            </a>
                        </v-card>
                    </v-col>

                    <v-col
                        cols="12"
                        md="4">
                        <v-card
                            class="tw-h-full tw-p-8 tw-text-center tw-rounded-[30px] tw-shadow-xl hover:tw--translate-y-2 tw-transition-transform tw-duration-300 tw-border tw-border-gray-100"
                            elevation="0">
                            <div class="tw-w-16 tw-h-16 tw-mx-auto tw-bg-primary/10 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mb-6">
                                <v-icon
                                    size="32"
                                    color="primary"
                                    >mdi-email</v-icon
                                >
                            </div>
                            <h3 class="tw-text-xl tw-font-bold tw-text-gray-900 tw-mb-2">E-mail</h3>
                            <p class="tw-text-gray-600 tw-mb-4">Envie-nos uma mensagem, responderemos o mais breve possível.</p>
                            <a
                                href="mailto:associacao.gralhas11@gmail.com"
                                class="tw-text-md tw-font-bold tw-text-primary hover:tw-text-secondary tw-transition-colors tw-break-all">
                                associacao.gralhas11@gmail.com
                            </a>
                        </v-card>
                    </v-col>

                    <v-col
                        cols="12"
                        md="4">
                        <v-card
                            class="tw-h-full tw-p-8 tw-text-center tw-rounded-[30px] tw-shadow-xl hover:tw--translate-y-2 tw-transition-transform tw-duration-300 tw-border tw-border-gray-100"
                            elevation="0">
                            <div class="tw-w-16 tw-h-16 tw-mx-auto tw-bg-primary/10 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mb-6">
                                <v-icon
                                    size="32"
                                    color="primary"
                                    >mdi-map-marker</v-icon
                                >
                            </div>
                            <h3 class="tw-text-xl tw-font-bold tw-text-gray-900 tw-mb-2">Sede</h3>
                            <p class="tw-text-gray-600 tw-mb-4">Venha visitar-nos e conhecer o nosso espaço na aldeia.</p>
                            <div class="tw-text-md tw-font-bold tw-text-gray-800">
                                Largo da Aldeia<br />
                                <span class="tw-text-sm tw-font-normal tw-text-gray-500">5470-172 Gralhas</span>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </section>

        <section class="tw-py-20 tw-px-6 md:tw-px-16">
            <v-container>
                <div class="tw-text-center tw-mb-12">
                    <h2 class="tw-text-primary tw-font-bold tw-text-sm tw-tracking-[0.2em] tw-uppercase tw-mb-4">A nossa Equipa</h2>
                    <h3 class="tw-text-4xl tw-font-bold tw-text-gray-900">Quem faz a Associação acontecer</h3>
                </div>

                <v-row class="tw-justify-center">
                    <v-col
                        cols="12"
                        md="10"
                        lg="8">
                        <v-card
                            elevation="0"
                            class="tw-text-center tw-p-2 md:tw-p-4 tw-bg-white tw-rounded-[40px] tw-border tw-border-gray-100 tw-shadow-xl hover:tw-shadow-2xl tw-transition-shadow tw-duration-300">
                            <v-img
                                src="@/assets/images/equipa.jpg"
                                alt="A Nossa Equipa da Associação de Gralhas"
                                class="tw-w-full tw-h-64 md:tw-h-96 tw-rounded-[32px] tw-object-cover"
                                cover></v-img>

                            <div class="tw-p-8 md:tw-p-10">
                                <v-icon
                                    color="primary"
                                    size="large"
                                    class="tw-mb-4"
                                    >mdi-account-group-outline</v-icon
                                >
                                <h4 class="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-4">Unidos por Gralhas</h4>
                                <p class="tw-text-lg tw-text-gray-600 tw-leading-relaxed tw-italic">
                                    "Mais do que um grupo de trabalho, somos filhos desta terra. Juntos, com raízes fortes na tradição e os olhos postos no futuro, dedicamo-nos diariamente a manter
                                    viva a alma de Gralhas e a fortalecer os laços da nossa comunidade."
                                </p>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </section>

        <section class="tw-pb-10 tw-px-6 md:tw-px-16">
            <v-container>
                <v-card
                    elevation="0"
                    class="tw-rounded-[40px] tw-shadow-2xl tw-overflow-hidden tw-border tw-border-gray-100">
                    <v-row class="tw-m-0">
                        <v-col
                            cols="12"
                            md="5"
                            class="tw-bg-gray-900 tw-text-white tw-p-10 md:tw-p-16 tw-flex tw-flex-col tw-justify-center">
                            <h3 class="tw-text-3xl tw-font-bold tw-mb-6">Envie-nos uma mensagem</h3>
                            <p class="tw-text-gray-400 tw-leading-relaxed tw-mb-8">
                                Tem uma ideia para um evento? Gostaria de saber mais sobre como se tornar sócio? Preencha o formulário e a nossa equipa entrará em contacto consigo o mais rapidamente
                                possível.
                            </p>
                            <div class="tw-flex tw-items-center tw-gap-4 tw-mt-auto">
                                <v-icon
                                    color="primary"
                                    size="large"
                                    >mdi-chat-processing-outline</v-icon
                                >
                                <span class="tw-text-lg tw-font-medium">Responderemos em breve.</span>
                            </div>
                        </v-col>

                        <v-col
                            cols="12"
                            md="7"
                            class="tw-p-10 md:tw-p-16 tw-bg-white">
                            <v-form @submit.prevent="submeterContacto">
                                <v-row>
                                    <v-col
                                        cols="12"
                                        md="6">
                                        <v-text-field
                                            v-model="formMensagem.nome"
                                            label="O seu Nome"
                                            variant="outlined"
                                            color="primary"
                                            hide-details="auto"
                                            class="tw-mb-4"></v-text-field>
                                    </v-col>
                                    <v-col
                                        cols="12"
                                        md="6">
                                        <v-text-field
                                            v-model="formMensagem.email"
                                            label="O seu E-mail"
                                            type="email"
                                            variant="outlined"
                                            color="primary"
                                            hide-details="auto"
                                            class="tw-mb-4"></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field
                                            v-model="formMensagem.assunto"
                                            label="Assunto"
                                            variant="outlined"
                                            color="primary"
                                            hide-details="auto"
                                            class="tw-mb-4"></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea
                                            v-model="formMensagem.mensagem"
                                            label="A sua Mensagem"
                                            variant="outlined"
                                            color="primary"
                                            rows="4"
                                            hide-details="auto"
                                            class="tw-mb-6"></v-textarea>
                                    </v-col>
                                    <v-col
                                        cols="12"
                                        class="tw-text-right">
                                        <v-btn
                                            type="submit"
                                            color="primary"
                                            size="x-large"
                                            variant="flat"
                                            class="tw-rounded-full tw-px-10 tw-font-bold tw-tracking-wide">
                                            Enviar Mensagem
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-col>
                    </v-row>
                </v-card>
            </v-container>
        </section>

        <v-snackbar
            v-model="snackbar.visivel"
            :color="snackbar.cor"
            timeout="3000"
            location="top right">
            <div class="tw-flex tw-items-center tw-gap-2 tw-font-bold">
                <v-icon>mdi-check-circle</v-icon>
                {{ snackbar.mensagem }}
            </div>
        </v-snackbar>
    </div>
    <Footer />
</template>

<script setup lang="ts">
    import { reactive, ref } from 'vue';
    import { enviarEmail } from '@/services/emailService';
    import Footer from '../Layout/Footer.vue';

    const enviando = ref(false);
    const sucessoSocio = ref(false);
    const formMensagem = reactive({
        nome: '',
        email: '',
        assunto: '',
        mensagem: '',
    });

    const TEMPLATE_ID_CONTACTO = 'template_zcy6ar8';

    const submeterContacto = async () => {
        enviando.value = true;
        sucessoSocio.value = false;

        try {
            const params = {
                nome: formMensagem.nome,
                email: formMensagem.email,
                assunto: formMensagem.assunto,
                mensagem: formMensagem.mensagem,
            };

            await enviarEmail(TEMPLATE_ID_CONTACTO, params);

            sucessoSocio.value = true;

            Object.assign(formMensagem, { nome: '', email: '', assunto: '', mensagem: '' });

            setTimeout(() => {
                sucessoSocio.value = false;
            }, 5000);
            snackbar.mensagem = 'Mensagem enviada com sucesso! Aguarde uma resposta.';
            snackbar.cor = 'success';
            snackbar.visivel = true;
        } catch (error) {
            snackbar.mensagem = 'Erro ao enviar a mensagem. Tente novamente.';
            snackbar.cor = 'error';
            snackbar.visivel = true;
        } finally {
            enviando.value = false;
        }
    };

    const snackbar = reactive({ visivel: false, mensagem: '', cor: 'success' });
</script>
