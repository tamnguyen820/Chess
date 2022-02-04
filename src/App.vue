<template>
  <div class="app">
    <!-- <NavSideBar /> -->
    <NavSideBar2 />
    <ChessGame />
  </div>
</template>

<script>
import ChessGame from "./components/ChessGame.vue";
import NavSideBar from "./components/NavSideBar.vue";
import NavSideBar2 from "./components/NavSideBar2.vue";
export default {
  components: { ChessGame, NavSideBar, NavSideBar2 },
};
</script>

<style lang="scss" scoped>
.app {
  display: flex;
}
</style>
