<template>
  <div class="game-layout">
    <GameLayout>
      <template v-slot:board>
        <Board />
      </template>
      <template v-slot:side-bar>
        <GameSidebar />
      </template>
    </GameLayout>
  </div>
  <!-- <Board /> -->
</template>

<script>
import { chess } from "../store/chessgame.js";
import GameLayout from "./GameLayout.vue";
import GameSidebar from "./GameSidebar.vue";

import { mapGetters, mapMutations } from "vuex";
import Board from "./Board.vue";
export default {
  components: {
    Board,
    GameLayout,
    GameSidebar,
  },
  created() {
    // chess();
    this.createNewGame();
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapMutations({
      createNewGame: "game/createNewGame",
    }),
  },
};
</script>

<style lang="scss" scoped>
.game-layout {
  height: 97vh;
  width: 80vw;
  margin: auto;
}
</style>