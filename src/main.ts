import { createApp } from "vue";
import { registerGlobalShortcut } from "./services/global-shortcut";

import App from "./App.vue";

createApp(App).mount("#app");

void registerGlobalShortcut();
