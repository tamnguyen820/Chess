<template>
  <div class="board-container">
    <div
      class="board unselectable"
      :style="{ backgroundImage: 'url(' + boardImage + ')' }"
    >
      <Piece pieceName="bR" />
      <Piece pieceName="bN" />
    </div>
  </div>
</template>

<script>
import Piece from "./Piece.vue";

export default {
  components: {
    Piece,
  },
  data() {
    return {
      srcURL: "./images/board/",
    };
  },
  props: {
    theme: {
      type: String,
      default: "neogreen.svg",
    },
  },
  computed: {
    boardImage() {
      const extension = this.theme.substr(this.theme.length - 4);
      var subdir = extension === ".svg" ? "svg/" : "";
      this.boardImg = this.srcURL + subdir + this.theme;
      const imageURL = this.srcURL + subdir + this.theme;
      return imageURL;
    },
  },
};
</script>

<style>
.board-container {
  display: flex;
  justify-content: left;
}

.board {
  background-repeat: no-repeat;
  width: 700px;
  height: 700px;
  display: flex;
}

.unselectable {
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
</style>