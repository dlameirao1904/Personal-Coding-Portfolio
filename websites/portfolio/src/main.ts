/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import './assets/css/main.scss'
// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import Tres from '@tresjs/core'

const app = createApp(App)

registerPlugins(app)
app.use(Tres)

app.mount('#app')
