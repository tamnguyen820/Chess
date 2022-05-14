<template>
  <div class="signup-container">
    <div class="signup">
      <h1>Sign up</h1>
      <form @submit.prevent="register">
        <div class="text-field">
          <input type="text" required v-model="email" />
          <span></span>
          <label for="">Email</label>
        </div>
        <div class="text-field">
          <input type="password" required v-model="password" />
          <span></span>
          <label for="">Password</label>
        </div>
        <input type="submit" value="Register" tabindex="0" />
        <div class="log-in-link">
          <div><a @click="signInWithGoogle">or Sign in with Google</a></div>
          One of us?
          <span>
            <router-link :to="{ name: 'profile' }">Log in</router-link>
          </span>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { router } from "../router/router.js";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    register() {
      createUserWithEmailAndPassword(getAuth(), this.email, this.password)
        .then((data) => {
          router.push({ name: "home" });
        })
        .catch((error) => {
          alert(error.message);
        });
    },
    signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      signInWithPopup(getAuth(), provider)
        .then((result) => {
          console.log(result.user);
          router.push({ name: "home" });
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.signup-container {
  z-index: 1;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .signup {
    background: white;
    border-radius: 5px;
    width: 35%;
    min-width: 350px;
    max-width: min(100vw, 500px);
    h1 {
      text-align: center;
      padding: 1rem 0;
      border-bottom: 2px solid silver;
    }
    form {
      padding: 0 2.5rem;
      .text-field {
        position: relative;
        border-bottom: 3px solid #adadad;
        margin: 2.1rem 0;
        input {
          width: 100%;
          padding: 0 5px;
          height: 2.5rem;
          font-size: 1rem;
          border: none;
          background: none;
          outline: none;
          &:focus ~ label,
          &:valid ~ label {
            top: -5px;
            color: #2691d9;
          }
          &:focus ~ span::before,
          &:valid ~ span::before {
            width: 100%;
          }
        }
        label {
          position: absolute;
          top: 50%;
          left: 5px;
          color: #adadad;
          transform: translateY(-50%);
          pointer-events: none;
          transition: var(--tran-04);
          font-weight: 500;
        }
        span::before {
          content: "";
          position: absolute;
          top: 2.5rem;
          left: 0;
          width: 0%;
          height: 3px;
          background: #2691d9;
          transition: var(--tran-04);
        }
      }
      input[type="submit"] {
        width: 100%;
        padding-block: 0.75rem;
        border: 0;
        background: #2691d9;
        border-radius: 5px;
        font-size: 1rem;
        color: white;
        font-weight: 700;
        cursor: pointer;
        outline: none;
        &:focus-visible {
          outline: 2px solid #388fe7;
          outline-offset: 2px;
        }
      }
      .log-in-link {
        margin: 2rem 0;
        text-align: left;
        font-size: 1rem;
        color: #666;
        a {
          color: #2691d9;
          text-decoration: none;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>