<template>
  <Board />
</template>

<script>
import { chess } from "./chessgame.js";
import Board from "./Board.vue";
export default {
  created() {
    // chess();
  },
  components: {
    Board,
  },
};
</script>

<style>
</style>