<template>
  <div class="chess">
    <ChessGame />
  </div>
</template>

<script>
import ChessGame from "./components/ChessGame.vue";
export default {
  components: { ChessGame },
};
</script>

<style  lang="scss" scoped>
.chess {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>