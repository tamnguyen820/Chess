<template>
  <div class="side-bar">
    <div class="header-area"></div>
    <div class="turn-area scroll-area">
      <div class="turn" v-for="turn in tempMoves" :key="turn.num">
        <div>{{ turn.num }}.</div>
        <div class="moves">
          <div class="move" v-for="move in turn.moves" :key="move">
            {{ move }}
          </div>
        </div>
      </div>
    </div>
    <div class="button-area">
      <button class="move-button">
        <img
          class="arrow-icon"
          src="../assets/images/icon/chevron-back-outline.svg"
        />
      </button>
      <button class="move-button">
        <img
          class="arrow-icon"
          src="../assets/images/icon/chevron-forward-outline.svg"
        />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tempMoves: [
        { num: 1, moves: ["e4", "d5"] },
        { num: 2, moves: ["c3", "Qd6"] },
        { num: 3, moves: ["Bc4", "Nf6"] },
        { num: 3, moves: ["Bc4", "Nf6"] },
        { num: 3, moves: ["Bc4", "Nf6"] },
        { num: 3, moves: ["Bc4", "Nf6"] },
        { num: 3, moves: ["Bc4", "Nf6"] },
        { num: 3, moves: ["Bc4", "Nf6"] },
        { num: 3, moves: ["Bc4", "Nf6"] },
        { num: 3, moves: ["Bc4", "Nf6"] },
        { num: 3, moves: ["Bc4", "Nf6"] },
        { num: 3, moves: ["Bc4", "Nf6"] },
        { num: 3, moves: ["Bc4", "Nf6"] },
        { num: 3, moves: ["Bc4", "Nf6"] },
        { num: 3, moves: ["Bc4", "Nf6"] },
        { num: 3, moves: ["Bc4", "Nf6"] },
        { num: 3, moves: ["Bc4", "Nf6"] },
        { num: 3, moves: ["Bc4", "Nf6"] },
        { num: 4, moves: ["O-O-O+"] },
      ],
    };
  },
};
</script>

<style  lang="scss" scoped>
$background-color: #f0f0f0;

$move-underline-color: #72a4d4;
$move-second-background: #f8f8f8;

$scrollbar-color: rgb(158, 158, 158);

$button-color: #dbd9d7;
$button-shadow-color: #bdbcb8;
$button-hover-color: lightblue;

.side-bar {
  height: 100%;
  width: 100%;
  background-color: $background-color;
  font-family: Arial, Helvetica, sans-serif;
  display: flex;
  flex-direction: column;
  border-radius: 5px;

  .header-area {
    height: 20%;
  }

  ::-webkit-scrollbar {
    width: 7px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: $scrollbar-color;
    border-radius: 10px;
  }
  .scroll-area {
    overflow: auto; // Gecko based
    overflow: overlay; // WebKit + Blink based
    scrollbar-gutter: stable;
  }

  .turn-area {
    font-size: 0.95rem;
    height: 70%;
    width: 100%;
    background-color: white;
    .turn {
      display: flex;
      padding: 10px 0 10px 20px;
      &:nth-child(2n) {
        background-color: $move-second-background;
      }
      .moves {
        width: 100%;
        font-weight: 600;
        display: flex;
        margin-left: 5%;
        .move {
          min-width: 30%;
          flex: 0 0 30%;
          &:hover {
            cursor: pointer;
            text-decoration: underline $move-underline-color;
            text-decoration-thickness: 4px;
          }
        }
      }
    }
  }

  .button-area {
    padding-top: 2.5%;
    padding-bottom: 2.5%;
    height: 10%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .move-button {
      display: inline-flex;
      overflow: hidden;
      height: 60%;
      width: 30%;
      border-radius: 5px;
      background-color: $button-color;
      border-style: none;
      box-shadow: 3px 1px $button-shadow-color;
      .arrow-icon {
        margin: auto;
        height: 80%;
      }
      &:hover {
        cursor: pointer;
        background-color: $button-hover-color;
      }
    }
  }
}
</style>