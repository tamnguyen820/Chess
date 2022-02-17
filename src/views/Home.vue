<template>
  <div class="home-page">
    <!-- <img class="logo" src="../assets/images/icon/vchess.png" /> -->
    <div class="home-text">
      <div class="text-container">
        <div class="title">vchess</div>
        <div class="subtext">
          a simpler way to
          <router-link :to="{ name: 'play' }">play.</router-link>
        </div>
      </div>
    </div>
    <div class="home-image"></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.home-page {
  height: 100vh;
  width: 100%;
  display: flex;
  z-index: 1;

  .home-text {
    flex-basis: 80%;
    height: 100%;
    padding: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .text-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: brown;
      padding: 4rem 4rem 6rem 4rem;

      * {
        color: var(--off-white);
      }
      .title {
        font-family: "Playfair Display", serif;
        // font-size: 110px;
        font-size: clamp(6.25rem, 8vw, 8rem);
        font-weight: 900;
      }
      .subtext {
        font-family: "DM Serif Text", serif;
        font-size: clamp(1.5rem, 1.6vw, 3rem);
        font-style: italic;
        a {
          font-family: "DM Serif Text", serif;
          font-size: clamp(1.5rem, 1.6vw, 3rem);
          font-weight: 400;
          font-style: italic;
        }
      }
    }
  }
  .home-image {
    flex-basis: 30%;
    height: 100%;
    width: 100%;
    background-image: url("../assets/images/background/person-playing-chess.jpg");
    background-position: right;
    background-size: cover;
    background-repeat: no-repeat;
  }
}

@media (max-width: 50rem) {
  .home-page {
    .home-text {
      flex-basis: 100%;
      background-image: url("../assets/images/background/chess-board.jpg");
      background-position: center;
      background-size: cover;
      padding: 0;
      .text-container {
        align-items: center;
        text-align: center;
        padding: 1rem 1rem 2rem 1rem;
        .title {
          font-size: 80px;
        }
        .subtext {
          font-size: 20px;
          a {
            font-size: 18px;
          }
        }
      }
    }
    .home-image {
      display: none;
    }
  }
}
</style>