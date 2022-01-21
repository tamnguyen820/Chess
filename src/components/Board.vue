<template>
  <div class="board-container" id="board-container">
    <!-- Board -->
    <div
      id="board"
      class="board unselectable"
      :class="{ 'flipped-col': flipBoard }"
      :style="{ backgroundImage: 'url(' + boardImage + ')' }"
    >
      <div
        :class="{ 'flipped-row': flipBoard }"
        class="rank"
        v-for="rank in configuration"
        :key="rank"
      >
        <div
          v-for="square in rank"
          :key="square.squareID"
          class="square"
          :class="{
            'drag-enter': square === dragEnterSquare,
            'move-highlight':
              moveHighlights.includes(square.squareID) ||
              (!isInReview && square === startSquare),
            'manual-highlight': manualHighlights[square.squareID],
          }"
          @click="handleClick($event, square)"
          @dragstart="handleDragStart($event, square)"
          @dragenter.prevent="handleDragEnter($event, square)"
          @dragover.prevent
          @dragend.prevent="handleDragEnd($event, square)"
          @drop.prevent="handleDrop($event, square)"
          oncontextmenu="return false;"
          @mousedown="handleMouseDown($event, square)"
          @mouseup="handleMouseUp($event, square)"
        >
          <!-- Coord -->
          <div
            v-if="showCoordinates && coords[square.squareID]"
            class="relative-container"
          >
            <div
              class="coord"
              v-for="coord in coords[square.squareID]"
              :key="coord"
              :class="coord.class"
            >
              {{ coord.letter }}
            </div>
          </div>

          <!-- Hints -->
          <div
            v-if="showLegal && getHints.includes(square.squareID)"
            class="relative-container"
          >
            <div
              :class="square.pieceName ? 'legal-circle-take' : 'legal-circle'"
            ></div>
          </div>

          <!-- Promotion -->
          <div v-if="square === promotionSquare" class="relative-container">
            <div
              class="promotion-options"
              :class="{
                'promotion-options-flipped':
                  (getTurn === 'b' && !flipBoard) ||
                  (getTurn === 'w' && flipBoard),
              }"
            >
              <div
                v-for="option in getPromotionOptions()"
                :key="option"
                class="option"
                @click="makePromotionMove(option)"
              >
                <Piece :pieceName="option" :allowDrag="false" />
              </div>
            </div>
          </div>

          <!-- Piece -->
          <Piece v-if="square.pieceName" :pieceName="square.pieceName" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// TODO:
//  Create animations?
//  Go back and forth between moves? Undo?
//  Computer moves?
//  Sound effects?

//  UI components
//  Refactor board

import { mapGetters, mapMutations } from "vuex";
import Piece from "./Piece.vue";

export default {
  created() {
    this.createBoardModel();
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
    this.resizeBoard(window.innerWidth, window.innerHeight);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  components: {
    Piece,
  },
  data() {
    return {
      srcURL: "./assets/images/board/",
      boardModel: [],
      promotionOptions: ["Q", "N", "R", "B"],
      currentBoardSize: null,
      // New
      dragEnterSquare: null,
      startSquare: null,
      promotionSquare: null,
      manualHighlights: {},
      arrows: [],
    };
  },
  computed: {
    ...mapGetters({
      boardTheme: "settings/getBoardTheme",
      showLegal: "settings/showLegalMoves",
      showCoordinates: "settings/showCoordinates",
      flipBoard: "settings/getFlipBoard",

      getBoard: "game/getBoard",
      getLegalMoves: "game/getLegalMoves",
      getTurn: "game/getTurn",
      getLastMove: "game/getLastMove",
      isInReview: "game/isInReview",
    }),

    coords() {
      const coords = {
        a8: [{ letter: "8", class: "coord-rank coord-light" }],
        a7: [{ letter: "7", class: "coord-rank coord-dark" }],
        a6: [{ letter: "6", class: "coord-rank coord-light" }],
        a5: [{ letter: "5", class: "coord-rank coord-dark" }],
        a4: [{ letter: "4", class: "coord-rank coord-light" }],
        a3: [{ letter: "3", class: "coord-rank coord-dark" }],
        a2: [{ letter: "2", class: "coord-rank coord-light" }],
        a1: [
          { letter: "1", class: "coord-rank coord-dark" },
          { letter: "a", class: "coord-file coord-dark" },
        ],
        b1: [{ letter: "b", class: "coord-file coord-light" }],
        c1: [{ letter: "c", class: "coord-file coord-dark" }],
        d1: [{ letter: "d", class: "coord-file coord-light" }],
        e1: [{ letter: "e", class: "coord-file coord-dark" }],
        f1: [{ letter: "f", class: "coord-file coord-light" }],
        g1: [{ letter: "g", class: "coord-file coord-dark" }],
        h1: [{ letter: "h", class: "coord-file coord-light" }],
      };
      const coordsFlipped = {
        a8: [{ letter: "a", class: "coord-file coord-light" }],
        b8: [{ letter: "b", class: "coord-file coord-dark" }],
        c8: [{ letter: "c", class: "coord-file coord-light" }],
        d8: [{ letter: "d", class: "coord-file coord-dark" }],
        e8: [{ letter: "e", class: "coord-file coord-light" }],
        f8: [{ letter: "f", class: "coord-file coord-dark" }],
        g8: [{ letter: "g", class: "coord-file coord-light" }],
        h8: [
          { letter: "8", class: "coord-rank coord-dark" },
          { letter: "h", class: "coord-file coord-dark" },
        ],
        h7: [{ letter: "7", class: "coord-rank coord-light" }],
        h6: [{ letter: "6", class: "coord-rank coord-dark" }],
        h5: [{ letter: "5", class: "coord-rank coord-light" }],
        h4: [{ letter: "4", class: "coord-rank coord-dark" }],
        h3: [{ letter: "3", class: "coord-rank coord-light" }],
        h2: [{ letter: "2", class: "coord-rank coord-dark" }],
        h1: [{ letter: "1", class: "coord-rank coord-light" }],
      };
      return this.flipBoard ? coordsFlipped : coords;
    },

    boardImage() {
      const extension = this.boardTheme.substr(this.boardTheme.length - 4);
      var subdir = extension === ".svg" ? "svg/" : "";
      this.boardImg = this.srcURL + subdir + this.boardTheme;
      const imageURL = this.srcURL + subdir + this.boardTheme;
      return imageURL;
    },

    configuration() {
      const board = this.getBoard;
      for (var r = 0; r < 8; r++) {
        for (var f = 0; f < 8; f++) {
          if (board[r][f]) {
            this.boardModel[r][f]["pieceName"] =
              board[r][f]["color"] + board[r][f]["type"].toUpperCase();
          } else if (this.boardModel[r][f]["pieceName"]) {
            this.boardModel[r][f]["pieceName"] = null;
          }
        }
      }
      return this.boardModel;
    },

    moveHighlights() {
      const move = this.getLastMove;
      const highlights = [];
      if (move) {
        highlights.push(move.from);
        highlights.push(move.to);
      }
      return highlights;
    },

    legalMoves() {
      const moves = {};
      for (let move of this.getLegalMoves) {
        const from = move.from;
        const to = move.to;
        if (moves[from]) {
          moves[from].push(to);
        } else {
          moves[from] = [to];
        }
      }
      return moves;
    },

    getHints() {
      if (this.startSquare) {
        const hints = this.legalMoves[this.startSquare.squareID];
        if (hints) return hints;
        return [];
      }
      return [];
    },
  },
  methods: {
    ...mapMutations({
      pushMove: "game/pushMove",
    }),
    handleClick(event, square) {
      // Overall
      //  Highlight
      //  Reveal hints
      //  Clear manual highlights (& later arrow?)
      const mouse = event.which;

      if (this.promotionSquare) {
        // Cancel promotion move
        this.promotionSquare = null;
      }

      // Click piece:
      //    clicked piece before: make legal move || change temp highlight
      //    not clicked piece before => temp highlight + hints
      // Click empty square: no special tasks
      // Finally: clear manual highlights (& later arrow?)
      if (mouse === 1) {
        if (this.startSquare && this.validateMove(this.startSquare, square)) {
          // promotion is handle somewhere else
          this.makeMove(this.startSquare.squareID, square.squareID);
        } else if (square.pieceName && !this.promotionSquare) {
          if (this.startSquare !== square) {
            this.startSquare = square;
          } else {
            this.startSquare = null;
          }
        }
      }
      // Arrows later?
      this.clearManualHighlights();
      this.clearDragOutline();
    },
    handleDragStart(event, square) {
      const mouse = event.which;
      switch (mouse) {
        case 1:
          // See startDrag
          // Finally: clear manual highlights (& later arrow?)
          event.dataTransfer.dropEffect = "move";
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("itemID", square.squareID);
          this.startSquare = square;
          this.clearManualHighlights();
          break;
        case 3:
          // Draw arrow?
          break;
        default:
          // Clear manual highlights (& later arrow?)
          this.clearManualHighlights();
          break;
      }
    },
    handleDragEnter(event, square) {
      const mouse = event.which;
      if (mouse === 1) {
        // Assign drag outline to square
        // May need to handle dragleave? See if drag end is good enought
        this.dragEnterSquare = square;
      }
    },
    handleDragEnd(event, square) {
      // Dragleave?
      // Just clear drag outline?
      this.clearDragOutline();
    },
    handleDrop(event, square) {
      // Make use of handleClick?
      // No clear drag outline?
      const mouse = event.which;
      if (mouse === 1) {
        // Necessary?
        // This means there was a focused square at drag start (from)
        // This square is (to)
        this.handleClick(event, square);
      }
    },

    // Manual highlights
    handleMouseDown(event, square) {
      const mouse = event.which;
      if (mouse === 3) {
        this.arrows.push({
          from: {
            x: event.x,
            y: event.y,
          },
        });
      }
    },
    handleMouseUp(event, square) {
      const mouse = event.which;
      if (mouse === 3) {
        this.setManualHighlight(square.squareID);
        this.arrows[this.arrows.length - 1]["to"] = { x: event.x, y: event.y };
      }
    },

    validateMove(from, to) {
      const moves = this.getLegalMoves;
      const move = moves.find(
        (element) =>
          element.from === from.squareID && element.to === to.squareID
      );
      if (move) {
        if (!move.promotion) return true;
        this.promotionSquare = to;
      }
      return false;
    },

    makeMove(from, to, promotion = null) {
      const move = { from: from, to: to };
      if (promotion) {
        move["promotion"] = promotion;
      }
      this.pushMove(move);
      this.clearManualHighlights();
      this.promotionSquare = null;
      this.startSquare = null;
    },

    onResize() {
      this.resizeBoard(window.innerWidth, window.innerHeight);
    },
    resizeBoard(width, height) {
      const minBoardSize = 400;
      var boardSize = Math.floor(0.91 * Math.min(width, height));
      boardSize -= boardSize % 8;
      if (
        boardSize <= minBoardSize ||
        (this.currentBoardSize && boardSize === this.currentBoardSize)
      ) {
        return;
      }
      this.currentBoardSize = boardSize;
      // Change styles
      const boardContainer = document.getElementById("board-container");
      boardContainer.style.setProperty("--board-size", `${boardSize}px`);
    },

    createBoardModel() {
      const files = "abcdefgh";
      const ranks = "87654321";
      for (var r = 0; r < 8; r++) {
        const rank = [];
        for (var f = 0; f < 8; f++) {
          rank.push({
            pieceName: null,
            squareID: files[f] + ranks[r],
          });
        }
        this.boardModel.push(rank);
      }
    },
    getPromotionOptions() {
      const turn = this.getTurn;
      const options = this.promotionOptions.map((option) => turn + option);
      if (
        (this.getTurn === "b" && !this.flipBoard) ||
        (this.getTurn === "w" && this.flipBoard)
      ) {
        options.reverse();
      }
      return options;
    },
    makePromotionMove(option) {
      const op = option.toLowerCase()[1];
      this.makeMove(
        this.startSquare.squareID,
        this.promotionSquare.squareID,
        op
      );
    },
    clearDragOutline() {
      this.dragEnterSquare = null;
    },
    setManualHighlight(id) {
      if (this.manualHighlights[id]) {
        delete this.manualHighlights[id];
      } else {
        this.manualHighlights[id] = true;
      }
    },
    clearManualHighlights() {
      this.manualHighlights = {};
    },
  },
};
</script>

<style lang="scss" scoped>
.board-container {
  --drag-outline-color: rgba(0, 0, 0, 0.15);
  --move-highlight-color: rgba(255, 255, 0, 0.55);
  --manual-highlight-color: rgba(235, 97, 80, 0.8);
  --coord-light-color: #779952;
  --coord-dark-color: #edeed1;
  --legal-circle-color: rgba(0, 0, 0, 0.2);

  --board-size-min: 400px;
  --board-size: min(80vh, 80vw);
  --coord-size: max(
    calc(var(--board-size) / 40),
    calc(var(--board-size-min) / 40)
  );
  --drag-outline-size: max(
    calc(var(--board-size) / 120),
    calc(var(--board-size-min) / 120)
  );
  --legal-circle-size: max(
    calc(var(--board-size) / 25),
    calc(var(--board-size-min) / 25)
  );
  --legal-circle-take-size: max(
    calc(var(--board-size) / 10),
    calc(var(--board-size-min) / 10)
  );
  --legal-circle-take-border: max(
    calc(var(--board-size) / 80),
    calc(var(--board-size-min) / 80)
  );

  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  // justify-content: center;
  // width: 100%;
  // height: 100%;
  height: 0;
  padding-bottom: 100%;
  width: 100%;

  .flipped-col {
    flex-direction: column-reverse !important;
  }
  .flipped-row {
    flex-direction: row-reverse !important;
  }
  .board {
    margin: auto;
    touch-action: none;
    border-radius: 5px;
    background-repeat: no-repeat;
    background-size: contain;
    min-width: var(--board-size-min);
    min-height: var(--board-size-min);
    width: var(--board-size);
    height: var(--board-size);
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    .rank {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 12.5%;
      .square {
        flex: 0 0 12.5%;
        height: 100%;
        .relative-container {
          position: relative;
          .coord {
            z-index: 0;
            position: absolute;
            font-weight: 500;
            font-size: var(--coord-size);
          }
          .coord-rank {
            margin-top: 5%;
            margin-left: 5%;
          }
          .coord-file {
            margin-top: 72%;
            margin-left: 82%;
          }
          .coord-light {
            color: var(--coord-light-color);
          }
          .coord-dark {
            color: var(--coord-dark-color);
          }
          .legal-circle {
            position: absolute;
            background: var(--legal-circle-color);
            opacity: 0.7;
            width: var(--legal-circle-size);
            height: var(--legal-circle-size);
            border-radius: 50%;
            margin-top: 34%;
            margin-left: 34%;
          }
          .legal-circle-take {
            position: absolute;
            background: transparent;
            opacity: 0.7;
            width: var(--legal-circle-take-size);
            height: var(--legal-circle-take-size);
            border-radius: 50%;
            border-style: solid;
            border-color: var(--legal-circle-color);
            border-width: var(--legal-circle-take-border);
          }
          .promotion-options-flipped {
            top: calc(-3 * var(--board-size) / 8);
          }
          .promotion-options {
            position: absolute;
            background: white;
            z-index: 100;
            width: calc(var(--board-size) / 8);
            height: calc(var(--board-size) / 2);
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
            .option {
              width: calc(var(--board-size) / 8);
              height: calc(var(--board-size) / 8);
              &:hover {
                background: lightblue;
              }
            }
          }
        }
      }
      .drag-enter {
        // outline-offset: calc(-1 * var(--drag-outline-size));
        // outline: var(--drag-outline-size) solid var(--drag-outline-color);
        background-color: var(--drag-outline-color) !important;
      }
      .move-highlight {
        background-color: var(--move-highlight-color);
        opacity: 0.95;
      }
      .manual-highlight {
        background-color: var(--manual-highlight-color) !important;
      }
    }
    .arrow-container {
      position: relative;
      .arrow {
        position: absolute;
        width: 100px;
        height: 20px;
        background-color: black;
      }
    }
  }
}
.unselectable {
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
</style>