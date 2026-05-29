import { createApp } from "vue";
import { createPinia } from "pinia";
import { PiniaColada } from "@pinia/colada";
import App from "./App.vue";
import "./style.css";
import "./styles/utilities.css";

import { router } from "./router";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(PiniaColada, {
  queryOptions: {
    gcTime: 300_000, // 5MIN
  },
});
app.use(router);
app.mount("#app");
