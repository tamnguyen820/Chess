<template>
  <div
    class="piece"
    :style="{ backgroundImage: 'url(' + pieceImage + ')' }"
  ></div>
</template>

<script>
export default {
  data() {
    return {
      srcURL: "./images/piece/",
    };
  },
  props: {
    setName: {
      type: String,
      default: "neo",
    },
    pieceName: {
      type: String,
      required: true,
    },
  },
  computed: {
    pieceImage() {
      const extension = this.setName === "neo" ? ".png" : ".svg";
      const imageURL =
        this.srcURL + this.setName + "/" + this.pieceName + extension;
      return imageURL;
    },
  },
};
</script>

<style>
.piece {
  background-repeat: no-repeat;
  background-size: 100%;
  width: 12.5%;
  height: 12.5%;
  cursor: pointer;
  cursor: grab;
  cursor: -webkit-grab;
}
</style>