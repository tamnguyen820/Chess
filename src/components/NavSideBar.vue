<template>
  <div class="nav-container">
    <div class="nav-background" id="nav-background" @click="toggleMenu()"></div>

    <button
      aria-controls="primary-navigation"
      aria-expanded="false"
      class="navigation-control"
      id="navigation-control"
      @click="toggleMenu()"
    >
      <img class="control-image" id="control-image" />
    </button>
    <nav
      id="primary-navigation"
      class="primary-navigation"
      data-visible="false"
    >
      <ul @click="toggleMenu()">
        <li>
          <router-link :to="{ name: 'home' }">Home</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'profile' }">Profile</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'play' }">Play</router-link>
        </li>
        <li>
          <router-link to="/">Puzzles</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'analysis' }">Analysis</router-link>
        </li>
        <li>
          <router-link to="/">Settings</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  methods: {
    toggleMenu() {
      const navBackground = document.getElementById("nav-background");
      const controlImage = document.getElementById("control-image");
      const controlButton = document.getElementById("navigation-control");
      const primaryNav = document.getElementById("primary-navigation");

      const controlImageClasses = controlImage.classList;
      controlImageClasses.toggle("open");
      if (controlImageClasses.contains("open")) {
        controlButton.setAttribute("aria-expanded", "true");
        primaryNav.setAttribute("data-visible", "true");
        navBackground.style.zIndex = 999;
        navBackground.style.background = "rgba(0, 0, 0, 0.4)";
      } else {
        controlButton.setAttribute("aria-expanded", "false");
        primaryNav.setAttribute("data-visible", "false");
        navBackground.style.zIndex = -1;
        navBackground.style.background = "none";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-container {
  padding: 0;
  margin: 0;
  top: 0;
  left: 0;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  position: absolute;
  .nav-background {
    height: 100vh;
    width: 100vw;
    position: absolute;
    background: none;
    z-index: -1;
    transition: var(--tran-03);
  }
  .navigation-control {
    position: fixed;
    z-index: 1001;
    border: 0;
    background: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: clamp(1rem, 2.5vw, 2rem);
    cursor: pointer;
    .control-image {
      aspect-ratio: 1;
      width: clamp(1.75rem, 2.5vw, 3rem);
      content: url("../assets/images/icon/hamburger-menu.svg");
      &.open {
        content: url("../assets/images/icon/close-hamburger-menu.svg");
      }
    }
  }
  .primary-navigation {
    position: fixed;
    z-index: 1000;
    padding-left: clamp(1rem, 2.5vw, 2rem);
    padding-top: clamp(3rem, 7vw, 6rem);
    padding-right: clamp(3rem, 6vw, 6rem);
    background: rgba(112, 60, 26, 0.99);
    width: max-content;
    height: 100vh;
    @supports (backdrop-filter: blur(1rem)) {
      // background: rgba(68, 114, 202, 0.75);
      background: rgba(112, 60, 26, 0.8);
      backdrop-filter: blur(1rem);
    }
    transition: var(--tran-03);
    ul {
      list-style: none;
      li {
        padding-block: clamp(0.5rem, 1vw, 1rem);
      }
    }
    a {
      text-decoration: none;
      color: var(--off-white);
      font-weight: 600;
      font-size: clamp(1.25rem, 2vw, 2rem);
    }
  }
  .primary-navigation[data-visible="false"] {
    transform: translateX(-100%);
  }
  @media (max-width: 50rem) {
    .navigation-control {
      position: absolute;
    }
    .primary-navigation {
      width: 100%;
      text-align: center;
      padding-right: 0;
      padding-left: 0;
    }
    .primary-navigation[data-visible="false"] {
      transform: translateY(-100%);
    }
  }
}
</style>