import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css';
import scrollReveal from './directives/scrollReveal';

const app = createApp(App);

app.directive('reveal', scrollReveal);

app.mount('#app');
