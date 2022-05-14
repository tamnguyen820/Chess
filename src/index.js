import { createApp } from "vue"
import App from "./App.vue"
import { store } from "./store/store.js"
import { router } from "./router/router.js"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBr5xmmo-Blu6TCbfizQl9NVgfD-UmWZwg",
  authDomain: "vchess-51049.firebaseapp.com",
  projectId: "vchess-51049",
  storageBucket: "vchess-51049.appspot.com",
  messagingSenderId: "696319900717",
  appId: "1:696319900717:web:88215f3c6ab3c92d9fcca4",
  measurementId: "G-W1P0NT1FVD"
};

initializeApp(firebaseConfig)

const app = createApp(App)

app.use(store)
app.use(router)

app.mount('#app')
