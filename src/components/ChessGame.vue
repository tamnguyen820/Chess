<template>
  <div class="game-layout">
    <GameLayout>
      <template v-slot:eval-bar>
        <EvaluationBar />
      </template>
      <template v-slot:board>
        <Board />
      </template>
      <template v-slot:side-bar>
        <GameSidebar />
      </template>
    </GameLayout>
  </div>
</template>

<script>
import EvaluationBar from "./EvaluationBar.vue";
import Board from "./Board.vue";
import GameLayout from "./GameLayout.vue";
import GameSidebar from "./GameSidebar.vue";

import { mapGetters, mapMutations } from "vuex";
export default {
  components: {
    Board,
    GameLayout,
    GameSidebar,
    EvaluationBar,
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
  height: 100vh;
  width: 80%;
  margin: auto;
  @media (max-width: 767.98px) {
    height: unset;
    width: 90vw;
  }
}
</style>