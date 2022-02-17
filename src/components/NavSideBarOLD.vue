<template>
  <nav class="sidebar" id="sidebar" :class="{ close: close }">
    <header>
      <div class="image-text">
        <span class="image">
          <img src="../assets/images/icon/board-games.png" alt="logo" />
        </span>

        <div class="text logo-text">
          <span class="name">VChess</span>
        </div>
      </div>

      <i
        class="bx bx-chevron-right toggle"
        @click="toggleSideBar()"
        id="sidebar-toggle"
      ></i>
    </header>

    <div class="menu-bar">
      <div class="menu">
        <ul class="menu-links">
          <li class="nav-link">
            <a href="#">
              <i class="bx bx-home-alt icon"></i>
              <span class="text nav-text">Dashboard</span>
            </a>
          </li>

          <li class="nav-link">
            <a href="#">
              <i class="bx bx-bar-chart-alt-2 icon"></i>
              <span class="text nav-text">Revenue</span>
            </a>
          </li>

          <li class="nav-link">
            <a href="#">
              <i class="bx bx-bell icon"></i>
              <span class="text nav-text">Notifications</span>
            </a>
          </li>

          <li class="nav-link">
            <a href="#">
              <i class="bx bx-pie-chart-alt icon"></i>
              <span class="text nav-text">Analytics</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="bottom-content">
        <li class="">
          <a href="#">
            <i class="bx bx-log-out icon"></i>
            <span class="text nav-text">Logout</span>
          </a>
        </li>

        <li class="mode">
          <div class="sun-moon">
            <i class="bx bx-moon icon moon"></i>
            <i class="bx bx-sun icon sun"></i>
          </div>
          <span class="mode-text text">Dark UI</span>

          <div class="toggle-switch" @click="changeMode()">
            <span class="switch"></span>
          </div>
        </li>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      close: true,
    };
  },
  methods: {
    toggleSideBar() {
      this.close = !this.close;
      const navTexts = document.getElementsByClassName("nav-text");
      for (const element of navTexts) {
        element.classList.toggle("d-block");
      }
    },
    changeMode() {
      const body = document.querySelector("body");
      const modeText = body.querySelector(".mode-text");
      body.classList.toggle("dark");
      if (body.classList.contains("dark")) {
        modeText.innerText = "Light UI";
      } else {
        modeText.innerText = "Dark UI";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::selection {
  background-color: var(--primary-color);
  color: #fff;
}

/* ===== Sidebar ===== */
.sidebar {
  position: relative;
  top: 0;
  left: 0;
  width: 240px;
  padding: 10px 14px;
  background: var(--sidebar-color);
  transition: var(--tran-01);
  z-index: 100;
  /* border-radius: 5px; */
}
.sidebar.close {
  width: 88px;
}

/* ===== Reusable code - Here ===== */

.menu-links {
  padding: 0;
  /* overflow: hidden; */
}

.sidebar li {
  height: 50px;
  list-style: none;
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.sidebar header .image,
.sidebar .icon {
  min-width: 60px;
  border-radius: 6px;
}

.sidebar .icon {
  min-width: 60px;
  border-radius: 6px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.sidebar .text,
.sidebar .icon {
  color: var(--text-color);
  transition: var(--tran-01);
}

.sidebar .text {
  font-size: 17px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 1;
}
.sidebar.close .text {
  opacity: 0;
}
/* =========================== */

.sidebar header {
  position: relative;
}

.sidebar header .image-text {
  display: flex;
  align-items: center;
  padding-top: 10px;
}
.sidebar header .logo-text {
  display: flex;
  flex-direction: column;
}
header .image-text .name {
  margin-top: 2px;
  font-size: 24px;
  font-weight: 600;
}

.sidebar header .image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar header .image img {
  width: 40px;
  border-radius: 6px;
}

.sidebar header .toggle {
  position: absolute;
  top: 50%;
  right: -30px;
  transform: translateY(-50%) rotate(180deg);
  height: 30px;
  width: 30px;
  background-color: var(--primary-color);
  color: var(--sidebar-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  cursor: pointer;
  transition: var(--tran-01);
}

.nav-text {
  display: none;
}

body.dark .sidebar header .toggle {
  color: var(--text-color);
}

.sidebar.close .toggle {
  transform: translateY(-50%) rotate(0deg);
}

.sidebar .menu {
  margin-top: 20px;
}

.sidebar li a {
  list-style: none;
  height: 100%;
  background-color: transparent;
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  border-radius: 6px;
  text-decoration: none;
  transition: var(--tran-01);
}

.d-block {
  display: block !important;
}

.sidebar li a:hover {
  background-color: var(--primary-color);
}
.sidebar li a:hover .icon,
.sidebar li a:hover .text {
  color: var(--sidebar-color);
}
body.dark .sidebar li a:hover .icon,
body.dark .sidebar li a:hover .text {
  color: var(--text-color);
}

.sidebar .menu-bar {
  height: calc(100% - 55px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* overflow-y: scroll;
  overflow-x: hidden; */
}
.menu-bar::-webkit-scrollbar {
  display: none;
}
.sidebar .menu-bar .mode {
  border-radius: 6px;
  background-color: var(--primary-color-light);
  position: relative;
  transition: var(--tran-01);
}

.menu-bar .mode .sun-moon {
  height: 50px;
  width: 60px;
}

.mode .sun-moon i {
  position: absolute;
}
.mode .sun-moon i.sun {
  opacity: 0;
}
body.dark .mode .sun-moon i.sun {
  opacity: 1;
}
body.dark .mode .sun-moon i.moon {
  opacity: 0;
}

.menu-bar .bottom-content .toggle-switch {
  position: absolute;
  right: 0;
  height: 100%;
  min-width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
}
.toggle-switch .switch {
  position: relative;
  height: 22px;
  width: 40px;
  border-radius: 25px;
  background-color: var(--toggle-color);
  transition: var(--tran-01);
}

.switch::before {
  content: "";
  position: absolute;
  height: 15px;
  width: 15px;
  border-radius: 50%;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  background-color: var(--sidebar-color);
  transition: var(--tran-01);
}

body.dark .switch::before {
  left: 20px;
}

.sidebar.close ~ {
  left: 78px;
  // height: 100vh;
  width: calc(100% - 78px);
}
body.dark .text {
  color: var(--text-color);
}

@media (max-width: 50rem) {
  .sidebar.close {
    display: none;
  }
  #sidebar-toggle {
    display: flex !important;
  }
}
</style>