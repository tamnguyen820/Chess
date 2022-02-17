import { createStore } from "vuex";
import { settings } from "./settings.js";
import { game } from "./game.js";
import { engine } from "./engine.js";
import { analysisSettings } from "./analysisSettings.js";

export const store = createStore({
  modules: {
    settings,
    game,
    engine,
    analysisSettings
  }
})