<template>
  <div class="game-layout">
    <GameLayout>
      <template v-slot:evalBar>
        <EvaluationBar v-if="analysisMode" />
      </template>
      <template v-slot:board>
        <Board :showSuggestions="analysisMode" />
      </template>
      <template v-slot:sideBar>
        <GameSidebar :analysisMode="analysisMode" />
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
  props: {
    analysisMode: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.createNewGame();
    //     this.loadPGN(
    //       `[Event "Live Chess"]
    // [Site "https://lichess.org/3mLoh2td"]
    // [Date "2022.02.06"]
    // [Round "?"]
    // [White "alzdb2"]
    // [Black "820Drinker"]
    // [Result "0-1"]
    // [WhiteElo "915"]
    // [BlackElo "904"]
    // [Variant "Standard"]
    // [TimeControl "900+10"]
    // [ECO "A20"]
    // [Opening "English Opening: King's English Variation"]
    // [Termination "Unknown"]
    // [Annotator "lichess.org"]

    // 1. c4 e5 { A20 English Opening: King's English Variation } 2. d4 f6 3. Nf3 d6 4. e4 Bg4 5. d5 Bxf3 6. gxf3 Ne7 7. Nc3 a6 8. Be2 g6 9. Be3 f5 10. Qb3 b6 11. f4 Bh6 12. exf5 Nxf5 13. Bd2 Nd4 14. Qd1 exf4 15. b4 Qf6 16. Na4 O-O 17. Bc3 Qg5 18. Qxd4 f3 19. Bf1 Nd7 20. Qh8+ Kf7 21. Qxh7+ Ke8 22. h4 Qe7+ 23. Qxe7+ Kxe7 24. Rg1 Rg8 25. Rg3 Raf8 26. Bd2 Bf4 27. Bxf4 Rxf4 28. O-O-O Ne5 29. h5 Kf6 30. hxg6 Rxg6 31. Rxg6+ Kxg6 32. Re1 Kg5 33. c5 bxc5 34. Nxc5 Rd4 35. Nxa6 Nd3+ 36. Bxd3 Rxd3 37. Nxc7 Rc3+ 38. Kb2 Rxc7 39. Re6 Rb7 40. Kb3 Rb6 41. Kc4 Kf5 42. Re8 Ra6 43. Rf8+ Ke4 44. Kb3 Kxd5 45. Rxf3 Ke4 46. Rf6 Ke5 47. Rh6 Rb6 48. Rh5+ Kd4 49. Ka4 d5 50. Ka5 Rf6 51. b5 Ke4 52. b6 d4 53. b7 Rf8 54. Rh4+ Kd3 55. f4 Ke4 56. Kb6 d3 57. Kc7 d2 58. b8=Q Rxb8 59. Kxb8 d1=Q 60. f5+ Kxf5 61. Rh5+ { Black wins. } 0-1`
    //     );
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapMutations({
      createNewGame: "game/createNewGame",
      loadPGN: "game/loadPGN",
    }),
  },
};
</script>

<style lang="scss" scoped>
.game-layout {
  height: 100vh;
  margin: auto;
  z-index: 1;
  @media (max-width: 50rem) {
    height: unset;
    width: 90vw;
  }
}
</style>