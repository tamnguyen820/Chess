<template>
  <div class="side-bar">
    <div class="header-area">
      <div class="side-button-container">
        <button
          v-if="analysisMode"
          class="setting-bar"
          @click="setAnalysisModalOpen(true)"
        >
          <img src="../assets/images/icon/setting-bar.svg" />
        </button>
        <button
          v-if="analysisMode"
          class="import"
          @click="setImportModalOpen(true)"
        >
          <img src="../assets/images/icon/upload.svg" />
        </button>
      </div>
      <button class="flip-board" @click="setFlipBoard">
        <img class="flip-icon" src="../assets/images/icon/flip2.svg" />
      </button>
      <div class="player-area" :class="{ 'flipped-col': flipBoard }">
        <div class="player" v-for="(player, index) in players" :key="index">
          <img
            class="avatar"
            src="../assets/images/avatar/default_avatar_k.png"
          />
          <div class="player-info">
            <div class="name">{{ player.name }}</div>
            <div class="capture-area">
              <div v-for="p in getCaptureInfo(player.side)" :key="p[0]">
                <div v-if="p[1]" class="capture-block">
                  <div
                    class="captured-piece-wrapper"
                    v-for="index in p[1]"
                    :key="p[0] + index"
                  >
                    <img
                      draggable="false"
                      class="captured-piece"
                      :src="'../assets/images/captured/' + p[0] + '.svg'"
                    />
                  </div>
                </div>
              </div>
              <div
                v-if="advantage && advantage.side === player.side"
                class="advantage"
              >
                +{{ advantage.value }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="opening">
      <div>
        <span :v-if="opening.eco">{{ opening.eco }}</span>
        {{ opening.name }}
      </div>
    </div>
    <div class="turn-area scroll-area" id="scroll-turn">
      <div
        class="turn"
        v-for="turn in shortHistory"
        :key="turn.num"
        :id="'turn' + turn.num"
      >
        <div class="turn-num">{{ turn.num }}.</div>
        <div class="moves">
          <div class="move" v-for="(move, index) in turn.moves" :key="index">
            <span
              :class="{
                highlight:
                  turn.num === highlight.turn && index === highlight.index,
              }"
              @click="reviewMove(turn.num, index)"
              >{{ move }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="button-area">
      <button @click="goBack(1)" class="move-button">
        <img
          draggable="false"
          class="arrow-icon"
          src="../assets/images/icon/chevron-back-outline.svg"
        />
      </button>
      <button @click="goForward(1)" class="move-button">
        <img
          draggable="false"
          class="arrow-icon"
          src="../assets/images/icon/chevron-forward-outline.svg"
        />
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  created() {
    this.setHighlight(this.lastMoveIndex);
  },
  props: {
    analysisMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      highlight: { turn: 1, index: -1 },
      // players: [
      //   { name: "Random noob", side: "b" },
      //   { name: "Gotham sub", side: "w" },
      // ],
    };
  },
  computed: {
    ...mapGetters({
      lastMoveIndex: "game/getLastMoveIndex",
      history: "game/getShortGameHistory",
      openingInfo: "game/getOpeningInfo",
      getCaptureInfo: "game/getCaptureInfo",
      getMaterialAdvantage: "game/getMaterialAdvantage",
      isInReview: "game/isInReview",
      flipBoard: "settings/getFlipBoard",

      getEngineOn: "analysisSettings/getEngineOn",

      players: "game/getPlayersInfo",
    }),
    shortHistory() {
      const turns = [];
      var turnCount = 1;
      var halfMoveCount = 0;
      for (const move of this.history) {
        halfMoveCount++;
        if (halfMoveCount === 2) {
          turns[turnCount - 1].moves.push(move);
          turnCount++;
          halfMoveCount = 0;
        } else {
          turns.push({
            num: turnCount,
            moves: [move],
          });
        }
      }
      return turns;
    },
    opening() {
      if (!this.openingInfo) {
        return { name: "Starting Position" };
      }
      return { eco: this.openingInfo.eco, name: this.openingInfo.name };
    },
    advantage() {
      const score = this.getMaterialAdvantage;
      if (score) {
        const side = score > 0 ? "w" : "b";
        const value = Math.abs(score);
        return { side, value };
      }
      return null;
    },
  },
  watch: {
    lastMoveIndex(newVal) {
      this.setHighlight(newVal);
    },
  },
  methods: {
    ...mapMutations({
      setFlipBoard: "settings/setFlipBoard",
      playGame: "game/playGame",
      goBack: "game/goBack",
      goForward: "game/goForward",

      setAnalysisModalOpen: "analysisSettings/setAnalysisModalOpen",
      setImportModalOpen: "analysisSettings/setImportModalOpen",
    }),
    reviewMove(turn, move) {
      const current = this.highlight;
      const turnDif = turn - current.turn;
      const indexDif = move - current.index;
      if (turnDif || indexDif) {
        const steps = Math.abs(2 * turnDif + indexDif);
        if (turnDif < 0 || (!turnDif && indexDif < 0)) {
          // Go back
          this.goBack(steps);
        } else {
          // Go forward
          this.goForward(steps);
        }
      }
    },
    setHighlight(moveIndex) {
      const idx = moveIndex + 1;
      if (idx > 0) {
        var turn = Math.ceil(idx / 2);
        var index = 0;
        if (idx % 2 === 0) {
          index++;
        }
        this.highlight.turn = turn;
        this.highlight.index = index;
        this.$nextTick(() => {
          const container = document.getElementById("scroll-turn");
          var scrollLocation =
            container.firstElementChild.scrollHeight * (turn - 1);
          const containerHeight = container.clientHeight;
          const scrollHeight = container.scrollHeight;
          if (scrollHeight - scrollLocation >= 0.5 * containerHeight) {
            scrollLocation -= 0.4 * containerHeight;
          }
          container.scrollTop = scrollLocation;
        });
      } else {
        this.highlight.turn = 1;
        this.highlight.index = -1;
      }
    },
  },
};
</script>

<style  lang="scss" scoped>
$background-color: #f0f0f0;

$avatar-size: clamp(2.5rem, 3.5vw, 5rem);

$captured-piece-size: 1rem;

$opening-color: #525150;

$move-underline-color: #72a4d4;
$move-second-background: #f8f8f8;

.side-bar {
  height: 100%;
  width: 100%;
  min-height: 500px;
  background-color: $background-color;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  font-size: clamp(0.7rem, calc($avatar-size/ 3.5), 1rem);

  .header-area {
    // height: 25%;
    flex-basis: 25%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px 0 10px 0;
    position: relative;
    button {
      display: flex;
      align-items: center;
    }
    .side-button-container {
      button {
        border: 0;
        background: none;
        width: calc(0.6 * $avatar-size);
        aspect-ratio: 1;
        position: absolute;
        right: calc(-0.8 * $avatar-size);
        img {
          &:hover {
            cursor: pointer;
          }
        }
      }
      .setting-bar {
        top: calc(0.25 * $avatar-size);
      }
      .import {
        top: calc(1.05 * $avatar-size);
      }
    }
    .flip-board {
      border: 0;
      background: none;
      aspect-ratio: 1;
      margin-left: 10px;
      margin-right: 5px;
      border: 0;
      .flip-icon {
        width: calc(0.4 * $avatar-size);
        aspect-ratio: 1;
        transform: rotate(90deg);
        user-select: none;
        &:hover {
          cursor: pointer;
        }
      }
    }

    .flipped-col {
      flex-direction: column-reverse !important;
    }
    .player-area {
      display: flex;
      flex-direction: column;
      width: 100%;
      .player {
        display: flex;
        margin: 10px 0 10px 0;
        width: 100%;
        .avatar {
          height: $avatar-size;
          width: $avatar-size;
          background-color: white;
          padding: calc($avatar-size/8);
          border-radius: 5px;
        }
        .player-info {
          display: flex;
          flex-wrap: wrap;
          flex-direction: column;
          margin-left: 7.5px;
          width: 100%;
          .name {
            overflow-wrap: break-word;
            font-weight: 600;
          }
          .capture-area {
            display: flex;
            flex-wrap: wrap;
            height: $captured-piece-size;
            overflow-wrap: normal;
            .capture-block {
              display: flex;
              margin-right: calc(0.7 * $captured-piece-size);
              position: relative;
              .captured-piece-wrapper {
                height: calc(1.1 * $captured-piece-size);
                .captured-piece {
                  display: inline-block;
                  height: $captured-piece-size;
                  width: $captured-piece-size;
                  margin-right: calc(-0.35 * $captured-piece-size);
                  user-select: none;
                }
              }
            }
            .advantage {
              margin: auto 0 auto 2px;
              font-weight: 400;
              color: $opening-color;
            }
          }
        }
      }
    }
  }

  .scroll-area {
    height: 100%;
    overflow: auto; // Gecko based
    overflow: overlay; // WebKit + Blink based
    scrollbar-gutter: stable;
  }

  .opening {
    padding: 15px 20px 15px 20px;
    color: $opening-color;
    overflow-wrap: break-word;
    top: 0;
    background-color: white;
    font-weight: 400;
    span {
      font-weight: 600;
    }
  }

  .turn-area {
    // height: 70%;
    flex-basis: 60%;
    flex-grow: 6;
    width: 100%;
    background-color: white;

    .turn {
      display: flex;
      padding: 10px 20px 10px 20px;
      &:nth-child(2n) {
        background-color: $move-second-background;
      }
      .turn-num {
        min-width: 25px;
        flex: 0 0 10%;
        font-weight: 400;
      }
      .moves {
        width: 80%;
        font-weight: 600;
        display: flex;
        .move {
          min-width: 30%;
          flex: 0 0 40%;
          overflow-wrap: break-word;
          span {
            padding: 5px 10px 2px 4px;
            width: max-content;
            &:hover {
              cursor: pointer;
            }
          }
        }
        .highlight {
          background-color: yellow;
          border-bottom: solid 4px $move-underline-color;
        }
      }
    }
  }

  .button-area {
    padding-top: 10px;
    padding-bottom: 10px;
    // height: 14%;
    flex-basis: 15%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .move-button {
      display: inline-flex;
      overflow: hidden;
      min-height: 30px;
      max-height: 100px;
      aspect-ratio: 10/6;
      width: 27%;
      border-radius: 5px;
      background-color: var(--button-color);
      border-style: none;
      box-shadow: 3px 1px var(--button-shadow-color);
      cursor: pointer;
      .arrow-icon {
        margin: auto;
        height: 80%;
      }
      &:hover {
        background-color: var(--button-hover-color);
      }
    }
  }
}

@media (max-width: 50rem) {
  .side-bar {
    max-height: 500px;
  }
}
</style>