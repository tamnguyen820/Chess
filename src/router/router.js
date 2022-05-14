import { createWebHistory, createRouter } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";


import Home from "../views/Home.vue"
import SignIn from "../views/SignIn.vue"
import LogIn from "../views/LogIn.vue"
import SignUp from "../views/SignUp.vue"
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
      path: "/sign-up",
      name: "sign-up",
      component: SignUp
    },
    {
      path: "/play",
      name: "play",
      component: ChessGame,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: "/analysis",
      name: "analysis",
      component: Analysis
    },
  ]
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      alert("You are not logged in!");
      next("/");
    }
  } else {
    next();
  }
});

export { router };