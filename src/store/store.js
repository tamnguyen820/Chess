import { createStore } from "vuex";
import { settings } from "./settings.js";
import { game } from "./game.js";

export const store = createStore({
  modules: {
    settings,
    game
  }
})