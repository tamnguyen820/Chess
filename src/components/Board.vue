<template>
  <div class="board-container" :id="`board-container-${id}`">
    <!-- Board -->
    <div
      class="board unselectable"
      :class="[boardTheme, { 'flipped-col': flipBoard }]"
      :style="{ backgroundImage: 'url(' + boardUrl + ')' }"
    >
      <div
        :class="{ 'flipped-row': flipBoard }"
        class="rank"
        v-for="rank in configuration"
        :key="rank"
      >
        <div
          :id="square.squareID"
          v-for="square in rank"
          :key="square.squareID"
          class="square"
          :class="{
            'drag-enter': square === dragEnterSquare,
            'move-highlight':
              moveHighlights.includes(square.squareID) ||
              (!isInReview && square === startSquare),
            'manual-highlight': manualHighlights[square.squareID],
            'arrow-keyboard-highlight': square.squareID === arrowFromKeyboard,
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
          tabindex="0"
          @keyup="handleKeyUp($event, square)"
          @keydown="handleKeyDown($event, square)"
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
              id="promotion-options"
              tabindex="0"
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
                tabindex="0"
                @keyup="handleKeyUpPromotion($event, option)"
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

    <!-- Arrows -->
    <div
      class="absolute-container arrow-container"
      :class="{ 'flipped-arrow-container': flipBoard }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
        <!-- Highlight -->
        <g
          v-for="arrow in arrows"
          :key="arrow.from + arrow.to"
          class="arrow-highlight"
        >
          <defs>
            <marker
              :id="'arrowhead-' + arrow.from + arrow.to"
              markerWidth="10"
              markerHeight="3"
              refX="1"
              refY="1.5"
              orient="auto"
            >
              <polygon points="0.5 0.2, 2.5 1.5, 0.5 2.8" class="fill-color" />
            </marker>
          </defs>
          <line
            :x1="arrow.x1"
            :y1="arrow.y1"
            :x2="arrow.x2"
            :y2="arrow.y2"
            class="stroke-color"
            stroke-width="2.5%"
            :marker-end="`url(#arrowhead-${arrow.from + arrow.to})`"
          />
        </g>

        <!-- Suggestions -->
        <g
          v-for="arrow in suggestionArrows"
          :key="arrow.from + arrow.to"
          class="arrow-suggestion"
        >
          <defs>
            <marker
              :id="'arrowhead-suggestion-' + arrow.from + arrow.to"
              markerWidth="10"
              markerHeight="3"
              refX="1"
              refY="1.5"
              orient="auto"
            >
              <polygon points="0.5 0.2, 2.5 1.5, 0.5 2.8" class="fill-color" />
            </marker>
          </defs>
          <line
            :x1="arrow.x1"
            :y1="arrow.y1"
            :x2="arrow.x2"
            :y2="arrow.y2"
            class="stroke-color"
            stroke-width="2.5%"
            :marker-end="`url(#arrowhead-suggestion-${arrow.from + arrow.to})`"
          />
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
// TODO:
//  Create animations?
//  Computer moves?

//  UI components
//  Refactor board

import { uniqueId } from "lodash";
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
    this.resizeBoard(window.outerWidth, window.outerHeight);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  components: {
    Piece,
  },
  props: {
    id: {
      type: String,
      default: () => uniqueId(),
    },
    showSuggestions: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      boardModel: [],
      promotionOptions: ["Q", "N", "R", "B"],
      currentBoardSize: null,
      // New
      dragEnterSquare: null,
      startSquare: null,
      promotionSquare: null,
      manualHighlights: {},
      arrows: [],
      arrowFrom: "",
      arrowFromKeyboard: "",
    };
  },
  computed: {
    ...mapGetters({
      boardTheme: "settings/getBoardTheme",
      boardUrl: "settings/getBoardUrl",
      showLegal: "settings/showLegalMoves",
      showCoordinates: "settings/showCoordinates",
      flipBoard: "settings/getFlipBoard",

      getBoard: "game/getBoard",
      getLegalMoves: "game/getLegalMoves",
      getTurn: "game/getTurn",
      getLastMove: "game/getLastMove",
      isInReview: "game/isInReview",

      getEngineSuggestions: "engine/getEngineSuggestions",
      suggestionsOn: "analysisSettings/getSuggestionsOn",
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

    suggestionArrows() {
      if (!this.showSuggestions || !this.suggestionsOn) {
        return [];
      }
      const arr = [];
      this.getEngineSuggestions.forEach((firstMove) => {
        if (firstMove.length) {
          const from = firstMove.slice(0, 2);
          const to = firstMove.slice(2, 4);
          arr.push({
            from,
            to,
            ...this.calculateArrowCoord(from, to),
          });
        } else {
          return;
        }
      });
      return arr;
    },
  },
  methods: {
    ...mapMutations({
      setBoardSize: "settings/setBoardSize",

      pushMove: "game/pushMove",
    }),
    handleClick(event, square) {
      // Overall
      //  Highlight
      //  Reveal hints
      //  Clear manual highlights (& later arrow?)
      const mouse = event.which;
      const keyCode = event.keyCode;

      if (this.promotionSquare) {
        // Cancel promotion move
        this.promotionSquare = null;
      }

      // Click piece:
      //    clicked piece before: make legal move || change temp highlight
      //    not clicked piece before => temp highlight + hints
      // Click empty square: no special tasks
      // Finally: clear manual highlights (& later arrow?)
      if (mouse === 1 || keyCode === 13 || keyCode === 32) {
        if (this.startSquare && this.validateMove(this.startSquare, square)) {
          // promotion is handle somewhere else
          this.makeMove(this.startSquare.squareID, square.squareID);
        } else if (!this.promotionSquare) {
          if (square.pieceName && this.startSquare !== square) {
            this.startSquare = square;
          } else {
            this.startSquare = null;
          }
        }
      }
      this.clearManualHighlights();
      this.clearArrows();
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
          this.clearArrows();
          break;
        case 3:
          // Draw arrow?
          break;
        default:
          // Clear manual highlights (& later arrow?)
          this.clearManualHighlights();
          this.clearArrows();
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
        this.arrowFrom = square.squareID;
      }
    },
    handleMouseUp(event, square) {
      const mouse = event.which;
      if (mouse === 3) {
        if (this.arrowFrom !== square.squareID) {
          this.addNewArrow(this.arrowFrom, square.squareID);
        } else {
          this.setManualHighlight(square.squareID);
        }
      } else {
        this.clearManualHighlights();
        this.clearArrows();
      }
      this.arrowFrom = "";
    },
    addNewArrow(from, to) {
      const arrowIndex = this.arrows.findIndex(
        (arrow) => arrow.from === from && arrow.to === to
      );
      if (arrowIndex >= 0) {
        // If arrow already exists, remove it
        this.arrows.splice(arrowIndex, 1);
        return;
      }
      this.arrows.push({
        from,
        to,
        ...this.calculateArrowCoord(from, to),
      });
    },

    calculateArrowCoord(from, to) {
      var x1 = Math.abs(from[0].charCodeAt() - "a".charCodeAt()) * 100 + 50;
      var y1 = Math.abs(from[1].charCodeAt() - "8".charCodeAt()) * 100 + 50;
      var x2 = Math.abs(to[0].charCodeAt() - "a".charCodeAt()) * 100 + 50;
      var y2 = Math.abs(to[1].charCodeAt() - "8".charCodeAt()) * 100 + 50;

      const xDif = x1 - x2;
      const yDif = y1 - y2;
      const posOffset = 20;

      if (xDif > 0) {
        x1 -= posOffset;
        x2 += posOffset;
      } else if (xDif < 0) {
        x1 += posOffset;
        x2 -= posOffset;
      }

      if (yDif > 0) {
        y1 -= posOffset;
        y2 += posOffset;
      } else if (yDif < 0) {
        y1 += posOffset;
        y2 -= posOffset;
      }

      return { x1, y1, x2, y2 };
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
      this.clearArrows();
      if (this.promotionSquare) {
        document.getElementById(this.promotionSquare.squareID).focus();
      }
      this.promotionSquare = null;
      this.startSquare = null;
    },

    onResize() {
      this.resizeBoard(window.outerWidth, window.outerHeight);
    },
    resizeBoard(width, height) {
      var boardSize = Math.floor(0.8 * Math.min(width, height));
      boardSize -= boardSize % 8;
      this.currentBoardSize = boardSize;
      // Change styles
      const boardContainer = document.getElementById(
        "board-container-" + this.id
      );
      boardContainer.style.setProperty("--board-size", `${boardSize}px`);

      this.setBoardSize(boardSize);
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
      console.log(this.manualHighlights);
      if (this.manualHighlights[id]) {
        delete this.manualHighlights[id];
      } else {
        this.manualHighlights[id] = true;
      }
    },
    clearManualHighlights() {
      this.manualHighlights = {};
    },
    clearArrows() {
      this.arrows = [];
      this.arrowFrom = "";
    },

    // Accessibility
    handleKeyUp(e, square) {
      const code = e.keyCode;
      if (code === 13 || code === 32) {
        this.handleClick(e, square);
        this.arrowFrom = "";
        this.arrowFromKeyboard = "";
      } else if (code === 17) {
        // Arrows
        if (!this.arrowFrom) {
          this.arrowFrom = square.squareID;
          this.arrowFromKeyboard = square.squareID;
        } else {
          if (this.arrowFrom !== square.squareID) {
            this.addNewArrow(this.arrowFrom, square.squareID);
          }
          this.arrowFrom = "";
          this.arrowFromKeyboard = "";
        }
      } else if (code === 88) {
        // Manual highlights
        this.setManualHighlight(square.squareID);
      }
    },
    handleKeyDown(e, square) {
      const code = e.keyCode;
      if (code !== 37 && code !== 38 && code !== 39 && code !== 40) {
        return;
      }
      var file = square.squareID[0].charCodeAt();
      var rank = square.squareID[1].charCodeAt();
      const offset = this.flipBoard ? -1 : 1;
      if (code === 37) {
        // Left arrow
        file -= offset;
      } else if (code === 38) {
        // Up arrow
        rank += offset;
      } else if (code == 39) {
        // Right arrow
        file += offset;
      } else if (code === 40) {
        // Down arrow
        rank -= offset;
      }
      file = String.fromCharCode(file);
      rank = String.fromCharCode(rank);
      if ("a" <= file && file <= "h" && "1" <= rank && rank <= "8") {
        const nextSquare = document.getElementById(file + rank);
        nextSquare.focus();
      }
    },
    handleKeyUpPromotion(e, option) {
      const code = e.keyCode;
      if (code === 13 || code == 32) {
        this.makePromotionMove(option);
      }
    },
  },
  watch: {
    promotionSquare(newValue) {
      this.$nextTick(() => {
        if (newValue) {
          const optionsDisplay = document.getElementById("promotion-options");
          optionsDisplay.focus();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.board-container {
  --drag-outline-color: rgba(0, 0, 0, 0.15);
  --manual-highlight-color: rgba(235, 97, 80, 0.8);
  --legal-circle-color: rgba(0, 0, 0, 0.3);

  --board-size-min: 200px;
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
    calc(var(--board-size) / 8),
    calc(var(--board-size-min) / 8)
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
  position: relative;

  .flipped-col {
    flex-direction: column-reverse !important;
  }
  .flipped-row {
    flex-direction: row-reverse !important;
  }

  .board {
    z-index: 1;
    margin: auto;
    touch-action: none;
    border-radius: 5px;
    background-repeat: no-repeat;
    background-size: contain;
    min-width: var(--board-size-min);
    width: var(--board-size);
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    overflow: hidden;
    .rank {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 12.5%;
      .square {
        flex: 0 0 12.5%;
        height: 100%;
        .coord {
          z-index: 0;
          position: absolute;
          font-weight: 600;
          font-size: var(--coord-size);
        }
        .coord-rank {
          margin-top: 5%;
          margin-left: 6%;
        }
        .coord-file {
          margin-top: 70%;
          margin-left: 80%;
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
              background: lightblue !important;
            }
            &:focus {
              background: lightblue !important;
            }
          }
          &:focus-visible {
            background-color: lightblue !important;
          }
        }
        &:focus-visible {
          background-color: var(--manual-highlight-color) !important;
        }
      }
      .drag-enter {
        background-color: var(--drag-outline-color) !important;
      }
      .move-highlight {
        background: var(--move-highlight-color);
      }
      .manual-highlight {
        background-color: var(--manual-highlight-color) !important;
      }
      .arrow-keyboard-highlight {
        background-color: rgba(255, 170, 0, 0.8) !important;
      }
    }
  }

  .arrow-container {
    width: var(--board-size);
    aspect-ratio: 1;
    z-index: 1;
    pointer-events: none;
    opacity: 0.8;
    .arrow-highlight {
      .fill-color {
        fill: rgb(255, 170, 0);
      }
      .stroke-color {
        stroke: rgb(255, 170, 0);
      }
    }
    .arrow-suggestion {
      .fill-color {
        fill: rgb(149, 187, 74);
      }
      .stroke-color {
        stroke: rgb(149, 187, 74);
      }
    }
  }
  .flipped-arrow-container {
    transform: rotate(180deg);
  }
}
.unselectable {
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.relative-container {
  position: relative;
}
.absolute-container {
  position: absolute;
}
</style>