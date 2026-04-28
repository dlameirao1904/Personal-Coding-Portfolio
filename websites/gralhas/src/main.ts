import App from './App.vue';
import '@/assets/css/main.scss';

// Composables
import { createApp } from 'vue';

// Plugins
import { registerPlugins } from '@/plugins';

const app = createApp(App);

registerPlugins(app);


app.mount('#app');
