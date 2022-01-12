import { createStore } from "vuex";
import { texts } from "./texts.js";

export const store = createStore({
  modules: {
    texts
  }
})