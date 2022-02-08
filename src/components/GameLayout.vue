<template>
  <div class="wrapper">
    <div class="main-area">
      <div class="eval-area">
        <slot name="eval-bar" />
      </div>
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
  align-items: center;
  height: 100%;
  width: 100%;

  .main-area {
    // margin-top: auto;
    // margin-bottom: auto;
    margin-right: 20px;
    display: flex;
    .eval-area {
      margin-right: 20px;
    }
  }
  .side-bar {
    height: 95%;
    min-width: 220px;
    width: 30%;
  }
  @media (max-width: 767.98px) {
    margin-block: 15%;
    flex-direction: column;
    .main-area {
      margin-right: 0;
    }
    .side-bar {
      margin-top: 20px;
      width: 60%;
    }
  }
}
</style>