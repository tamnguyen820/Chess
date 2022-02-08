import { createWebHistory, createRouter } from "vue-router";

import Home from "../views/Home.vue"
import ChessGame from "../components/ChessGame.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/home",
      name: "home",
      component: Home,
      alias: "/"
    },
    {
      path: "/play",
      name: "play",
      component: ChessGame
    }
  ]
});

export { router };