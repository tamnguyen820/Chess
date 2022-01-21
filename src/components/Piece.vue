<template>
  <img
    @dragstart="setDragging"
    @dragend="setDragging"
    :draggable="allowDrag"
    class="piece draggable"
    :class="{ dragging: allowDrag && dragging }"
    :src="pieceImage"
  />
</template>

<script>
export default {
  data() {
    return {
      srcURL: "./assets/images/piece/",
      dragging: false,
    };
  },
  props: {
    pieceName: {
      type: String,
      required: true,
    },
    allowDrag: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    pieceTheme() {
      return this.$store.getters["settings/getPieceTheme"];
    },
    pieceImage() {
      const extension = this.pieceTheme === "neo" ? ".png" : ".svg";
      const imageURL =
        this.srcURL + this.pieceTheme + "/" + this.pieceName + extension;
      return imageURL;
    },
  },
  methods: {
    setDragging() {
      this.dragging = !this.dragging;
    },
  },
};
</script>

<style lang="scss" scoped>
.piece {
  background-repeat: no-repeat;
  background-size: 100%;
  width: 100%;
  height: 100%;
  opacity: 1;
}
.draggable {
  cursor: pointer;
  cursor: -moz-pointer;
  cursor: -webkit-pointer;
}
.dragging {
  opacity: 1;
}
</style>