<template>
    <div>
        <section
            ref="heroEl"
            class="hero"
            @pointermove="onPointerMove"
            @pointerleave="onPointerLeave">
            <div class="stage">
                <div
                    ref="summerEl"
                    class="panel">
                    <img
                        src="@/assets/images/homepage/GralhasLaroucoSol.jpg"
                        alt="Aldeia de Gralhas no verão, com a Serra do Larouco ao fundo"
                        class="photo photo-summer"
                        draggable="false" />
                    <p class="label">Calor de Verão</p>
                </div>
                <div
                    ref="winterEl"
                    class="panel">
                    <img
                        src="@/assets/images/homepage/GralhasLaroucoNeve.jpg"
                        alt="Aldeia de Gralhas no inverno, com a serra coberta de neve"
                        class="photo photo-winter"
                        draggable="false" />
                    <p class="label label-end">A Magia do Inverno</p>
                </div>
            </div>

            <div class="intro">
                <h1 class="tw-text-4xl tw-font-extrabold tw-leading-tight tw-text-gray-900 md:tw-text-6xl">
                    Benvindos a Gralhas, <span class="tw-text-primary">Larouco</span>
                </h1>
                <p class="tw-mt-6 tw-px-2 tw-text-lg tw-text-gray-700 md:tw-px-6 md:tw-text-xl">
                    Onde a beleza intemporal da serra se encontra com a autenticidade e o calor de uma comunidade vibrante.
                </p>
                <v-btn
                    color="primary"
                    variant="flat"
                    to="/associacao"
                    size="x-large"
                    class="tw-mt-10 tw-rounded-full tw-px-10 tw-font-bold tw-tracking-wide tw-transition-transform tw-duration-300 hover:tw--translate-y-1">
                    Descobrir Mais
                </v-btn>
            </div>
        </section>

        <section class="tw-bg-gray-50 tw-px-6 tw-py-20 md:tw-px-16">
            <v-container>
                <div
                    ref="storyEl"
                    class="reveal">
                    <v-row class="tw-items-center">
                        <v-col
                            cols="12"
                            md="5"
                            class="tw-order-2 md:tw-order-1 md:tw-pr-8">
                            <div class="frame">
                                <v-img
                                    src="@/assets/images/homepage/gralhas_foto5.jpg"
                                    cover></v-img>
                            </div>
                        </v-col>

                        <v-col
                            cols="12"
                            md="7"
                            class="tw-order-1 md:tw-order-2 md:tw-pl-12">
                            <h2 class="tw-text-lg tw-font-semibold tw-capitalize tw-tracking-wide tw-text-primary">Nossa História</h2>
                            <h3 class="tw-mt-3 tw-text-4xl tw-font-bold tw-leading-tight tw-text-gray-950 md:tw-text-5xl">Uma Janela para a Tradição</h3>
                            <p class="tw-mt-8 tw-text-lg tw-leading-relaxed tw-text-gray-800">
                                Aninhada na encosta da Serra do Larouco, a aldeia de Gralhas é um refúgio de paz e um bastião da cultura transmontana. Aqui, o tempo parece abrandar, permitindo-nos apreciar a beleza da natureza e a riqueza das nossas tradições. É um lugar onde cada pedra conta uma história e cada sorriso acolhe um novo amigo.
                            </p>
                        </v-col>
                    </v-row>
                </div>

                <div
                    ref="purposeEl"
                    class="reveal tw-mt-20 md:tw-mt-32">
                    <v-row class="tw-items-center">
                        <v-col
                            cols="12"
                            md="7"
                            class="tw-order-2 md:tw-order-1 md:tw-pr-12">
                            <h2 class="tw-text-lg tw-font-semibold tw-capitalize tw-tracking-wide tw-text-primary">Propósito Vivo</h2>
                            <h3 class="tw-mt-3 tw-text-4xl tw-font-bold tw-leading-tight tw-text-gray-950 md:tw-text-5xl">Proteger o Passado, Construir o Futuro</h3>
                            <p class="tw-mt-8 tw-text-lg tw-leading-relaxed tw-text-gray-800">
                                A nossa associação nasce da vontade inabalável das nossas gentes em preservar este património ímpar. O nosso foco é dinamizar a aldeia, apoiar a comunidade através de ações socioculturais e criar projetos que mantenham vivas as nossas raízes. Queremos garantir que as futuras gerações sintam o mesmo orgulho de pertencer a esta terra e que continuem a moldar o seu futuro com resiliência.
                            </p>
                            <div class="tw-mt-10">
                                <v-btn
                                    variant="outlined"
                                    color="primary"
                                    to="/acoes"
                                    class="tw-rounded-full tw-px-8 tw-font-bold tw-tracking-wide tw-transition-colors hover:tw-bg-primary/5"
                                    size="large">
                                    Conhecer as Nossas Ações
                                </v-btn>
                            </div>
                        </v-col>

                        <v-col
                            cols="12"
                            md="5"
                            class="tw-order-1 md:tw-order-2 md:tw-pl-8">
                            <div class="frame">
                                <v-img
                                    src="@/assets/images/homepage/gralhas_missao.jpg"
                                    cover></v-img>
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </v-container>
        </section>

        <section
            ref="valuesEl"
            class="reveal tw-bg-white tw-px-6 tw-py-24 md:tw-px-16">
            <v-container>
                <h2 class="tw-mb-20 tw-text-center tw-text-4xl tw-font-bold tw-text-gray-950 md:tw-text-5xl">Os nossos Valores</h2>

                <v-row class="tw-justify-center tw-gap-8 md:tw-gap-6">
                    <v-col
                        cols="12"
                        md="4">
                        <v-card
                            class="value-card tw-h-full tw-rounded-3xl tw-border tw-border-gray-100 tw-p-10 tw-shadow-lg"
                            elevation="0">
                            <div class="tw-mb-8 tw-flex tw-justify-center">
                                <v-icon
                                    size="48"
                                    color="primary"
                                    >mdi-target</v-icon
                                >
                            </div>
                            <h4 class="tw-mb-6 tw-text-center tw-text-2xl tw-font-bold tw-text-secondary">Missão:</h4>
                            <p class="tw-px-2 tw-text-center tw-text-lg tw-leading-relaxed tw-text-gray-700">
                                Contribuir para o desenvolvimento social local. Promover um ambiente saudável e acolhedor para a prática de atividades recreativas, desportivas e socioculturais, visando o bem-estar e integração dos associados, bem como o desenvolvimento pessoal e social da população.
                            </p>
                        </v-card>
                    </v-col>

                    <v-col
                        cols="12"
                        md="4">
                        <v-card
                            class="value-card tw-h-full tw-rounded-3xl tw-border tw-border-gray-100 tw-p-10 tw-shadow-lg"
                            elevation="0">
                            <div class="tw-mb-8 tw-flex tw-justify-center">
                                <v-icon
                                    size="48"
                                    color="primary"
                                    >mdi-eye-outline</v-icon
                                >
                            </div>
                            <h4 class="tw-mb-6 tw-text-center tw-text-2xl tw-font-bold tw-text-secondary">Visão:</h4>
                            <p class="tw-px-2 tw-text-center tw-text-lg tw-leading-relaxed tw-text-gray-700">
                                Ser reconhecida como uma referência na promoção do bem-estar e qualidade de vida. Ser reconhecida como uma referência na promoção de atividades recreativas, desportivas e socioculturais, contribuindo para a melhoria da qualidade de vida de seus associados e da população em geral.
                            </p>
                        </v-card>
                    </v-col>

                    <v-col
                        cols="12"
                        md="4">
                        <v-card
                            class="value-card tw-h-full tw-rounded-3xl tw-border tw-border-gray-100 tw-p-10 tw-shadow-lg"
                            elevation="0">
                            <div class="tw-mb-8 tw-flex tw-justify-center">
                                <v-icon
                                    size="48"
                                    color="primary"
                                    >mdi-diamond-stone</v-icon
                                >
                            </div>
                            <h4 class="tw-mb-6 tw-text-center tw-text-2xl tw-font-bold tw-text-secondary">Valores:</h4>
                            <p class="tw-px-2 tw-text-center tw-text-lg tw-leading-relaxed tw-text-gray-700">Transparência, ética, respeito, solidariedade, diversidade, excelência, compromisso com a comunidade e sustentabilidade.</p>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </section>

        <section
            ref="joinEl"
            class="reveal tw-relative tw-flex tw-min-h-[50vh] tw-items-center tw-justify-center tw-overflow-hidden tw-p-10">
            <v-img
                src="@/assets/images/homepage/gralhas_foto5.jpg"
                cover
                class="tw-absolute tw-inset-0 tw-scale-125 tw-opacity-20 tw-blur-[2px]"></v-img>
            <div class="tw-relative tw-z-10 tw-max-w-2xl tw-text-center">
                <h2 class="tw-text-5xl tw-font-extrabold tw-leading-tight tw-text-gray-950 md:tw-text-6xl">Faça parte da <span class="tw-text-primary">nossa história</span></h2>
                <v-btn
                    color="secondary"
                    variant="flat"
                    to="/agir"
                    size="x-large"
                    class="tw-mt-12 tw-rounded-full tw-px-10 tw-font-bold tw-tracking-wide tw-transition-transform tw-duration-300 hover:tw-scale-105">
                    Juntar-se à Associação
                </v-btn>
            </div>
        </section>

        <Footer />
    </div>
</template>

<script setup lang="ts">
    import Footer from '@/views/Layout/Footer.vue';

    const heroEl = ref<HTMLElement | null>(null);
    const summerEl = ref<HTMLElement | null>(null);
    const winterEl = ref<HTMLElement | null>(null);
    const storyEl = ref<HTMLElement | null>(null);
    const purposeEl = ref<HTMLElement | null>(null);
    const valuesEl = ref<HTMLElement | null>(null);
    const joinEl = ref<HTMLElement | null>(null);

    let frame = 0;
    let following = false;
    let summer = 1;
    let winter = 1;
    let targetSummer = 1;
    let targetWinter = 1;
    let pointerX = 0.5;
    let pointerY = 0.5;
    let targetX = 0.5;
    let targetY = 0.5;
    let revealObserver: IntersectionObserver | undefined;

    function motionAllowed() {
        return window.matchMedia('(min-width: 768px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function paintHero() {
        if (!summerEl.value || !winterEl.value) return;

        summerEl.value.style.flexGrow = summer.toFixed(4);
        winterEl.value.style.flexGrow = winter.toFixed(4);

        const shiftX = (pointerX - 0.5) * 18;
        const shiftY = (pointerY - 0.5) * 12;
        const photos = [summerEl.value, winterEl.value].map((panel) => panel.querySelector('img'));

        photos.forEach((photo, index) => {
            if (!(photo instanceof HTMLImageElement)) return;
            const direction = index === 0 ? 1 : -1;
            photo.style.transform = `scale(1.07) translate3d(${(direction * shiftX).toFixed(2)}px, ${shiftY.toFixed(2)}px, 0)`;
        });
    }

    function stepHero() {
        const ease = 0.075;
        summer += (targetSummer - summer) * ease;
        winter += (targetWinter - winter) * ease;
        pointerX += (targetX - pointerX) * ease;
        pointerY += (targetY - pointerY) * ease;
        paintHero();

        const resting =
            !following &&
            Math.abs(targetSummer - summer) < 0.002 &&
            Math.abs(targetWinter - winter) < 0.002 &&
            Math.abs(targetX - pointerX) < 0.002 &&
            Math.abs(targetY - pointerY) < 0.002;

        if (resting) {
            summer = targetSummer;
            winter = targetWinter;
            pointerX = targetX;
            pointerY = targetY;
            paintHero();
            frame = 0;
            return;
        }

        frame = requestAnimationFrame(stepHero);
    }

    function wakeHero() {
        if (frame) return;
        frame = requestAnimationFrame(stepHero);
    }

    function resetHeroMotion() {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        following = false;
        summer = winter = targetSummer = targetWinter = 1;
        pointerX = pointerY = targetX = targetY = 0.5;
        summerEl.value?.style.removeProperty('flex-grow');
        winterEl.value?.style.removeProperty('flex-grow');
        [summerEl.value, winterEl.value].forEach((panel) => {
            panel?.querySelector('img')?.style.removeProperty('transform');
        });
    }

    function onPointerMove(event: PointerEvent) {
        if (event.pointerType !== 'mouse' || !motionAllowed() || !heroEl.value) return;

        const bounds = heroEl.value.getBoundingClientRect();
        const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
        const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
        const influence = (0.5 - x) * 0.7;

        targetSummer = 1 + influence;
        targetWinter = 1 - influence;
        targetX = x;
        targetY = y;
        following = true;
        wakeHero();
    }

    function onPointerLeave() {
        following = false;
        targetSummer = 1;
        targetWinter = 1;
        targetX = 0.5;
        targetY = 0.5;
        if (motionAllowed()) wakeHero();
    }

    const rowQuery = window.matchMedia('(min-width: 768px)');

    function onLayoutChange() {
        if (!motionAllowed()) resetHeroMotion();
    }

    onMounted(() => {
        rowQuery.addEventListener('change', onLayoutChange);

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const nodes = [storyEl.value, purposeEl.value, valuesEl.value, joinEl.value].filter((node): node is HTMLElement => node instanceof HTMLElement);

        if (reduceMotion) {
            nodes.forEach((node) => node.classList.add('is-visible'));
            return;
        }

        revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    revealObserver?.unobserve(entry.target);
                });
            },
            { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
        );

        nodes.forEach((node) => revealObserver?.observe(node));
    });

    onBeforeUnmount(() => {
        if (frame) cancelAnimationFrame(frame);
        rowQuery.removeEventListener('change', onLayoutChange);
        revealObserver?.disconnect();
    });
</script>

<style scoped>
    .hero {
        padding: 1.5rem 1.5rem 3.5rem;
    }

    .stage {
        display: flex;
        height: min(62vh, 740px);
        min-height: 440px;
        overflow: hidden;
        border-radius: 32px;
        background: #1c1917;
        box-shadow: 0 30px 70px -28px rgba(0, 0, 0, 0.45);
        touch-action: pan-y;
        user-select: none;
    }

    .panel {
        position: relative;
        flex: 1 1 0;
        min-width: 0;
        overflow: hidden;
    }

    .panel + .panel {
        box-shadow: inset 1px 0 0 rgba(255, 255, 255, 0.55);
    }

    .panel::before {
        content: '';
        position: absolute;
        z-index: 1;
        top: 0;
        right: 0;
        left: 0;
        height: 34%;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.42), transparent);
        pointer-events: none;
    }

    .photo {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scale(1.07);
        will-change: transform;
    }

    .photo-summer {
        object-position: center 42%;
    }

    .photo-winter {
        object-position: center 46%;
    }

    .label {
        position: absolute;
        z-index: 2;
        top: 0;
        right: 0;
        left: 0;
        margin: 0;
        padding: 1.6rem 1.8rem;
        color: white;
        font-size: 1.35rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-shadow: 0 2px 16px rgba(0, 0, 0, 0.35);
        pointer-events: none;
    }

    .label-end {
        text-align: right;
    }

    .intro {
        position: relative;
        z-index: 2;
        width: min(48rem, calc(100% - 1rem));
        margin: -5.5rem auto 0;
        padding: 2.75rem 2.5rem 2.5rem;
        text-align: center;
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid rgba(17, 24, 39, 0.06);
        border-radius: 40px;
        box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(16px);
    }

    .frame {
        overflow: hidden;
        border-radius: 30px;
        box-shadow: 0 20px 40px -18px rgba(0, 0, 0, 0.35);
    }

    .frame :deep(.v-img) {
        transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .value-card {
        transition:
            transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.6s ease;
    }

    @media (prefers-reduced-motion: no-preference) {
        .stage,
        .intro {
            animation: rise 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .intro {
            animation-delay: 0.12s;
        }

        .reveal {
            opacity: 0;
            transform: translateY(22px);
            transition:
                opacity 0.8s ease,
                transform 0.85s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .reveal.is-visible {
            opacity: 1;
            transform: none;
        }

        .frame:hover :deep(.v-img) {
            transform: scale(1.045);
        }

        .value-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 24px 48px -20px rgba(0, 0, 0, 0.25);
        }
    }

    @media (min-width: 768px) {
        .hero {
            padding: 2.5rem 2.5rem 3rem;
        }
    }

    @media (max-width: 767px) {
        .stage {
            flex-direction: column;
            height: auto;
            min-height: 0;
        }

        .panel {
            flex: none;
            height: 34vh;
            min-height: 220px;
        }

        .panel + .panel {
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55);
        }

        .label {
            padding: 1rem 1.1rem;
            font-size: 1.15rem;
        }

        .intro {
            width: 100%;
            margin-top: -2.25rem;
            padding: 1.75rem 1.25rem 1.5rem;
            border-radius: 28px;
        }
    }

    @keyframes rise {
        from {
            opacity: 0;
            transform: translateY(18px);
        }

        to {
            opacity: 1;
            transform: none;
        }
    }
</style>
