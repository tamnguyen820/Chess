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
    margin-right: max(3%, 15px);
    display: flex;
    .eval-area {
      margin-right: max(2%, 10px);
    }
  }
  .side-bar {
    height: 95%;
    min-width: 220px;
    min-height: 500px;
    width: 30%;
  }
  @media (max-width: 767.98px) {
    flex-direction: column;
  }
}
</style>