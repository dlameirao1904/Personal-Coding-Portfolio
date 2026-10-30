<template>
  <div class="tw-min-h-screen tw-bg-[#f3efe6] tw-font-[Outfit,Lato,sans-serif] tw-text-[#17211c]">
    <header
      class="tw-sticky tw-top-0 tw-z-[5] tw-flex tw-flex-wrap tw-items-center tw-gap-x-3 tw-gap-y-2 tw-border-b tw-border-[#17211c14] tw-bg-[#f3efe6e6] tw-px-[1.1rem] tw-py-[0.85rem] tw-backdrop-blur-[14px] md:tw-flex-nowrap md:tw-gap-6 md:tw-px-[6vw]"
    >
      <a
        class="tw-shrink-0 tw-whitespace-nowrap tw-font-[Fraunces,Georgia,serif] tw-text-[1.05rem] tw-text-[inherit] tw-no-underline hover:tw-underline hover:tw-underline-offset-[0.18em] focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-[3px] focus-visible:tw-outline-[#0e3328] md:tw-text-[1.15rem]"
        href="#topo"
      >
        Diogo Aires
      </a>
      <nav
        class="tw-order-3 tw-flex tw-w-full tw-flex-wrap tw-items-center tw-gap-x-3 tw-gap-y-1 tw-text-[0.82rem] md:tw-order-none md:tw-w-auto md:tw-flex-1 md:tw-flex-nowrap md:tw-gap-5 md:tw-text-[0.95rem]"
      >
        <a
          v-for="item in nav"
          :key="item.href"
          :class="quietLink"
          :href="item.href"
          @click.prevent="scrollTo(item.href)"
        >
          {{ item.label }}
        </a>
      </nav>
      <RouterLink :class="pill" to="/jornada">Jornada</RouterLink>
    </header>

    <main>
      <section
        id="topo"
        class="tw-mx-auto tw-w-[min(1120px,calc(100%-2.2rem))] tw-scroll-mt-20 tw-pb-10 tw-pt-12 md:tw-w-[min(1120px,calc(100%-12vw))] md:tw-pb-14 md:tw-pt-[4.5rem]"
      >
        <p class="tw-mb-4 tw-text-[0.75rem] tw-uppercase tw-tracking-[0.16em] tw-text-[#5e6a62]">
          {{ profile.location }} · {{ profile.role }}
        </p>
        <h1
          class="tw-m-0 tw-max-w-[14ch] tw-font-[Fraunces,Georgia,serif] tw-text-[clamp(3.1rem,8vw,6.4rem)] tw-font-[560] tw-leading-[0.94] tw-tracking-[-0.035em]"
        >
          Um percurso de software, lido de duas maneiras.
        </h1>
        <p class="tw-mt-6 tw-max-w-[40rem] tw-text-[1.12rem] tw-leading-[1.55]">
          Software Developer na IOTech e estudante de mestrado em Matemática Computacional na
          Universidade do Minho, no perfil de Criptografia. A licenciatura, também no Minho, em
          Ciências da Computação.
        </p>
        <p class="tw-mt-4 tw-max-w-[40rem] tw-text-[1.12rem] tw-leading-[1.55]">
          O trabalho começou ainda durante o curso, na Micro-Net, e passou pela Aurum Solutions,
          estando atualmente na IOTech.
        </p>

        <p class="tw-mt-4 tw-max-w-[40rem] tw-text-[1.12rem] tw-leading-[1.55]">
          Cresci em Montalegre, entre a serra do Larouco e o rio Cávado. Desde os 16 anos que
          trabalho em restauração e, desde os 23, numa padaria, nas horas vagas e aos fins de
          semana.
        </p>
        <div class="tw-mt-8 tw-flex tw-flex-wrap tw-items-center tw-gap-x-6 tw-gap-y-4">
          <a :class="solid" href="#percurso">Ler o percurso</a>
          <RouterLink :class="quietLink" to="/jornada">Entrar na jornada</RouterLink>
        </div>
        <p
          class="tw-mt-8 tw-flex tw-flex-wrap tw-gap-x-5 tw-gap-y-2 tw-text-[0.92rem] tw-text-[#5e6a62]"
        >
          <span v-for="language in profile.languages" :key="language.name">
            {{ language.name }} · {{ language.level }}
          </span>
        </p>

        <ol
          class="tw-m-0 tw-mt-12 tw-grid tw-list-none tw-grid-cols-1 tw-gap-3 tw-p-0 sm:tw-grid-cols-2 xl:tw-grid-cols-4"
        >
          <li v-for="item in beats" :key="item.href">
            <a
              class="tw-flex tw-h-full tw-flex-col tw-gap-2 tw-rounded-[18px] tw-border tw-border-[#17211c14] tw-bg-[#ffffff73] tw-p-4 tw-text-[inherit] tw-no-underline hover:tw-border-[#0e3328] focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-[3px] focus-visible:tw-outline-[#0e3328]"
              :href="item.href"
              @click.prevent="scrollTo(item.href)"
            >
              <span class="tw-text-[0.72rem] tw-uppercase tw-tracking-[0.14em] tw-text-[#8a4632]">
                {{ item.index }}
              </span>
              <span class="tw-font-[Fraunces,Georgia,serif] tw-text-[1.35rem] tw-font-[560]">
                {{ item.title }}
              </span>
              <span class="tw-text-[0.92rem] tw-leading-normal tw-text-[#3e4a43]">{{
                item.text
              }}</span>
            </a>
          </li>
        </ol>
      </section>

      <div
        class="tw-overflow-hidden tw-border-y tw-border-[#17211c14] motion-reduce:tw-overflow-visible"
      >
        <div
          class="tw-flex tw-w-max tw-animate-marquee motion-reduce:tw-w-auto motion-reduce:tw-animate-none motion-reduce:tw-flex-wrap"
        >
          <p
            v-for="copy in 2"
            :key="copy"
            class="tw-m-0 tw-flex tw-shrink-0 motion-reduce:tw-flex-wrap"
          >
            <span
              v-for="item in marquee"
              :key="`${copy}-${item}`"
              class="tw-px-4 tw-py-3 tw-text-[0.78rem] tw-uppercase tw-tracking-[0.14em] tw-text-[#3e4a43]"
            >
              {{ item }}
            </span>
          </p>
        </div>
      </div>

      <div
        class="tw-mx-auto tw-w-[min(1120px,calc(100%-2.2rem))] md:tw-w-[min(1120px,calc(100%-12vw))]"
      >
        <section id="percurso" class="tw-scroll-mt-20 tw-pb-4 tw-pt-14 md:tw-pt-20">
          <header class="tw-mb-8 tw-grid tw-grid-cols-1 tw-gap-4 md:tw-grid-cols-[4.5rem_1fr]">
            <p
              class="tw-m-0 tw-mt-2 tw-text-[0.75rem] tw-uppercase tw-tracking-[0.16em] tw-text-[#8a918b]"
            >
              01
            </p>
            <div>
              <h2 :class="sectionTitle">Percurso</h2>
              <p
                class="tw-mt-3 tw-max-w-[38rem] tw-text-[1.05rem] tw-leading-normal tw-text-[#3e4a43]"
              >
                A minha formação, percurso profissional e também um pouco de mim.
              </p>
            </div>
          </header>
          <ol class="tw-m-0 tw-list-none tw-p-0">
            <li
              v-for="(step, index) in percurso"
              :id="step.id"
              :key="step.id"
              class="tw-grid tw-scroll-mt-24 tw-grid-cols-1 tw-gap-4 tw-border-t tw-border-[#17211c1f] tw-py-7 md:tw-grid-cols-[11rem_1fr] md:tw-gap-8"
            >
              <div class="tw-flex tw-flex-col tw-gap-1.5 tw-text-[0.92rem] tw-text-[#5e6a62]">
                <span class="tw-text-[0.72rem] tw-uppercase tw-tracking-[0.12em] tw-text-[#8a4632]">
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                <span
                  class="tw-uppercase tw-tracking-[0.12em]"
                  :class="step.kind === 'work' ? 'tw-text-[#8a4632]' : 'tw-text-[#0e3328]'"
                >
                  {{ step.kind === 'education' ? 'Educação' : 'Trabalho' }}
                </span>
                <span>{{ step.period }}</span>
                <span v-if="step.ongoing" class="tw-text-[#0e3328]">atual</span>
              </div>
              <article>
                <h3
                  class="tw-m-0 tw-font-[Fraunces,Georgia,serif] tw-text-[1.7rem] tw-font-[560] tw-leading-[1.05] tw-tracking-[-0.03em]"
                >
                  {{ step.title }}
                </h3>
                <p class="tw-mt-2 tw-text-[#5e6a62]">{{ step.organization }} · {{ step.place }}</p>
                <p v-if="step.relation" class="tw-mt-1 tw-text-[#0e3328]">{{ step.relation }}</p>
                <p class="tw-mt-3 tw-max-w-[40rem] tw-leading-[1.5]">{{ step.summary }}</p>
                <ul
                  v-if="step.stack.length"
                  class="tw-m-0 tw-mt-3 tw-flex tw-list-none tw-flex-wrap tw-gap-1.5 tw-p-0"
                >
                  <li v-for="item in step.stack" :key="item" :class="chip">{{ item }}</li>
                </ul>
              </article>
            </li>
          </ol>
        </section>

        <section id="universidade" class="tw-scroll-mt-20 tw-pb-4 tw-pt-14 md:tw-pt-20">
          <header class="tw-mb-8 tw-grid tw-grid-cols-1 tw-gap-4 md:tw-grid-cols-[4.5rem_1fr]">
            <p
              class="tw-m-0 tw-mt-2 tw-text-[0.75rem] tw-uppercase tw-tracking-[0.16em] tw-text-[#8a918b]"
            >
              02
            </p>
            <div>
              <h2 :class="sectionTitle">Universidade</h2>
              <p
                class="tw-mt-3 tw-max-w-[40rem] tw-text-[1.05rem] tw-leading-normal tw-text-[#3e4a43]"
              >
                Os trabalhos do repositório
                <a
                  :class="quietLink"
                  :href="profile.github + '/University'"
                  target="_blank"
                  rel="noopener noreferrer"
                  >University</a
                >, do primeiro ano ao mestrado. No mestrado, o Vertice é o da pasta local.
              </p>
            </div>
          </header>
          <div class="tw-flex tw-flex-col tw-gap-12">
            <article
              v-for="year in universityYears"
              :key="year.id"
              class="tw-grid tw-grid-cols-1 tw-gap-4 tw-border-t tw-border-[#17211c1f] tw-pt-7 md:tw-grid-cols-[8.5rem_1fr]"
            >
              <p
                class="tw-m-0 tw-text-[0.78rem] tw-uppercase tw-tracking-[0.14em] tw-text-[#8a4632]"
              >
                {{ year.index }} / 04
              </p>
              <div>
                <div class="tw-flex tw-flex-wrap tw-items-end tw-justify-between tw-gap-3">
                  <h3
                    class="tw-m-0 tw-font-[Fraunces,Georgia,serif] tw-text-[clamp(1.8rem,3vw,2.4rem)] tw-font-[560] tw-leading-[1.02]"
                  >
                    {{ year.title }}
                  </h3>
                  <a :class="quietLink" :href="year.href" target="_blank" rel="noopener noreferrer">
                    Pasta no GitHub
                  </a>
                </div>
                <p class="tw-mt-2 tw-max-w-[40rem] tw-text-[#3e4a43]">{{ year.summary }}</p>
                <ul
                  class="tw-m-0 tw-mt-5 tw-grid tw-list-none tw-grid-cols-1 tw-gap-3 tw-p-0 md:tw-grid-cols-2"
                >
                  <li
                    v-for="project in year.projects"
                    :key="project.title"
                    class="tw-rounded-[18px] tw-border tw-border-[#17211c14] tw-bg-[#ffffff73] tw-p-4"
                  >
                    <h4 class="tw-m-0 tw-text-[1.08rem] tw-font-[560] tw-tracking-[-0.02em]">
                      {{ project.title }}
                    </h4>
                    <p class="tw-mt-2 tw-leading-[1.45]">{{ project.summary }}</p>
                    <p
                      v-if="project.note"
                      class="tw-mt-2 tw-text-[0.92rem] tw-leading-[1.45] tw-text-[#5e6a62]"
                    >
                      {{ project.note }}
                    </p>
                    <ul class="tw-m-0 tw-mt-3 tw-flex tw-list-none tw-flex-wrap tw-gap-1.5 tw-p-0">
                      <li v-for="item in project.stack" :key="item" :class="chip">{{ item }}</li>
                    </ul>
                    <p
                      v-if="project.links?.length"
                      class="tw-mb-0 tw-mt-3 tw-flex tw-flex-wrap tw-gap-4"
                    >
                      <a
                        v-for="link in project.links"
                        :key="link.href"
                        :class="quietLink"
                        :href="link.href"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {{ link.label }}
                      </a>
                    </p>
                    <ProjectNote
                      v-if="noteIdForTitle(project.title)"
                      :id="noteIdForTitle(project.title) || ''"
                    />
                  </li>
                </ul>
              </div>
            </article>
          </div>
        </section>

        <section id="projetos" class="tw-scroll-mt-20 tw-pb-4 tw-pt-14 md:tw-pt-20">
          <header class="tw-mb-8 tw-grid tw-grid-cols-1 tw-gap-4 md:tw-grid-cols-[4.5rem_1fr]">
            <p
              class="tw-m-0 tw-mt-2 tw-text-[0.75rem] tw-uppercase tw-tracking-[0.16em] tw-text-[#8a918b]"
            >
              03
            </p>
            <div>
              <h2 :class="sectionTitle">Projetos pessoais</h2>
              <p
                class="tw-mt-3 tw-max-w-[40rem] tw-text-[1.05rem] tw-leading-normal tw-text-[#3e4a43]"
              >
                Coisas feitas fora das cadeiras. O site de Gralhas e o do atelier da Marina estão no
                ar.
              </p>
            </div>
          </header>
          <ol class="tw-m-0 tw-grid tw-list-none tw-grid-cols-1 tw-gap-4 tw-p-0 md:tw-grid-cols-2">
            <li
              v-for="(project, index) in personalProjects"
              :key="project.title"
              class="tw-flex tw-flex-col tw-rounded-[22px] tw-border tw-border-[#17211c14] tw-bg-[#ffffff73] tw-p-5"
            >
              <p
                class="tw-m-0 tw-text-[0.72rem] tw-uppercase tw-tracking-[0.14em] tw-text-[#8a4632]"
              >
                {{ String(index + 1).padStart(2, '0') }} /
                {{ String(personalProjects.length).padStart(2, '0') }}
              </p>
              <h3
                class="tw-m-0 tw-mt-3 tw-font-[Fraunces,Georgia,serif] tw-text-[1.8rem] tw-font-[560] tw-leading-[1.05]"
              >
                {{ project.title }}
              </h3>
              <p class="tw-mt-3 tw-flex-1 tw-leading-[1.5]">{{ project.summary }}</p>
              <ul class="tw-m-0 tw-mt-4 tw-flex tw-list-none tw-flex-wrap tw-gap-1.5 tw-p-0">
                <li v-for="item in project.stack" :key="item" :class="chip">{{ item }}</li>
              </ul>
              <p v-if="project.links?.length" class="tw-mb-0 tw-mt-4 tw-flex tw-flex-wrap tw-gap-4">
                <a
                  v-for="link in project.links"
                  :key="link.href"
                  :class="quietLink"
                  :href="link.href"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ link.label }}
                </a>
              </p>
              <ProjectNote
                v-if="noteIdForTitle(project.title)"
                :id="noteIdForTitle(project.title) || ''"
              />
            </li>
          </ol>
        </section>

        <section id="competencias" class="tw-scroll-mt-20 tw-pb-4 tw-pt-14 md:tw-pt-20">
          <header class="tw-mb-8 tw-grid tw-grid-cols-1 tw-gap-4 md:tw-grid-cols-[4.5rem_1fr]">
            <p
              class="tw-m-0 tw-mt-2 tw-text-[0.75rem] tw-uppercase tw-tracking-[0.16em] tw-text-[#8a918b]"
            >
              04
            </p>
            <div>
              <h2 :class="sectionTitle">Competências</h2>
              <p
                class="tw-mt-3 tw-max-w-[38rem] tw-text-[1.05rem] tw-leading-normal tw-text-[#3e4a43]"
              >
                O que tenho usado no curso e no trabalho.
              </p>
            </div>
          </header>
          <div class="tw-grid tw-grid-cols-1 tw-gap-x-8 tw-gap-y-6 md:tw-grid-cols-2">
            <section v-for="group in skillGroups" :key="group.label">
              <h3 class="tw-m-0 tw-text-base tw-font-[560]">{{ group.label }}</h3>
              <ul class="tw-m-0 tw-mt-3 tw-flex tw-list-none tw-flex-wrap tw-gap-1.5 tw-p-0">
                <li v-for="item in group.items" :key="item" :class="chip">{{ item }}</li>
              </ul>
            </section>
          </div>
          <div class="tw-mt-7 tw-border-t tw-border-[#17211c1f] tw-pt-5">
            <h3 class="tw-m-0 tw-text-base tw-font-[560]">A aprender</h3>
            <ul class="tw-m-0 tw-mt-3 tw-flex tw-list-none tw-flex-wrap tw-gap-1.5 tw-p-0">
              <li v-for="item in learning" :key="item" :class="chip">{{ item }}</li>
            </ul>
          </div>
        </section>

        <section id="pessoal" class="tw-scroll-mt-20 tw-pb-16 tw-pt-14 md:tw-pt-20">
          <header class="tw-mb-8 tw-grid tw-grid-cols-1 tw-gap-4 md:tw-grid-cols-[4.5rem_1fr]">
            <p
              class="tw-m-0 tw-mt-2 tw-text-[0.75rem] tw-uppercase tw-tracking-[0.16em] tw-text-[#8a918b]"
            >
              05
            </p>
            <div>
              <h2 :class="sectionTitle">Pessoal</h2>
              <p
                class="tw-mt-3 tw-max-w-[38rem] tw-text-[1.05rem] tw-leading-normal tw-text-[#3e4a43]"
              >
                Turnos, campo, e o que ouço quando fecho o portátil.
              </p>
            </div>
          </header>
          <ol class="tw-m-0 tw-list-none tw-p-0">
            <li
              v-for="(note, index) in personalNotes"
              :key="note.id"
              class="tw-grid tw-grid-cols-1 tw-gap-4 tw-border-t tw-border-[#17211c1f] tw-py-7 md:tw-grid-cols-[11rem_1fr] md:tw-gap-8"
            >
              <div class="tw-flex tw-flex-col tw-gap-1.5 tw-text-[0.92rem] tw-text-[#5e6a62]">
                <span class="tw-text-[0.72rem] tw-uppercase tw-tracking-[0.12em] tw-text-[#8a4632]">
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                <span>{{ note.period }}</span>
              </div>
              <article>
                <h3
                  class="tw-m-0 tw-font-[Fraunces,Georgia,serif] tw-text-[1.7rem] tw-font-[560] tw-leading-[1.05] tw-tracking-[-0.03em]"
                >
                  {{ note.title }}
                </h3>
                <p class="tw-mt-3 tw-max-w-[40rem] tw-leading-[1.5]">{{ note.summary }}</p>
              </article>
            </li>
          </ol>
        </section>
      </div>

      <section
        id="jornada"
        class="tw-scroll-mt-20 tw-bg-[#0e3328] tw-px-[1.1rem] tw-py-14 tw-text-[#f3efe6] md:tw-px-[6vw] md:tw-py-20"
      >
        <div class="tw-mx-auto tw-w-[min(1120px,100%)]">
          <p
            class="tw-mb-4 tw-text-[0.75rem] tw-uppercase tw-tracking-[0.16em] tw-text-[#f3efe6c7]"
          >
            06
          </p>
          <h2
            class="tw-m-0 tw-max-w-[16ch] tw-font-[Fraunces,Georgia,serif] tw-text-[clamp(2.4rem,5vw,4.2rem)] tw-font-[560] tw-leading-[0.96] tw-tracking-[-0.035em]"
          >
            O mesmo percurso, a pé.
          </h2>
          <p
            class="tw-mt-4 tw-max-w-[38rem] tw-text-[1.05rem] tw-leading-[1.5] tw-text-[#f3efe6c7]"
          >
            Esta página é a leitura. A jornada é o mesmo caminho num trilho.
          </p>
          <RouterLink
            class="tw-mt-8 tw-inline-flex tw-items-center tw-rounded-full tw-bg-[#f3efe6] tw-px-[1.15rem] tw-py-[0.85rem] tw-text-[#0e3328] tw-no-underline hover:tw-no-underline focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-[3px] focus-visible:tw-outline-[#f3efe6]"
            to="/jornada"
          >
            Entrar na jornada
          </RouterLink>
        </div>
      </section>
    </main>

    <footer
      class="tw-grid tw-grid-cols-1 tw-gap-8 tw-border-t tw-border-[#17211c1a] tw-px-[1.1rem] tw-py-10 md:tw-grid-cols-[1.4fr_1fr_1fr] md:tw-px-[6vw]"
    >
      <div>
        <p class="tw-m-0 tw-font-[Fraunces,Georgia,serif] tw-text-[1.35rem] tw-font-[560]">
          Diogo Aires
        </p>
        <p class="tw-mt-2 tw-max-w-[28rem] tw-italic tw-leading-normal tw-text-[#3e4a43]">
          E pluribus unum.
        </p>
      </div>
      <div>
        <p class="tw-m-0 tw-text-[0.72rem] tw-uppercase tw-tracking-[0.14em] tw-text-[#5e6a62]">
          Saber mais
        </p>
        <ul class="tw-m-0 tw-mt-3 tw-flex tw-list-none tw-flex-col tw-gap-2 tw-p-0">
          <li v-for="item in nav" :key="item.href">
            <a :class="quietLink" :href="item.href" @click.prevent="scrollTo(item.href)">{{
              item.label
            }}</a>
          </li>
          <li><RouterLink :class="quietLink" to="/jornada">Jornada</RouterLink></li>
        </ul>
      </div>
      <div>
        <p class="tw-m-0 tw-text-[0.72rem] tw-uppercase tw-tracking-[0.14em] tw-text-[#5e6a62]">
          Contacto
        </p>
        <ul class="tw-m-0 tw-mt-3 tw-flex tw-list-none tw-flex-col tw-gap-2 tw-p-0">
          <li>
            <a :class="quietLink" :href="`mailto:${profile.email}`">{{ profile.email }}</a>
          </li>
          <li>
            <a :class="quietLink" :href="profile.github" target="_blank" rel="noopener noreferrer">
              {{ profile.githubLabel }}
            </a>
          </li>
          <li>
            <a
              :class="quietLink"
              :href="profile.linkedin"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ profile.linkedinLabel }}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { learning, noteIdForTitle, personalNotes, profile, skillGroups, steps } from '@/data/journey'
import ProjectNote from '@/components/ProjectNote.vue'
import { marquee, personalProjects, universityYears } from '@/data/projects'

const nav = [
  { href: '#percurso', label: 'Percurso' },
  { href: '#universidade', label: 'Universidade' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#competencias', label: 'Competências' },
  { href: '#pessoal', label: 'Pessoal' },
]

const scrollTo = (href: string) => {
  const element = document.querySelector(href)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const percurso = steps.filter((step) => step.kind !== 'personal')

const beats = [
  {
    index: '01',
    title: 'Educação',
    text: 'Licenciatura no Minho e o mestrado a decorrer.',
    href: '#licenciatura',
  },
  {
    index: '02',
    title: 'Trabalho',
    text: 'Micro-Net, Aurum e, agora, a IOTech.',
    href: '#micronet',
  },
  {
    index: '03',
    title: 'Projetos',
    text: 'Universidade, o atelier e o que tenho construído à parte.',
    href: '#projetos',
  },
  {
    index: '04',
    title: 'Pessoal',
    text: 'Restauração, futebol, boxe, leitura e música.',
    href: '#pessoal',
  },
]

const quietLink =
  'tw-shrink-0 tw-whitespace-nowrap tw-text-[inherit] tw-no-underline hover:tw-underline hover:tw-underline-offset-[0.18em] focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-[3px] focus-visible:tw-outline-[#0e3328]'
const pill =
  'tw-ml-auto tw-shrink-0 tw-whitespace-nowrap tw-rounded-full tw-border tw-border-[#17211c33] tw-px-[0.7rem] tw-py-[0.35rem] tw-text-[0.82rem] tw-text-[inherit] tw-no-underline hover:tw-no-underline focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-[3px] focus-visible:tw-outline-[#0e3328] md:tw-text-[0.95rem]'
const solid =
  'tw-inline-flex tw-items-center tw-rounded-full tw-bg-[#0e3328] tw-px-[1.15rem] tw-py-[0.85rem] tw-text-[#f3efe6] tw-no-underline hover:tw-no-underline focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-[3px] focus-visible:tw-outline-[#0e3328]'
const sectionTitle =
  'tw-m-0 tw-font-[Fraunces,Georgia,serif] tw-text-[clamp(2.4rem,5vw,4rem)] tw-font-[560] tw-leading-[0.96] tw-tracking-[-0.035em]'
const chip = 'tw-rounded-full tw-bg-[#0e332812] tw-px-2 tw-py-0.5 tw-text-[0.82rem]'
</script>
