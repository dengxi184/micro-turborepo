// entry
import './public-path';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router.ts';
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';

createApp(App).use(ArcoVue).use(router).mount('#app');
