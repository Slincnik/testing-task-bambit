import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
import App from "./App.vue";
import "./assets/index.css";
import "vue-toastification/dist/index.css";

createApp(App).use(createPinia()).use(Toast, {}).mount("#app");

