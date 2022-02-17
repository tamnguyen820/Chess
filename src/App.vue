<template>
  <div class="app">
    <NavSideBar />
    <router-view />
  </div>
</template>

<script>
import ChessGame from "./components/ChessGame.vue";
import NavSideBar from "./components/NavSideBar.vue";
export default {
  components: { ChessGame, NavSideBar },
};
</script>

<style lang="scss" scoped>
.app {
  display: flex;
}
</style>
