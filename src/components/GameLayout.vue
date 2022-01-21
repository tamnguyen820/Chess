<template>
  <div class="wrapper">
    <div class="main-area">
      <div class="board">
        <slot name="board" />
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
  margin-top: 10px;
  .main-area {
    margin-top: auto;
    margin-bottom: auto;
    margin-right: max(2%, 10px);
  }
  .side-bar {
    height: 100%;
    // min-width: 25vw;
    // max-width: 30vw;
    min-width: 340px;
    min-height: 500px;
    width: 30%;
  }
}
</style>