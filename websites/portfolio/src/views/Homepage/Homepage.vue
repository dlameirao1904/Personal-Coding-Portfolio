<template>
  <div
    class="tw-fixed tw-overflow-hidden tw-bg-[#6eafeb] tw-font-[Outfit,Lato,sans-serif] tw-text-[#17211c] [&_canvas]:tw-block [&_canvas]:tw-h-full [&_canvas]:tw-w-full [&_canvas]:tw-cursor-grab"
    :class="[journeyTurned ? 'journey-turned' : 'tw-inset-0', { 'journey-handheld': handheld }]"
  >
    <TresCanvas clear-color="#6eafeb" shadows>
      <TresPerspectiveCamera :fov="46" :near="0.1" :far="420" />
      <TresFog :args="['#a9d4f5', 120, 390]" />
      <TresHemisphereLight :args="['#d7ecff', '#6d9444', 0.7]" />
      <TresDirectionalLight
        :position="[40, 64, -3]"
        :intensity="2.65"
        color="#fff1cc"
        cast-shadow
      />
      <TresMesh :position="[72, 110, 18]">
        <TresSphereGeometry :args="[4.6, 24, 16]" />
        <TresMeshBasicMaterial color="#fff4c2" :fog="false" />
      </TresMesh>

      <Montanha :active-id="activeId" />
      <Montanhista
        ref="hiker"
        :reading-id="readingId"
        @arrive="onArrive"
        @started="started = true"
      />
      <Atlas />
      <Atelier />
      <Capela />
      <Campo />
      <Ringue />
      <Discos />
      <Trotinete />
    </TresCanvas>

    <div
      class="tw-pointer-events-none tw-absolute tw-left-[18px] tw-right-[18px] tw-top-[max(18px,env(safe-area-inset-top,0px))] tw-z-[4] tw-flex tw-items-start tw-justify-between"
    >
      <div class="tw-pointer-events-auto tw-flex tw-items-start tw-gap-2">
        <div class="tw-relative">
          <button
            type="button"
            class="tw-flex tw-h-11 tw-w-11 tw-cursor-pointer tw-items-center tw-justify-center tw-rounded-full tw-border-0 tw-bg-[#f7f3eaeb] tw-text-[#17211c] hover:tw-bg-white focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-[3px] focus-visible:tw-outline-[#0e3328]"
            :aria-expanded="menuOpen"
            aria-label="Menu"
            @click="menuOpen = !menuOpen"
          >
            <span class="tw-flex tw-w-4 tw-flex-col tw-gap-1" aria-hidden="true">
              <span class="tw-block tw-h-0.5 tw-rounded-full tw-bg-current" />
              <span class="tw-block tw-h-0.5 tw-rounded-full tw-bg-current" />
              <span class="tw-block tw-h-0.5 tw-rounded-full tw-bg-current" />
            </span>
          </button>
          <div
            v-if="menuOpen"
            class="tw-absolute tw-left-0 tw-top-[calc(100%+0.45rem)] tw-flex tw-w-52 tw-flex-col tw-gap-1 tw-rounded-2xl tw-bg-[#f7f3eaf0] tw-p-2 tw-shadow-[0_12px_28px_#17211c24]"
          >
            <button
              type="button"
              class="tw-cursor-pointer tw-rounded-xl tw-border-0 tw-bg-transparent tw-px-3 tw-py-2 tw-text-left tw-font-[inherit] tw-text-[0.95rem] tw-text-[#17211c] hover:tw-bg-[#0e332814]"
              @click="chooseStart"
            >
              Início do trilho
            </button>
            <RouterLink
              class="tw-rounded-xl tw-px-3 tw-py-2 tw-text-[0.95rem] tw-text-[#17211c] tw-no-underline hover:tw-bg-[#0e332814]"
              to="/"
              @click="menuOpen = false"
            >
              Portefólio
            </RouterLink>
            <button
              type="button"
              class="tw-cursor-pointer tw-rounded-xl tw-border-0 tw-bg-transparent tw-px-3 tw-py-2 tw-text-left tw-font-[inherit] tw-text-[0.95rem] tw-text-[#17211c] hover:tw-bg-[#0e332814]"
              @click="openPrompt"
            >
              Prompt
            </button>
          </div>
        </div>
        <button
          type="button"
          data-mute
          class="tw-flex tw-h-11 tw-cursor-pointer tw-items-center tw-rounded-full tw-border-0 tw-bg-[#f7f3eaeb] tw-px-3 tw-font-[inherit] tw-text-[0.85rem] tw-text-[#17211c] hover:tw-bg-white focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-[3px] focus-visible:tw-outline-[#0e3328]"
          :aria-pressed="soundOn"
          :aria-label="soundOn ? 'Desativar som' : 'Ativar som'"
          @click="toggleSound"
        >
          <v-icon>
            {{ soundOn ? 'mdi-volume-high' : 'mdi-volume-off' }}
          </v-icon>
        </button>
      </div>
      <JourneyMap v-show="!(reading && handheld)" class="tw-pointer-events-auto" />
    </div>

    <article
      v-if="!started && !reading"
      class="journey-card tw-absolute tw-right-[18px] tw-top-[9.6rem] tw-z-[2] tw-max-h-[min(62vh,560px)] tw-w-[min(380px,calc(100vw-36px))] tw-overflow-auto tw-rounded-[22px] tw-bg-[#f7f3eaf0] tw-p-5 tw-shadow-[0_16px_40px_#17211c1f] max-md:tw-bottom-auto max-md:tw-left-auto max-md:tw-right-3 max-md:tw-top-[9.6rem] max-md:tw-max-h-[38vh] max-md:tw-w-[min(17.5rem,calc(100vw-6.5rem))] max-md:tw-rounded-2xl max-md:tw-p-3.5 max-md:tw-shadow-[0_10px_28px_#17211c33]"
      :class="{ 'journey-card--shut': handheld && !cardOpen }"
    >
      <p class="tw-mb-2 tw-text-[0.72rem] tw-uppercase tw-tracking-[0.12em] tw-text-[#8a4632]">
        O trilho
      </p>
      <h1
        class="tw-m-0 tw-font-[Fraunces,Georgia,serif] tw-text-[clamp(1.55rem,2vw,2rem)] tw-font-[560] tw-leading-[1.05] tw-tracking-[-0.03em]"
      >
        Um percurso, algumas paisagens e boa disposição.
      </h1>
      <button
        v-if="handheld"
        type="button"
        class="tw-mt-2 tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#0e3328] tw-px-2.5 tw-py-1 tw-font-[inherit] tw-text-[0.75rem] tw-text-[#f7f3ea]"
        @click="cardOpen = !cardOpen"
      >
        {{ cardOpen ? 'Fechar' : 'Ler' }}
      </button>
      <div v-show="!handheld || cardOpen">
        <p class="tw-mt-3 tw-leading-[1.45]">
          Aqui, podes ver os meus passos, literalmente. Aproveita a jornada e aprecia a paisagem.
        </p>
        <p class="tw-mt-3 tw-leading-[1.45]">
          Os empregos, o curso e os projectos estão no trilho. Chega-te e
          {{ handheld ? 'toca em Ver' : 'carrega em E' }} para abrir a ficha.
        </p>
        <p class="tw-mt-3 tw-leading-[1.45]">«Só a Natureza é divina, e ela não é divina...»</p>
        <p
          v-if="!handheld"
          class="desk-help tw-mt-3 tw-text-[0.92rem] tw-leading-[1.45] tw-text-[#5c675f]"
        >
          WASD ou setas para andar. Shift para correr. Espaço para saltar. Arrasta o rato para
          olhar.
        </p>
      </div>
    </article>

    <article
      v-else-if="passage && !reading && passage.kind !== 'project' && !baking && !sparring && !listening"
      class="journey-card tw-absolute tw-right-[18px] tw-top-[9.6rem] tw-z-[2] tw-max-h-[min(62vh,560px)] tw-w-[min(380px,calc(100vw-36px))] tw-overflow-auto tw-rounded-[22px] tw-bg-[#f7f3eaf0] tw-p-5 tw-shadow-[0_16px_40px_#17211c1f] max-md:tw-bottom-auto max-md:tw-left-auto max-md:tw-right-3 max-md:tw-top-[9.6rem] max-md:tw-max-h-[38vh] max-md:tw-w-[min(17.5rem,calc(100vw-6.5rem))] max-md:tw-rounded-2xl max-md:tw-p-3.5 max-md:tw-shadow-[0_10px_28px_#17211c33]"
      :class="{ 'journey-card--shut': handheld && !cardOpen }"
    >
      <p class="tw-mb-2 tw-text-[0.72rem] tw-uppercase tw-tracking-[0.12em] tw-text-[#8a4632]">
        {{ passage.kicker }}
        <span v-if="passage.ongoing">· atual</span>
      </p>
      <h1
        class="tw-m-0 tw-font-[Fraunces,Georgia,serif] tw-text-[clamp(1.55rem,2vw,2rem)] tw-font-[560] tw-leading-[1.05] tw-tracking-[-0.03em]"
      >
        {{ passage.title }}
      </h1>
      <button
        v-if="handheld"
        type="button"
        class="tw-mt-2 tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#0e3328] tw-px-2.5 tw-py-1 tw-font-[inherit] tw-text-[0.75rem] tw-text-[#f7f3ea]"
        @click="cardOpen = !cardOpen"
      >
        {{ cardOpen ? 'Fechar' : 'Ler' }}
      </button>
      <div v-show="!handheld || cardOpen">
        <p class="tw-mt-3 tw-text-[0.92rem] tw-leading-[1.45] tw-text-[#4e5a53]">
          {{ passage.organization }} · {{ passage.period }} · {{ passage.place }}
        </p>
        <p
          v-if="passage.relation"
          class="tw-mt-1 tw-text-[0.92rem] tw-leading-[1.45] tw-text-[#0e3328]"
        >
          {{ passage.relation }}
        </p>
        <p
          v-if="passage.parentTitle"
          class="tw-mt-1 tw-text-[0.92rem] tw-leading-[1.45] tw-text-[#0e3328]"
        >
          Parte de {{ passage.parentTitle }}
        </p>
        <p class="tw-mt-3 tw-leading-[1.45]">{{ passage.summary }}</p>
        <p v-if="passage.links?.length" class="tw-mb-0 tw-mt-3 tw-flex tw-flex-wrap tw-gap-4">
          <a
            v-for="link in passage.links"
            :key="link.href"
            class="tw-text-[#0e3328] tw-underline tw-underline-offset-[0.18em] hover:tw-text-[#17211c] focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-[3px] focus-visible:tw-outline-[#0e3328]"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ link.label }}
          </a>
        </p>
        <p
          v-if="passage.sceneNote"
          class="tw-mt-3 tw-text-[0.92rem] tw-leading-[1.45] tw-text-[#5c675f]"
        >
          {{ passage.sceneNote }}
        </p>
        <ul
          v-if="passage.stack.length"
          class="tw-m-0 tw-mt-4 tw-flex tw-list-none tw-flex-wrap tw-gap-1.5 tw-p-0"
        >
          <li
            v-for="item in passage.stack"
            :key="item"
            class="tw-rounded-full tw-bg-[#0e332814] tw-px-2 tw-py-1 tw-text-[0.78rem]"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </article>

    <div
      v-if="ridingScooter && !readingId"
      class="play-prompt tw-absolute tw-bottom-24 tw-left-1/2 tw-z-[4] tw-flex tw--translate-x-1/2 tw-flex-col tw-items-center tw-gap-3"
    >
      <p
        class="play-prompt__label tw-m-0 tw-whitespace-nowrap tw-rounded-full tw-bg-[#f7f3eaf0] tw-px-4 tw-py-2 tw-text-[0.95rem] tw-text-[#17211c] tw-shadow-[0_8px_20px_#17211c24]"
      >
        <span class="max-md:tw-hidden [@media(pointer:coarse)]:tw-hidden">E para descer</span>
        <span class="tw-hidden max-md:tw-inline [@media(pointer:coarse)]:tw-inline">Trotinete</span>
      </p>
      <button
        type="button"
        class="tw-hidden tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#0e3328] tw-px-4 tw-py-2 tw-font-[inherit] tw-text-[0.95rem] tw-text-[#f7f3ea] max-md:tw-inline-block [@media(pointer:coarse)]:tw-inline-block"
        @click="ridingScooter = false"
      >
        Descer
      </button>
    </div>

    <div
      v-else-if="
        scooterNear &&
        !readingId &&
        !atelierNear &&
        !ringNear &&
        !vinylNear &&
        !sparring &&
        !listening
      "
      class="play-prompt tw-absolute tw-bottom-24 tw-left-1/2 tw-z-[4] tw-flex tw--translate-x-1/2 tw-flex-col tw-items-center tw-gap-3"
    >
      <p
        class="play-prompt__label tw-m-0 tw-whitespace-nowrap tw-rounded-full tw-bg-[#f7f3eaf0] tw-px-4 tw-py-2 tw-text-[0.95rem] tw-text-[#17211c] tw-shadow-[0_8px_20px_#17211c24]"
      >
        <span class="max-md:tw-hidden [@media(pointer:coarse)]:tw-hidden">E para subir</span>
        <span class="tw-hidden max-md:tw-inline [@media(pointer:coarse)]:tw-inline">Trotinete</span>
      </p>
      <button
        type="button"
        class="tw-hidden tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#0e3328] tw-px-4 tw-py-2 tw-font-[inherit] tw-text-[0.95rem] tw-text-[#f7f3ea] max-md:tw-inline-block [@media(pointer:coarse)]:tw-inline-block"
        @click="mountScooter"
      >
        Subir
      </button>
    </div>

    <div
      v-if="penalty.engaged || penalty.call"
      class="scoreboard tw-pointer-events-none tw-absolute tw-left-1/2 tw-top-[4.7rem] tw-z-[4] tw-flex tw--translate-x-1/2 tw-items-stretch tw-overflow-hidden tw-rounded-2xl tw-bg-[#10241cf2] tw-text-[#f7f3ea] tw-shadow-[0_14px_32px_#17211c55]"
    >
      <div
        class="score-side tw-flex tw-min-w-[8.5rem] tw-flex-col tw-items-center tw-gap-1 tw-px-4 tw-py-2.5"
      >
        <span class="tw-text-[0.68rem] tw-uppercase tw-tracking-[0.16em] tw-text-[#d7e4c8]"
          >Tu</span
        >
        <span
          class="score-num tw-font-[Fraunces,Georgia,serif] tw-text-[2.15rem] tw-font-semibold tw-leading-none"
        >
          {{ penalty.goals }}
        </span>
        <span class="tw-mt-1 tw-flex tw-gap-1.5">
          <span
            v-for="(shot, index) in shootout"
            :key="'tu-' + index"
            class="tw-h-2.5 tw-w-2.5 tw-rounded-full tw-border tw-border-[#d7e4c8]"
            :class="
              shot === 'golo'
                ? 'tw-border-[#7dce6a] tw-bg-[#7dce6a]'
                : shot === 'fora' || shot === 'trave'
                  ? 'tw-border-[#e07a6a] tw-bg-[#e07a6a]'
                  : 'tw-bg-transparent'
            "
          />
        </span>
      </div>
      <div class="tw-w-px tw-self-stretch tw-bg-[#f7f3ea33]" />
      <div
        class="score-side tw-flex tw-min-w-[8.5rem] tw-flex-col tw-items-center tw-gap-1 tw-px-4 tw-py-2.5"
      >
        <span class="tw-text-[0.68rem] tw-uppercase tw-tracking-[0.16em] tw-text-[#e2b15a]">
          <span class="max-md:tw-hidden [@media(pointer:coarse)]:tw-hidden">Guarda-redes</span>
          <span class="tw-hidden max-md:tw-inline [@media(pointer:coarse)]:tw-inline">GR</span>
        </span>
        <span
          class="score-num tw-font-[Fraunces,Georgia,serif] tw-text-[2.15rem] tw-font-semibold tw-leading-none"
        >
          {{ penalty.saves }}
        </span>
        <span class="tw-mt-1 tw-flex tw-gap-1.5">
          <span
            v-for="(shot, index) in shootout"
            :key="'gr-' + index"
            class="tw-h-2.5 tw-w-2.5 tw-rounded-full tw-border tw-border-[#e2b15a]"
            :class="shot === 'defesa' ? 'tw-bg-[#e2b15a]' : 'tw-bg-transparent'"
          />
        </span>
      </div>
    </div>

    <p v-if="penalty.call" class="penalty-banner">{{ penaltyBanner }}</p>

    <div
      v-if="
        penalty.near &&
        !penalty.call &&
        !readingId &&
        !ringNear &&
        !vinylNear &&
        !sparring &&
        !listening
      "
      class="play-prompt tw-absolute tw-bottom-24 tw-left-1/2 tw-z-[4] tw-flex tw--translate-x-1/2 tw-flex-col tw-items-center tw-gap-3"
    >
      <p
        class="play-prompt__label play-prompt__keep tw-m-0 tw-max-w-[16rem] tw-rounded-full tw-bg-[#f7f3eaf0] tw-px-4 tw-py-2 tw-text-center tw-text-[0.95rem] tw-text-[#17211c] tw-shadow-[0_8px_20px_#17211c24]"
      >
        <span class="max-md:tw-hidden [@media(pointer:coarse)]:tw-hidden">
          E para chutar. Vira-te para mirar e arrasta o olhar para a altura.
        </span>
        <span class="tw-hidden max-md:tw-inline [@media(pointer:coarse)]:tw-inline">
          Arrasta para mirar e chuta.
        </span>
      </p>
      <button
        type="button"
        class="tw-hidden tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#0e3328] tw-px-4 tw-py-2 tw-font-[inherit] tw-text-[0.95rem] tw-text-[#f7f3ea] max-md:tw-inline-block [@media(pointer:coarse)]:tw-inline-block"
        @click="askPenalty"
      >
        Chutar
      </button>
    </div>

    <div
      v-if="
        projectPrompt &&
        !scooterNear &&
        !ridingScooter &&
        !penalty.near &&
        !penalty.call &&
        !penalty.engaged &&
        !atelierNear &&
        !baking &&
        !ringNear &&
        !vinylNear &&
        !sparring &&
        !listening
      "
      class="play-prompt tw-absolute tw-bottom-24 tw-left-1/2 tw-z-[4] tw-flex tw--translate-x-1/2 tw-flex-col tw-items-center tw-gap-3"
    >
      <p
        class="play-prompt__label tw-m-0 tw-whitespace-nowrap tw-rounded-full tw-bg-[#f7f3eaf0] tw-px-4 tw-py-2 tw-text-[0.95rem] tw-text-[#17211c] tw-shadow-[0_8px_20px_#17211c24]"
      >
        <span class="tw-mr-2 tw-text-[0.72rem] tw-uppercase tw-tracking-[0.12em] tw-text-[#8a4632]">
          {{ passage?.short }}
        </span>
        <span class="max-md:tw-hidden [@media(pointer:coarse)]:tw-hidden"
          >Carrega em E para ver</span
        >
        <span class="tw-hidden max-md:tw-inline [@media(pointer:coarse)]:tw-inline"
          >Toca para ver</span
        >
      </p>
      <button
        type="button"
        class="tw-hidden tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#0e3328] tw-px-4 tw-py-2 tw-font-[inherit] tw-text-[0.95rem] tw-text-[#f7f3ea] max-md:tw-inline-block [@media(pointer:coarse)]:tw-inline-block"
        @click="openProject"
      >
        Ver
      </button>
    </div>

    <div
      v-if="
        atelierNear &&
        !baking &&
        !readingId &&
        !ridingScooter &&
        !penalty.near &&
        !ringNear &&
        !vinylNear &&
        !sparring &&
        !listening
      "
      class="play-prompt tw-absolute tw-bottom-24 tw-left-1/2 tw-z-[4] tw-flex tw--translate-x-1/2 tw-flex-col tw-items-center tw-gap-3"
    >
      <p
        class="play-prompt__label tw-m-0 tw-whitespace-nowrap tw-rounded-full tw-bg-[#f7f3eaf0] tw-px-4 tw-py-2 tw-text-[0.95rem] tw-text-[#17211c] tw-shadow-[0_8px_20px_#17211c24]"
      >
        <span class="max-md:tw-hidden [@media(pointer:coarse)]:tw-hidden">E para entrar</span>
        <span class="tw-hidden max-md:tw-inline [@media(pointer:coarse)]:tw-inline">
          Entra para montar o bolo
        </span>
      </p>
      <button
        type="button"
        class="tw-hidden tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#0e3328] tw-px-4 tw-py-2 tw-font-[inherit] tw-text-[0.95rem] tw-text-[#f7f3ea] max-md:tw-inline-block [@media(pointer:coarse)]:tw-inline-block"
        @click="enterAtelier"
      >
        Entrar
      </button>
    </div>

    <div
      v-if="ringNear && !sparring && !listening && !readingId && !ridingScooter"
      class="play-prompt tw-absolute tw-bottom-24 tw-left-1/2 tw-z-[4] tw-flex tw--translate-x-1/2 tw-flex-col tw-items-center tw-gap-3"
    >
      <p
        class="play-prompt__label tw-m-0 tw-whitespace-nowrap tw-rounded-full tw-bg-[#f7f3eaf0] tw-px-4 tw-py-2 tw-text-[0.95rem] tw-text-[#17211c] tw-shadow-[0_8px_20px_#17211c24]"
      >
        <span class="max-md:tw-hidden [@media(pointer:coarse)]:tw-hidden">E para entrar</span>
        <span class="tw-hidden max-md:tw-inline [@media(pointer:coarse)]:tw-inline">Ringue</span>
      </p>
      <button
        type="button"
        class="tw-hidden tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#0e3328] tw-px-4 tw-py-2 tw-font-[inherit] tw-text-[0.95rem] tw-text-[#f7f3ea] max-md:tw-inline-block [@media(pointer:coarse)]:tw-inline-block"
        @click="enterRing"
      >
        Entrar
      </button>
    </div>

    <div
      v-if="vinylNear && !listening && !sparring && !readingId && !ridingScooter"
      class="play-prompt tw-absolute tw-bottom-24 tw-left-1/2 tw-z-[4] tw-flex tw--translate-x-1/2 tw-flex-col tw-items-center tw-gap-3"
    >
      <p
        class="play-prompt__label tw-m-0 tw-whitespace-nowrap tw-rounded-full tw-bg-[#f7f3eaf0] tw-px-4 tw-py-2 tw-text-[0.95rem] tw-text-[#17211c] tw-shadow-[0_8px_20px_#17211c24]"
      >
        <span class="max-md:tw-hidden [@media(pointer:coarse)]:tw-hidden">E para entrar</span>
        <span class="tw-hidden max-md:tw-inline [@media(pointer:coarse)]:tw-inline">Discos</span>
      </p>
      <button
        type="button"
        class="tw-hidden tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#0e3328] tw-px-4 tw-py-2 tw-font-[inherit] tw-text-[0.95rem] tw-text-[#f7f3ea] max-md:tw-inline-block [@media(pointer:coarse)]:tw-inline-block"
        @click="enterVinyl"
      >
        Entrar
      </button>
    </div>

    <div
      v-if="sparring"
      class="play-prompt play-prompt--wide tw-absolute tw-bottom-24 tw-left-1/2 tw-z-[4] tw-flex tw--translate-x-1/2 tw-flex-col tw-items-center tw-gap-3"
    >
      <p
        class="play-prompt__label play-prompt__keep tw-m-0 tw-max-w-[18rem] tw-rounded-full tw-bg-[#f7f3eaf0] tw-px-4 tw-py-2 tw-text-center tw-text-[0.95rem] tw-text-[#17211c] tw-shadow-[0_8px_20px_#17211c24]"
      >
        <span class="max-md:tw-hidden [@media(pointer:coarse)]:tw-hidden">
          "Real freedom is having nothing. I was freer when I had nothing."
        </span>
        <span class="tw-hidden max-md:tw-inline [@media(pointer:coarse)]:tw-inline"
          >Toca em cada lado</span
        >
      </p>
      <div class="tw-hidden tw-gap-2 max-md:tw-flex [@media(pointer:coarse)]:tw-flex">
        <button
          type="button"
          class="tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#0e3328] tw-px-4 tw-py-2 tw-font-[inherit] tw-text-[0.95rem] tw-text-[#f7f3ea]"
          @click="askPunch('left')"
        >
          Esquerdo
        </button>
        <button
          type="button"
          class="tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#0e3328] tw-px-4 tw-py-2 tw-font-[inherit] tw-text-[0.95rem] tw-text-[#f7f3ea]"
          @click="askPunch('right')"
        >
          Direito
        </button>
      </div>
      <button
        type="button"
        class="tw-hidden tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#f7f3eaf0] tw-px-4 tw-py-2 tw-font-[inherit] tw-text-[0.95rem] tw-text-[#17211c] max-md:tw-inline-block [@media(pointer:coarse)]:tw-inline-block"
        @click="leaveRing"
      >
        Sair
      </button>
    </div>

    <Bolo v-if="baking" />
    <GiraDiscos v-if="listening" />

    <div
      v-if="reading && screenFrame.visible"
      class="desk-screen tw-absolute tw-z-[3] tw-flex tw-flex-col tw-overflow-hidden tw-bg-[#10241c] tw-text-[#f7f3ea]"
      :style="{
        left: `${screenFrame.left}px`,
        top: `${screenFrame.top}px`,
        width: `${screenFrame.width}px`,
        height: `${screenFrame.height}px`,
        '--screen-top': `${screenFrame.top}px`,
      }"
    >
      <div
        class="desk-screen__body tw-flex tw-min-h-0 tw-flex-1 tw-flex-col tw-gap-[0.65em] tw-overflow-auto tw-px-[0.9em] tw-py-[0.75em]"
      >
        <div class="tw-flex tw-items-start tw-justify-between tw-gap-3">
          <div>
            <p class="tw-m-0 tw-text-[0.72em] tw-uppercase tw-tracking-[0.12em] tw-text-[#e7c7a4]">
              {{ reading.kicker }}
            </p>
            <h2
              class="tw-m-0 tw-mt-[0.15em] tw-font-[Fraunces,Georgia,serif] tw-text-[1.45em] tw-font-[560] tw-leading-[1.05] tw-tracking-[-0.03em]"
            >
              {{ reading.title }}
            </h2>
          </div>
          <button
            type="button"
            class="desk-screen__close tw-shrink-0 tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#f7f3ea] tw-px-[0.7em] tw-py-[0.28em] tw-font-[inherit] tw-text-[0.78em] tw-text-[#10241c]"
            @click="readingId = null"
          >
            Fechar
          </button>
        </div>
        <p class="tw-m-0 tw-text-[0.86em] tw-leading-[1.4] tw-text-[#b7c4bc]">
          {{ reading.organization }} · {{ reading.period }} · {{ reading.place }}
        </p>
        <p class="tw-m-0 tw-leading-[1.45]">{{ reading.summary }}</p>
        <p v-if="reading.links?.length" class="tw-m-0 tw-flex tw-flex-wrap tw-gap-[0.8em]">
          <a
            v-for="link in reading.links"
            :key="link.href"
            class="tw-text-[#e7c7a4] tw-underline tw-underline-offset-[0.18em]"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ link.label }}
          </a>
        </p>
        <ul
          v-if="reading.stack.length"
          class="tw-m-0 tw-flex tw-list-none tw-flex-wrap tw-gap-1.5 tw-p-0"
        >
          <li
            v-for="item in reading.stack"
            :key="item"
            class="tw-rounded-full tw-bg-[#f7f3ea18] tw-px-[0.55em] tw-py-[0.2em] tw-text-[0.75em]"
          >
            {{ item }}
          </li>
        </ul>
        <ProjectNote v-if="notesOpen" bare :id="reading.id" />
      </div>
      <div
        v-if="readingNotes || !handheld"
        class="desk-screen__bar tw-flex tw-items-center tw-justify-between tw-gap-3 tw-border-t tw-border-[#f7f3ea24] tw-px-[0.9em] tw-py-[0.45em]"
      >
        <button
          v-if="readingNotes"
          type="button"
          class="desk-screen__notes tw-cursor-pointer tw-border-0 tw-bg-transparent tw-p-0 tw-text-left tw-font-[inherit] tw-text-[0.92em] tw-leading-snug tw-text-[#e7c7a4] tw-underline tw-underline-offset-[0.18em]"
          @click="notesOpen = !notesOpen"
        >
          {{ notesOpen ? 'Fechar as notas' : 'Notas de como está feito' }}
        </button>
        <p class="desk-screen__hint tw-m-0 tw-ml-auto tw-text-[0.75em] tw-text-[#b7c4bc]">
          E para voltar ao trilho
        </p>
      </div>
    </div>

    <p
      v-if="marinaLine"
      class="tw-pointer-events-none tw-absolute tw-left-1/2 tw-top-[7.4rem] tw-z-[6] tw-m-0 tw-max-w-[min(28rem,calc(100%-2rem))] tw--translate-x-1/2 tw-rounded-full tw-bg-[#f7f3eaf0] tw-px-4 tw-py-2 tw-text-center tw-text-[0.95rem] tw-text-[#17211c] tw-shadow-[0_8px_20px_#17211c24]"
    >
      {{ marinaLine }}
    </p>

    <p
      v-if="atlasLine"
      class="tw-pointer-events-none tw-absolute tw-left-1/2 tw-top-[4.6rem] tw-z-[6] tw-m-0 tw-max-w-[min(28rem,calc(100%-2rem))] tw--translate-x-1/2 tw-rounded-full tw-bg-[#f7f3eaf0] tw-px-4 tw-py-2 tw-text-center tw-text-[0.95rem] tw-text-[#17211c] tw-shadow-[0_8px_20px_#17211c24]"
    >
      {{ atlasLine }}
    </p>

    <form
      v-if="promptOpen"
      class="tw-absolute tw-left-[18px] tw-top-[4.6rem] tw-z-[6] tw-flex tw-w-[min(420px,calc(100%-36px))] tw-flex-col tw-overflow-hidden tw-rounded-2xl tw-bg-[#10241cf2] tw-font-mono tw-text-[0.92rem] tw-text-[#e7f3ea] tw-shadow-[0_16px_40px_#17211c33]"
      @submit.prevent="runCommand"
    >
      <div
        class="tw-flex tw-items-center tw-justify-between tw-border-b tw-border-[#f3efe61a] tw-px-3 tw-py-2"
      >
        <span class="tw-text-[0.72rem] tw-uppercase tw-tracking-[0.14em] tw-text-[#e7c7a4]"
          >Prompt</span
        >
        <button
          type="button"
          class="tw-cursor-pointer tw-border-0 tw-bg-transparent tw-font-[inherit] tw-text-[0.82rem] tw-text-[#e7f3ea] hover:tw-underline"
          @click="promptOpen = false"
        >
          Fechar
        </button>
      </div>
      <div ref="promptLog" class="tw-max-h-40 tw-overflow-auto tw-px-3 tw-py-2 tw-leading-relaxed">
        <p v-for="(line, index) in promptLines" :key="index" class="tw-m-0 tw-whitespace-pre-wrap">
          {{ line }}
        </p>
      </div>
      <label
        class="tw-flex tw-items-center tw-gap-2 tw-border-t tw-border-[#f3efe61a] tw-px-3 tw-py-2"
      >
        <span class="tw-text-[#e7c7a4]">&gt;</span>
        <input
          ref="promptInput"
          v-model="promptLine"
          class="tw-min-w-0 tw-flex-1 tw-border-0 tw-bg-transparent tw-font-[inherit] tw-text-[0.92rem] tw-text-[#e7f3ea] tw-outline-none"
          autocomplete="off"
          spellcheck="false"
          aria-label="Código"
        />
      </label>
    </form>

    <div
      class="touch-controls tw-pointer-events-none tw-absolute tw-inset-0 tw-z-[3] tw-hidden max-md:tw-block [@media(pointer:coarse)]:tw-block"
      :class="{ 'touch-controls--off': readingId || baking || sparring || listening }"
      aria-hidden="true"
    >
      <div
        ref="stickBase"
        class="touch-stick tw-pointer-events-auto tw-absolute tw-bottom-[max(0.35rem,env(safe-area-inset-bottom,0px))] tw-right-[max(1rem,env(safe-area-inset-right,0px))] tw-h-32 tw-w-32 tw-touch-none tw-select-none"
        @pointerdown.prevent="onStickDown"
        @pointermove="onStickMove"
        @pointerup="onStickUp"
        @pointercancel="onStickUp"
        @contextmenu.prevent
      >
        <div
          class="tw-absolute tw-inset-0 tw-rounded-full tw-border-2 tw-border-[#17211c33] tw-bg-[#f7f3ea99] tw-shadow-[inset_0_0_0_18px_#17211c0f]"
        />
        <div
          class="touch-knob tw-absolute tw-left-1/2 tw-top-1/2 tw-h-14 tw-w-14 tw-rounded-full tw-bg-[#f7f3eaf5] tw-shadow-[0_6px_16px_#17211c33]"
          :style="knobStyle"
        />
      </div>
      <button
        type="button"
        class="touch-run tw-pointer-events-auto tw-absolute tw-bottom-[max(7.4rem,calc(env(safe-area-inset-bottom,0px)+7rem))] tw-left-[max(1.35rem,env(safe-area-inset-left,0px))] tw-h-16 tw-w-16 tw-cursor-pointer tw-select-none tw-rounded-full tw-border-0 tw-font-[inherit] tw-text-[0.82rem] tw-text-[#17211c] tw-touch-none tw-shadow-[0_8px_20px_#17211c24]"
        :class="runHeld ? 'tw-bg-white' : 'tw-bg-[#f7f3eaf0]'"
        @pointerdown.prevent="onRunDown"
        @pointerup="hold('Shift', false)"
        @pointercancel="hold('Shift', false)"
        @contextmenu.prevent
      >
        Correr
      </button>
      <button
        type="button"
        class="touch-jump tw-pointer-events-auto tw-absolute tw-bottom-[max(0.35rem,env(safe-area-inset-bottom,0px))] tw-left-[max(1rem,env(safe-area-inset-left,0px))] tw-h-24 tw-w-24 tw-cursor-pointer tw-select-none tw-rounded-full tw-border-0 tw-font-[inherit] tw-text-[0.95rem] tw-text-[#17211c] tw-touch-none tw-shadow-[0_8px_20px_#17211c24]"
        :class="jumpHeld ? 'tw-bg-white' : 'tw-bg-[#f7f3eaf0]'"
        @pointerdown.prevent="onJumpDown"
        @pointerup="hold(' ', false)"
        @pointercancel="hold(' ', false)"
        @contextmenu.prevent
      >
        Saltar
      </button>
    </div>

    <Teleport to="body">
      <div
        v-if="showRotatePrompt"
        class="tw-fixed tw-inset-0 tw-z-[10000] tw-flex tw-items-center tw-justify-center tw-bg-[#17211ce6] tw-p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rotate-title"
      >
        <div
          class="tw-w-[min(360px,100%)] tw-rounded-[22px] tw-bg-[#f7f3eaf0] tw-p-6 tw-text-center tw-shadow-[0_16px_40px_#17211c1f]"
        >
          <div class="phone-hint" aria-hidden="true">
            <span class="phone-hint__body" />
          </div>
          <p class="tw-mb-2 tw-text-[0.72rem] tw-uppercase tw-tracking-[0.12em] tw-text-[#8a4632]">
            Orientação
          </p>
          <h2
            id="rotate-title"
            class="tw-m-0 tw-font-[Fraunces,Georgia,serif] tw-text-[clamp(1.55rem,2vw,2rem)] tw-font-[560] tw-leading-[1.05] tw-tracking-[-0.03em]"
          >
            Roda o telemóvel
          </h2>
          <p class="tw-mt-3 tw-leading-[1.45]">
            O trilho vê-se melhor na horizontal. Se o ecrã não rodar, a jornada vira sozinha.
          </p>
          <button
            type="button"
            class="tw-mt-5 tw-w-full tw-cursor-pointer tw-rounded-full tw-border-0 tw-bg-[#0e3328] tw-px-4 tw-py-3 tw-font-[inherit] tw-text-[0.95rem] tw-text-[#f7f3ea] hover:tw-bg-[#17211c] focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-[3px] focus-visible:tw-outline-[#0e3328]"
            @click="continueInLandscape"
          >
            Continuar
          </button>
          <RouterLink
            class="tw-mt-4 tw-inline-block tw-text-[0.92rem] tw-text-[#0e3328] tw-underline tw-underline-offset-[0.18em]"
            to="/"
          >
            Voltar ao portefólio
          </RouterLink>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { TresCanvas } from '@tresjs/core'
import { passageById, steps } from '@/data/journey'
import { noteBlocks } from '@/data/notes'
import { screenFrame } from '@/game/computer'
import { ensureAmbience, setAmbienceMuted, stopAmbience } from '@/game/ambience'
import { atelierNear, baking, enterAtelier, leaveAtelier } from '@/game/cake'
import { releaseHikeKeys, setHikeKey, setHikeStick, type HikeKey } from '@/game/controls'
import { journeyTurned, toStageDelta } from '@/game/orientation'
import { askPenalty, penalty } from '@/game/pitch'
import { askPunch, enterRing, leaveRing, ringNear, sparring } from '@/game/ring'
import { enterVinyl, leaveVinyl, listening, vinylNear } from '@/game/vinyl'
import Discos from './Discos.vue'
import GiraDiscos from './GiraDiscos.vue'
import {
  atlasLine,
  callScooter,
  dismissScooter,
  marinaLine,
  mountScooter,
  ridingScooter,
  scooterNear,
  terminalOpen,
} from '@/game/spot'
import ProjectNote from '@/components/ProjectNote.vue'
import Bolo from './Bolo.vue'
import JourneyMap from './JourneyMap.vue'
import Atlas from './Atlas.vue'
import Atelier from './Atelier.vue'
import Campo from './Campo.vue'
import Capela from './Capela.vue'
import Montanha from './Montanha.vue'
import Montanhista from './Montanhista.vue'
import Ringue from './Ringue.vue'
import Trotinete from './Trotinete.vue'

const menuOpen = ref(false)
const promptOpen = ref(false)
const promptLine = ref('')
const promptLines = ref<string[]>(['Escreve um código e carrega em Enter.'])
const promptInput = ref<HTMLInputElement | null>(null)
const promptLog = ref<HTMLElement | null>(null)
const activeId = ref<string | null>(null)
const readingId = ref<string | null>(null)
const notesOpen = ref(false)
const started = ref(false)
const cardOpen = ref(false)
const seen = ref<string[]>([])
const hiker = ref<{ reset: () => void } | null>(null)

const passage = computed(() => (activeId.value ? passageById[activeId.value] : null))
const reading = computed(() => (readingId.value ? passageById[readingId.value] : null))
const readingNotes = computed(() => (reading.value ? noteBlocks(reading.value.id).length > 0 : false))

watch(readingId, () => {
  notesOpen.value = false
})
const soundOn = ref(true)

function toggleSound() {
  soundOn.value = !soundOn.value
  setAmbienceMuted(!soundOn.value)
}

function onAmbienceGesture(event: Event) {
  const target = event.target
  if (target instanceof Element && target.closest('[data-mute]')) return
  ensureAmbience()
}
const penaltyBanner = computed(() => {
  if (penalty.call === 'golo') return 'GOLO!'
  if (penalty.call === 'defesa') return 'DEFESA!'
  if (penalty.call === 'trave') return 'TRAVE!'
  return 'FORA!'
})
const shootout = computed(() => {
  const slots = ['', '', '', '', '']
  penalty.shots.forEach((shot, index) => {
    slots[index] = shot
  })
  return slots
})
const projectPrompt = computed(
  () => started.value && passage.value?.kind === 'project' && !readingId.value,
)

function isCurrent(id: string) {
  const current = passage.value?.parentId ?? passage.value?.id
  return current === id
}

function openProject() {
  if (passage.value?.kind !== 'project') return
  readingId.value = passage.value.id
}

function openPrompt() {
  menuOpen.value = false
  promptOpen.value = true
  terminalOpen.value = true
  releaseHikeKeys()
  nextTick(() => promptInput.value?.focus())
}

watch(promptOpen, (open) => {
  terminalOpen.value = open
  if (open) releaseHikeKeys()
})

function runCommand() {
  const raw = promptLine.value.trim()
  promptLine.value = ''
  if (!raw) return
  promptLines.value.push(`> ${raw}`)
  const code = raw.toLowerCase().replace(/\s+/g, ' ')
  if (code === 'del trot') {
    const result = dismissScooter()
    promptLines.value.push(
      result === 'removed'
        ? 'A trotinete saiu do mapa. Escreve trot para a chamar outra vez.'
        : 'Não há trotinete no mapa.',
    )
  } else if (code === 'trot') {
    const result = callScooter()
    promptLines.value.push(
      result === 'spawn'
        ? 'A trotinete ficou à tua frente. Chega-te e carrega em E para subir.'
        : result === 'dismount'
          ? 'Desceste. A trotinete ficou onde a deixaste.'
          : 'A trotinete já está no mapa. Escreve del trot para a tirar.',
    )
    if (result === 'spawn' || result === 'dismount') promptOpen.value = false
  } else {
    promptLines.value.push('Não conheço esse código.')
  }
  nextTick(() => {
    const log = promptLog.value
    if (log) log.scrollTop = log.scrollHeight
  })
}

function onInspectKey(event: KeyboardEvent) {
  ensureAmbience()
  if (event.repeat) return
  const typing =
    event.target instanceof HTMLElement && Boolean(event.target.closest('input, textarea'))
  const key = event.key.toLowerCase()
  if (key === 'escape') {
    if (promptOpen.value) {
      promptOpen.value = false
      return
    }
    if (baking.value) {
      leaveAtelier()
      return
    }
    if (sparring.value) {
      leaveRing()
      return
    }
    if (listening.value) {
      leaveVinyl()
      return
    }
    readingId.value = null
    return
  }
  if (typing) return
  if (key !== 'e') return
  if (baking.value) {
    leaveAtelier()
    return
  }
  if (sparring.value) {
    leaveRing()
    return
  }
  if (listening.value) {
    leaveVinyl()
    return
  }
  if (readingId.value) {
    readingId.value = null
    return
  }
  if (ridingScooter.value) {
    ridingScooter.value = false
    return
  }
  if (ringNear.value && !promptOpen.value) {
    enterRing()
    return
  }
  if (vinylNear.value && !promptOpen.value) {
    enterVinyl()
    return
  }
  if (atelierNear.value && !promptOpen.value) {
    enterAtelier()
    return
  }
  if (scooterNear.value) {
    mountScooter()
    return
  }
  if (penalty.near) {
    askPenalty()
    return
  }
  openProject()
}

function onArrive(id: string | null) {
  activeId.value = id
  if (readingId.value && readingId.value !== id) readingId.value = null
  if (!id) return
  const stepId = passageById[id].parentId ?? id
  if (!seen.value.includes(stepId)) seen.value = [...seen.value, stepId]
}

function railClass(id: string) {
  if (isCurrent(id)) return 'tw-font-semibold tw-text-[#0e3328]'
  if (seen.value.includes(id)) return 'tw-text-[#17211c]'
  return ''
}

function backToStart() {
  readingId.value = null
  leaveAtelier()
  leaveRing()
  leaveVinyl()
  hiker.value?.reset()
}

function chooseStart() {
  menuOpen.value = false
  backToStart()
}

const stickBase = ref<HTMLElement | null>(null)
const stickOffset = ref({ x: 0, y: 0 })
const jumpHeld = ref(false)
const runHeld = ref(false)
let stickPointer: number | null = null

const STICK_DEADZONE = 0.18

const knobStyle = computed(() => ({
  transform: `translate(calc(-50% + ${stickOffset.value.x}px), calc(-50% + ${stickOffset.value.y}px))`,
}))

function hold(key: HikeKey, down: boolean) {
  if (key === ' ') jumpHeld.value = down
  if (key === 'Shift') runHeld.value = down
  setHikeKey(key, down)
}

function onJumpDown(event: PointerEvent) {
  const button = event.currentTarget as HTMLElement
  button.setPointerCapture(event.pointerId)
  hold(' ', true)
}

function onRunDown(event: PointerEvent) {
  const button = event.currentTarget as HTMLElement
  button.setPointerCapture(event.pointerId)
  hold('Shift', true)
}

function onStickDown(event: PointerEvent) {
  const base = event.currentTarget as HTMLElement
  base.setPointerCapture(event.pointerId)
  stickPointer = event.pointerId
  moveStick(event)
}

function onStickMove(event: PointerEvent) {
  if (event.pointerId !== stickPointer) return
  moveStick(event)
}

function onStickUp(event: PointerEvent) {
  if (event.pointerId !== stickPointer) return
  stickPointer = null
  stickOffset.value = { x: 0, y: 0 }
  setHikeStick(0, 0)
}

function moveStick(event: PointerEvent) {
  const base = stickBase.value
  if (!base) return
  const rect = base.getBoundingClientRect()
  const local = toStageDelta(
    event.clientX - (rect.left + rect.width / 2),
    event.clientY - (rect.top + rect.height / 2),
  )
  let dx = local.x
  let dy = local.y
  const reach = Math.max(18, Math.min(rect.width, rect.height) * 0.28)
  const len = Math.hypot(dx, dy)
  if (len > reach) {
    dx = (dx / len) * reach
    dy = (dy / len) * reach
  }
  stickOffset.value = { x: dx, y: dy }

  let nx = dx / reach
  let ny = -dy / reach
  const mag = Math.hypot(nx, ny)
  if (mag < STICK_DEADZONE) {
    setHikeStick(0, 0)
    return
  }
  const scaled = (mag - STICK_DEADZONE) / (1 - STICK_DEADZONE)
  setHikeStick((nx / mag) * scaled, (ny / mag) * scaled)
}

function onBlur() {
  stickPointer = null
  stickOffset.value = { x: 0, y: 0 }
  jumpHeld.value = false
  runHeld.value = false
  releaseHikeKeys()
}

const coarseQuery = window.matchMedia('(pointer: coarse)')
const hoverNoneQuery = window.matchMedia('(hover: none)')
const narrowQuery = window.matchMedia('(max-width: 900px)')
const portraitQuery = window.matchMedia('(orientation: portrait)')
const handheld = ref(false)
const portrait = ref(false)
const promptDismissed = ref(false)
let lockAttempted = false
let weRequestedFullscreen = false
let orientationLocked = false

const showRotatePrompt = computed(() => handheld.value && portrait.value && !promptDismissed.value)

function readPortrait() {
  if (window.innerHeight !== window.innerWidth) return window.innerHeight > window.innerWidth
  const type = screen.orientation?.type
  if (type) return type.startsWith('portrait')
  return portraitQuery.matches
}

function readHandheld() {
  const ua = navigator.userAgent
  const iPadOs = /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1
  const mobileUa = /Android|iPhone|iPod|Mobile/i.test(ua) || iPadOs
  const touch = navigator.maxTouchPoints > 0 || coarseQuery.matches || hoverNoneQuery.matches
  const narrow = narrowQuery.matches || window.innerWidth <= 900
  return mobileUa || (touch && narrow)
}

function onMediaChange() {
  handheld.value = readHandheld()
  portrait.value = readPortrait()
  if (!portrait.value) {
    journeyTurned.value = false
    promptDismissed.value = false
    lockAttempted = false
  }
}

onMediaChange()

watch(started, (value) => {
  if (value && handheld.value) cardOpen.value = false
})

watch(activeId, (id, previous) => {
  if (handheld.value && id && id !== previous) cardOpen.value = false
})

function tryLockLandscape() {
  const root = document.documentElement
  let pending: Promise<unknown> = Promise.resolve()
  if (!document.fullscreenElement && typeof root.requestFullscreen === 'function') {
    weRequestedFullscreen = true
    pending = root.requestFullscreen()
  }
  const attempt = pending
    .then(() => {
      if (!screen.orientation?.lock) return
      return screen.orientation.lock('landscape').then(() => {
        orientationLocked = true
      })
    })
    .then(() => {
      portrait.value = readPortrait()
    })
    .catch(() => {})

  return new Promise<void>((resolve) => {
    const timer = window.setTimeout(() => resolve(), 700)
    void attempt.finally(() => {
      window.clearTimeout(timer)
      resolve()
    })
  })
}

function continueInLandscape() {
  ensureAmbience()
  lockAttempted = true
  promptDismissed.value = true
  void tryLockLandscape().then(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        portrait.value = readPortrait()
        if (portrait.value) journeyTurned.value = true
      })
    })
  })
}

function onLandscapeGesture(event: PointerEvent) {
  if (!handheld.value || portrait.value || lockAttempted) return
  const target = event.target
  if (target instanceof Element && target.closest('a')) return
  lockAttempted = true
  void tryLockLandscape()
}

function releaseOrientation() {
  journeyTurned.value = false
  if (orientationLocked) {
    try {
      screen.orientation.unlock()
    } catch {
      // Unlock throws when the browser already dropped the lock.
    }
    orientationLocked = false
  }
  if (weRequestedFullscreen && document.fullscreenElement) {
    void document.exitFullscreen().catch(() => {})
  }
  weRequestedFullscreen = false
}

watch(journeyTurned, async () => {
  await nextTick()
  window.dispatchEvent(new Event('resize'))
})

function onForeground() {
  if (document.visibilityState === 'visible') ensureAmbience()
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  onMediaChange()
  window.addEventListener('blur', onBlur)
  window.addEventListener('resize', onMediaChange)
  window.addEventListener('orientationchange', onMediaChange)
  window.addEventListener('keydown', onInspectKey)
  coarseQuery.addEventListener('change', onMediaChange)
  hoverNoneQuery.addEventListener('change', onMediaChange)
  narrowQuery.addEventListener('change', onMediaChange)
  portraitQuery.addEventListener('change', onMediaChange)
  screen.orientation?.addEventListener('change', onMediaChange)
  window.visualViewport?.addEventListener('resize', onMediaChange)
  window.addEventListener('pointerdown', onLandscapeGesture, true)
  window.addEventListener('pointerdown', onAmbienceGesture, true)
  window.addEventListener('touchend', onAmbienceGesture, true)
  document.addEventListener('visibilitychange', onForeground)
})

onUnmounted(() => {
  stopAmbience()
  terminalOpen.value = false
  document.body.style.overflow = ''
  window.removeEventListener('blur', onBlur)
  window.removeEventListener('resize', onMediaChange)
  window.removeEventListener('orientationchange', onMediaChange)
  window.removeEventListener('keydown', onInspectKey)
  coarseQuery.removeEventListener('change', onMediaChange)
  hoverNoneQuery.removeEventListener('change', onMediaChange)
  narrowQuery.removeEventListener('change', onMediaChange)
  portraitQuery.removeEventListener('change', onMediaChange)
  screen.orientation?.removeEventListener('change', onMediaChange)
  window.visualViewport?.removeEventListener('resize', onMediaChange)
  window.removeEventListener('pointerdown', onLandscapeGesture, true)
  window.removeEventListener('pointerdown', onAmbienceGesture, true)
  window.removeEventListener('touchend', onAmbienceGesture, true)
  document.removeEventListener('visibilitychange', onForeground)
  onBlur()
  releaseOrientation()
})
</script>

<style scoped>
.journey-turned {
  top: 0;
  left: 100vw;
  left: 100dvw;
  right: auto;
  bottom: auto;
  width: 100vh;
  width: 100dvh;
  height: 100vw;
  height: 100dvw;
  transform: rotate(90deg);
  transform-origin: top left;
}

.penalty-banner {
  pointer-events: none;
  position: absolute;
  left: 50%;
  top: 40%;
  z-index: 5;
  margin: 0;
  transform: translate(-50%, -50%);
  font-family: Fraunces, Georgia, serif;
  font-style: italic;
  font-weight: 700;
  font-size: clamp(3.4rem, 11vw, 7.2rem);
  line-height: 0.9;
  letter-spacing: -0.04em;
  white-space: nowrap;
  color: #f7f7f4;
  -webkit-text-stroke: 8px #143d28;
  paint-order: stroke fill;
  text-shadow: 0 7px 0 #0c2418;
}

.journey-handheld .journey-card {
  top: calc(max(18px, env(safe-area-inset-top, 0px)) + 3.15rem) !important;
  right: auto !important;
  bottom: auto !important;
  left: 0.45rem !important;
  width: min(13.5rem, calc(100% - 6.4rem)) !important;
  max-height: min(32%, 8.5rem) !important;
  padding: 0.45rem 0.6rem !important;
  border-radius: 14px !important;
  font-size: 0.78rem;
  line-height: 1.35;
}

.journey-handheld .journey-card--shut {
  max-height: none !important;
  overflow: hidden !important;
  width: min(11.25rem, 42%) !important;
}

.journey-handheld .journey-card--shut h1 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.journey-handheld .journey-card h1 {
  font-size: 0.98rem !important;
  line-height: 1.12;
}

.journey-handheld .journey-card :is(p, ul) {
  margin-top: 0.35rem !important;
}

.journey-handheld .journey-card ul,
.journey-handheld .desk-help {
  display: none !important;
}

.journey-handheld .hand-help {
  display: block !important;
}

.journey-handheld .play-prompt {
  bottom: max(0.4rem, env(safe-area-inset-bottom, 0px)) !important;
  top: auto !important;
  flex-direction: row !important;
  align-items: center !important;
  gap: 0.35rem !important;
  max-width: min(14rem, calc(100% - 13rem)) !important;
}

.journey-handheld .play-prompt__label:not(.play-prompt__keep) {
  display: none !important;
}

.journey-handheld .play-prompt__keep {
  font-size: 0.75rem !important;
  padding: 0.28rem 0.6rem !important;
  max-width: 9.5rem !important;
  white-space: normal !important;
}

.journey-handheld .scoreboard {
  top: max(0.35rem, env(safe-area-inset-top, 0px)) !important;
}

.journey-handheld .score-side {
  min-width: 4.4rem !important;
  gap: 0 !important;
  padding: 0.28rem 0.55rem !important;
}

.journey-handheld .score-num {
  font-size: 1.35rem !important;
}

.journey-handheld .penalty-banner {
  top: 38%;
  font-size: clamp(2rem, 8vw, 3.1rem);
  -webkit-text-stroke-width: 4px;
}

.journey-handheld :deep(.map-thumb) {
  width: 4.1rem !important;
  height: 4.1rem !important;
  padding: 0.28rem !important;
  border-radius: 0.85rem !important;
}

.journey-handheld :deep(.map-panel) {
  max-height: min(92%, 820px) !important;
  width: min(680px, calc(100% - 0.8rem)) !important;
  padding: 0.75rem !important;
}

.journey-handheld :deep(.map-sheet) {
  height: min(58vh, 480px) !important;
}

.journey-handheld .play-prompt--wide {
  max-width: calc(100% - 1.2rem) !important;
  flex-wrap: wrap;
  justify-content: center;
}

.desk-screen {
  container-type: size;
  font-size: clamp(0.72rem, 3.6cqh, 1.05rem);
}

.journey-handheld .desk-screen {
  font-size: clamp(0.9rem, 4.6cqh, 1.05rem);
}

.journey-handheld .desk-screen__body {
  padding-top: max(
    0.75em,
    calc(max(12px, env(safe-area-inset-top, 0px)) + 3.4rem - var(--screen-top, 0px))
  ) !important;
}

.journey-handheld .desk-screen__close {
  min-width: 44px;
  min-height: 44px;
}

.journey-handheld .desk-screen__bar {
  padding-bottom: max(0.45em, env(safe-area-inset-bottom, 0px));
}

.journey-handheld .desk-screen__notes {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 44px;
}

.journey-handheld .desk-screen__hint {
  display: none;
}

.journey-handheld .desk-screen a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}

.touch-controls--off {
  visibility: hidden;
}

.touch-controls--off * {
  pointer-events: none !important;
}

.journey-handheld .touch-controls {
  display: block !important;
}

.journey-handheld .touch-stick {
  width: 6.15rem !important;
  height: 6.15rem !important;
}

.journey-handheld .touch-knob {
  width: 2.65rem !important;
  height: 2.65rem !important;
}

.journey-handheld .touch-jump {
  width: 4.5rem !important;
  height: 4.5rem !important;
  font-size: 0.82rem !important;
}

.journey-handheld .touch-run {
  width: 3.35rem !important;
  height: 3.35rem !important;
  bottom: max(5.15rem, calc(env(safe-area-inset-bottom, 0px) + 4.85rem)) !important;
  font-size: 0.68rem !important;
}

.journey-handheld :deep(.cake-dock) {
  bottom: max(0.4rem, env(safe-area-inset-bottom, 0px)) !important;
  left: 0.55rem !important;
  right: 0.55rem !important;
  width: auto !important;
  transform: none !important;
  padding: 0.4rem 0.5rem 0.45rem !important;
  border-radius: 16px !important;
}

.journey-handheld :deep(.cake-kicker),
.journey-handheld :deep(.cake-dock__help) {
  display: none !important;
}

.journey-handheld :deep(.cake-dock__top) {
  display: flex !important;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.journey-handheld :deep(.cake-dock__title) {
  margin-top: 0 !important;
  font-size: 0.95rem !important;
  text-align: left !important;
}

.journey-handheld :deep(.cake-dock__leave) {
  padding: 0.28rem 0.7rem !important;
  font-size: 0.78rem !important;
}

.journey-handheld :deep(.cake-steps) {
  flex-wrap: nowrap !important;
  justify-content: flex-start !important;
  gap: 0.35rem !important;
  margin-top: 0.35rem !important;
  overflow-x: auto;
  scrollbar-width: none;
  touch-action: pan-x;
  position: relative;
}

.journey-handheld :deep(.cake-steps)::-webkit-scrollbar {
  display: none;
}

.journey-handheld :deep(.cake-step) {
  flex: none !important;
  padding: 0.28rem 0.6rem !important;
  font-size: 0.75rem !important;
}

.phone-hint {
  display: grid;
  width: 72px;
  height: 72px;
  margin: 0 auto 8px;
  place-items: center;
  animation: phone-turn 2.6s ease-in-out infinite;
}

.phone-hint__body {
  position: relative;
  width: 38px;
  height: 64px;
  border: 2.5px solid #8a4632;
  border-radius: 8px;
}

.phone-hint__body::after {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 50%;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #8a4632;
  transform: translateX(-50%);
}

@keyframes phone-turn {
  0%,
  18% {
    transform: rotate(0deg);
  }
  48%,
  78% {
    transform: rotate(-90deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .phone-hint {
    animation: none;
    transform: rotate(-90deg);
  }
}
</style>
