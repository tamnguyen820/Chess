import { createWebHistory, createRouter } from "vue-router";

import Home from "../views/Home.vue"
import SignIn from "../views/SignIn.vue"
import LogIn from "../views/LogIn.vue"
import Analysis from "../views/Analysis.vue"
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
      path: "/log-in",
      name: "profile",
      component: LogIn
    },
    {
      path: "/play",
      name: "play",
      component: ChessGame
    },
    {
      path: "/analysis",
      name: "analysis",
      component: Analysis
    },
  ]
});

export { router };