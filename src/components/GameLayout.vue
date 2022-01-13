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
.wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 100%;
  width: 100%;
  .main-area {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    // width: 68%;
    margin-right: max(2%, 10px);
    .player {
      height: 5%;
      background-color: blue;
    }
  }
  .side-bar {
    height: 100%;
    // min-width: 25vw;
    // max-width: 30vw;
    min-width: 200px;
    min-height: 400px;
    width: 30%;
  }
}
</style>