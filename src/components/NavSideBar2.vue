<template>
  <div class="nav-container">
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
          <router-link to="/">Profile</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'play' }">Play</router-link>
        </li>
        <li>
          <router-link to="/">Puzzles</router-link>
        </li>
        <li>
          <router-link to="/">Analysis</router-link>
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
      const controlImage = document.getElementById("control-image");
      const controlButton = document.getElementById("navigation-control");
      const primaryNav = document.getElementById("primary-navigation");

      const controlImageClasses = controlImage.classList;
      controlImageClasses.toggle("open");
      if (controlImageClasses.contains("open")) {
        controlButton.setAttribute("aria-expanded", "true");
        primaryNav.setAttribute("data-visible", "true");
      } else {
        controlButton.setAttribute("aria-expanded", "false");
        primaryNav.setAttribute("data-visible", "false");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-container {
  padding: 0;
  margin: 0;
  overflow: hidden;
  .navigation-control {
    position: fixed;
    z-index: 9001;
    border: 0;
    background: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: clamp(1rem, 2.5vw, 2rem);
    cursor: pointer;
    .control-image {
      aspect-ratio: 1;
      width: clamp(1.5rem, 2.5vw, 3rem);
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
    background: rgba(68, 114, 202);
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
      font-size: clamp(1rem, 2vw, 2rem);
    }
  }
  .primary-navigation[data-visible="false"] {
    transform: translateX(-100%);
  }
  @media (max-width: 767.98px) {
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