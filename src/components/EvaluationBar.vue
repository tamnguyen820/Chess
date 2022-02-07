<template>
  <div
    id="evaluation-bar"
    class="evaluation-bar"
    :class="{ flipped: flipBoard }"
  >
    <div id="evaluation-fill" class="evaluation-fill"></div>
    <span
      id="evaluation-text"
      class="evaluation-text"
      :class="{ flipped: flipBoard }"
      >{{ evaluation }}</span
    >
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  created() {
    this.createEngine(this.fen);
  },
  mounted() {
    this.$nextTick(() => {
      this.setBarHeight(this.boardSize);
    });
  },
  computed: {
    ...mapGetters({
      boardSize: "settings/getBoardSize",
      flipBoard: "settings/getFlipBoard",

      fen: "game/getFen",
      turn: "game/getTurn",
      draw: "game/isDraw",

      getEval: "engine/getEval",
      pv: "engine/getPv",
    }),
    evaluation() {
      if (this.draw) {
        this.updateEvaluationBar(this.turn, "cp", 0);
        return "0.0";
      }
      var evaluation = this.getEval;
      var result = "";
      var type = evaluation.evalType;
      var score = parseInt(evaluation.evalScore, 10);
      if (this.turn === "b") {
        score *= -1;
      }
      this.updateEvaluationBar(this.turn, type, score);
      score = Math.abs(score);
      if (type === "mate") {
        if (score === 0) {
          // Game is won
          if (this.turn === "b") {
            result = "1-0";
          } else {
            result = "0-1";
          }
        } else {
          // Forced mate in future
          result = "M" + score;
        }
      } else {
        const cp = Math.round(score / 10) / 10;
        result = cp;
        if (cp === 0) {
          result = "0.0";
        }
      }
      return result;
    },
  },
  watch: {
    fen(newValue) {
      this.loadFen(newValue);
      this.evaluate();
    },
    boardSize(newValue) {
      this.setBarHeight(newValue);
    },
  },
  methods: {
    ...mapMutations({
      createEngine: "engine/createEngine",
      loadFen: "engine/loadFen",
      evaluate: "engine/evaluate",
    }),
    setBarHeight(height) {
      const bar = document.getElementById("evaluation-bar");
      bar.style.setProperty("--bar-height", `${height}px`);
      bar.style.setProperty("--bar-width", `${Math.round(height * 0.05)}px`);
    },
    updateEvaluationBar(turn, type, score) {
      this.setEvaluationTextPos(turn, type, score);
      this.$nextTick(() => {
        const fill = document.getElementById("evaluation-fill");

        // Mate: full bar
        if (type === "mate") {
          if (score === 0) {
            if (turn === "b") {
              fill.style.setProperty("--fill-height", "100%");
            } else {
              fill.style.setProperty("--fill-height", "0%");
            }
            return;
          }
          if (score > 0) {
            fill.style.setProperty("--fill-height", "100%");
          } else {
            fill.style.setProperty("--fill-height", "0%");
          }
          return;
        }

        // Hard winning: most of bar
        if (score > 900) {
          score = 900;
        }
        if (score < -900) {
          score = -900;
        }

        // Regular situations
        var fillHeight = 50 + score / 20;
        fill.style.setProperty("--fill-height", `${fillHeight}%`);
      });
    },
    setEvaluationTextPos(turn, type, score) {
      this.$nextTick(() => {
        const text = document.getElementById("evaluation-text");
        if (
          (type === "cp" && score >= 0) ||
          (type === "mate" && score > 0) ||
          (turn === "mate" && score === 0 && turn === "w")
        ) {
          // White is better or even
          text.style.setProperty("--text-color", "#403d39");
          text.style.setProperty("--text-top", "unset");
          text.style.setProperty("--text-bottom", "2%");
        } else {
          // Black is better
          text.style.setProperty("--text-color", "white");
          text.style.setProperty("--text-top", "2%");
          text.style.setProperty("--text-bottom", "unset");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$black-color: #403d39;
$white-color: white;

.evaluation-bar {
  --bar-height: 800px;
  --bar-width: 25px;

  min-height: 200px;
  min-width: 10px;
  height: var(--bar-height);
  width: var(--bar-width);
  background-color: $black-color;
  overflow: hidden;
  border-radius: 3px;
  // outline: 0.5px solid $white-color;
  position: relative;
  display: flex;
  align-items: flex-end;

  .evaluation-fill {
    width: 100%;
    height: var(--fill-height);
    background: $white-color;
    // border-radius: 3px 3px 0 0;
    transition: var(--tran-04);
  }

  .evaluation-text {
    position: absolute;
    white-space: pre;
    color: var(--text-color);
    top: var(--text-top);
    bottom: var(--text-bottom);
    left: 50%;
    transform: translate(-50%, 0);
    font-size: calc(var(--bar-width) * 0.4);
    font-weight: 600;
    &.flipped {
      transform: translate(-50%, 0) rotate(180deg);
    }
  }
}

.flipped {
  transform: rotate(180deg);
}
</style>