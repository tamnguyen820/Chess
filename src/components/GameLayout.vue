<template>
  <div class="wrapper">
    <div class="main-area">
      <div class="player player-above">
        above
        <slot name="player-above" />
      </div>
      <div class="board">
        <slot name="board" />
      </div>
      <div class="player player-below">
        below
        <slot name="player-below" />
      </div>
    </div>
    <div class="side-bar">
      <slot name="side-bar" />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
// So messed up
// $layout-size: min();
.wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  .main-area {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 68%;
    .player {
      height: 7%;
      background-color: blue;
    }
    .board {
      height: 80%;
    }
  }
  .side-bar {
    height: 100%;
    width: 30%;
  }
}
</style>