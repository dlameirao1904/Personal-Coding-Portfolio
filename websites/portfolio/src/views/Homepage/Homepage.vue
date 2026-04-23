<template>
  <div style="width: 100vw; height: 100vh; position: absolute; top: 0; left: 0; z-index: 0">
    <Transition name="fade">
      <div v-if="activeSection" class="info-panel">
        <template v-if="activeSection === 'Welcome'">
          <h1>Bem-vindo à Jornada!</h1>
          <p>
            Utiliza as teclas <b>W A S D</b> ou as <b>Setas</b> para navegar pelos trilhos desta
            montanha digital.
          </p>
          <p>Pressiona <b>Espaço</b> para saltar obstáculos.</p>
          <div class="hint">
            <p><b>Dica:</b> Explora as rochas mais altas... há segredos escondidos por lá.</p>
            <p>Boa exploração!</p>
          </div>
        </template>

        <template v-if="activeSection === 'AboutMe'">
          <h1>Sobre Mim</h1>
          <p>
            Olá, eu sou o <b>Diogo</b>. Cresci entre montanhas e acabei por trazer essa resiliência
            para o mundo do desenvolvimento.
          </p>
          <p>
            Sou um "montanhista de código" focado em escalar soluções complexas e desbravar novas
            tecnologias.
          </p>
          <div class="hint">Continua a subir para conheceres o meu perfil!</div>
        </template>

        <template v-if="activeSection === 'Projects'">
          <h1>Trilhos de Código</h1>
          <p>
            Estes são alguns dos projetos que marcaram o meu percurso. Cada um foi uma nova cimeira
            conquistada.
          </p>
          <div class="hint">Explora os detalhes em cada etapa da subida.</div>
        </template>

        <template v-if="activeSection === 'Experience'">
          <h1>Cume da Carreira</h1>
          <p>
            Aqui encontras o registo das expedições que moldaram a minha experiência profissional.
          </p>
          <div class="hint">Parabéns, chegaste ao topo! 🏔️</div>
        </template>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="isInsideTreehouse" class="treehouse-interior">
        <button class="exit-btn" @click="isInsideTreehouse = false">Descer da Árvore</button>

        <h1 class="treehouse-title">Galeria de Experiência</h1>

        <div class="frames-container">
          <div class="polaroid">
            <div class="photo">🚀</div>
            <div class="caption">
              <h3>Empresa X</h3>
              <p>Front-End Developer (2022-2023)</p>
            </div>
          </div>

          <div class="polaroid">
            <div class="photo">💻</div>
            <div class="caption">
              <h3>Agência Y</h3>
              <p>Web Designer (2021-2022)</p>
            </div>
          </div>

          <div class="polaroid">
            <div class="photo">🎓</div>
            <div class="caption">
              <h3>Universidade</h3>
              <p>Licenciatura em Eng. Informática</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <TresCanvas clear-color="#87CEEB" shadows>
      <TresPerspectiveCamera :position="[0, 15, 70]" />
      <OrbitControls :max-polar-angle="Math.PI / 2 - 0.05" :min-distance="5" :max-distance="150" />
      <TresAmbientLight :intensity="1" />
      <TresDirectionalLight :position="[10, 10, 10]" :intensity="2" cast-shadow />

      <Montanha />

      <Montanhista
        @section-changed="handleSectionChange"
        @enter-treehouse="isInsideTreehouse = true"
      />

      <TresMesh :rotation="[-Math.PI / 2, 0, 0]" receive-shadow>
        <TresPlaneGeometry :args="[700, 700]" />
        <TresMeshStandardMaterial color="#22c55e" />
      </TresMesh>
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import Montanhista from './Montanhista.vue'
import Montanha from './Montanha.vue'

const activeSection = ref<string | null>('Welcome')

const isInsideTreehouse = ref(false)

const handleSectionChange = (section: string | null) => {
  if (activeSection.value === 'Welcome' && section === null) return

  activeSection.value = section
}

const handleFirstMove = (e: KeyboardEvent) => {
  const moveKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

  if (moveKeys.includes(e.key) && activeSection.value === 'Welcome') {
    activeSection.value = null
    window.removeEventListener('keydown', handleFirstMove)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleFirstMove)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleFirstMove)
})
</script>

<style scoped>
.info-panel {
  position: absolute;
  top: 20%;
  right: 50px;
  width: 350px;
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 100;
  font-family: sans-serif;
  border-left: 8px solid #166534;
}

.hint {
  font-size: 0.8rem;
  color: #666;
  margin-top: 20px;
  font-style: italic;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.5s,
    transform 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* EASTER EGG CSS */
.treehouse-interior {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  /* Uma cor e textura simples a imitar madeira escura */
  background: radial-gradient(circle, #5d4037 0%, #3e2723 100%);
  z-index: 999; /* Fica por cima de TUDO */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.treehouse-title {
  color: #fff;
  font-family: 'Courier New', Courier, monospace;
  font-size: 3rem;
  margin-bottom: 3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.frames-container {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  justify-content: center;
}

/* O estilo das fotos cravadas na parede */
.polaroid {
  background: white;
  padding: 15px 15px 30px 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  transform: rotate(-3deg);
  transition: transform 0.3s;
  width: 250px;
}

.polaroid:nth-child(even) {
  transform: rotate(4deg);
  margin-top: 20px;
}

.polaroid:hover {
  transform: scale(1.1) rotate(0deg);
  z-index: 10;
  cursor: pointer;
}

.photo {
  background: #eee;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  border: 1px solid #ccc;
}

.caption {
  text-align: center;
  margin-top: 15px;
  font-family: sans-serif;
  color: #333;
}

.caption h3 {
  margin: 0;
  font-size: 1.2rem;
}
.caption p {
  margin: 5px 0 0 0;
  font-size: 0.9rem;
  color: #666;
}

.exit-btn {
  position: absolute;
  top: 30px;
  left: 30px;
  padding: 10px 20px;
  background: #d97706;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.exit-btn:hover {
  background: #b45309;
}
</style>
