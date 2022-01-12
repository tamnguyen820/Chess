<template>
  <div class="board-container">
    <div
      id="board"
      class="board unselectable"
      :style="{ backgroundImage: 'url(' + boardImage + ')' }"
    >
      <div class="rank" v-for="rank in configuration" :key="rank">
        <div
          class="square"
          :class="{
            'drag-over': p.squareID === currentDragOverSquare,
            'move-highlight':
              moveHighlightSquares.includes(p.squareID) ||
              p.squareID === tempMoveHighlightSquare,
            'manual-highlight': manualHighlightSquares[p.squareID],
          }"
          v-for="p in rank"
          :key="p.squareID"
          @drop="onDrop(p.squareID)"
          @dragenter.prevent
          @dragover.prevent
          @dragover="dragOver(p.squareID)"
          @dragend="clearDragOutline"
          @dragleave="clearDragOutline"
          oncontextmenu="return false;"
          @mousedown="setManualHighlight($event, p.squareID)"
          @click="moveClick(p.squareID)"
        >
          <!-- Coord -->
          <div
            v-if="showCoordinates && coords[p.squareID]"
            class="relative-container"
          >
            <div
              class="coord"
              v-for="coord in coords[p.squareID]"
              :key="coord"
              :class="coord.class"
            >
              {{ coord.letter }}
            </div>
          </div>

          <!-- Hints -->
          <div
            v-if="showLegal && hints.includes(p.squareID)"
            class="relative-container"
          >
            <div
              :class="p.pieceName ? 'legal-circle-take' : 'legal-circle'"
            ></div>
          </div>

          <!-- Promotion -->
          <div v-if="p.squareID === promotionSquare" class="relative-container">
            <div class="promotion-options">
              <div
                v-for="option in getPromotionOptions()"
                :key="option"
                class="option"
                @click="setPromotionOption(option)"
              >
                <Piece :pieceName="option" :allowDrag="false" />
              </div>
            </div>
          </div>

          <!-- Piece -->
          <Piece
            v-if="p.pieceName"
            :pieceName="p.pieceName"
            @dragstart="startDrag($event, p.squareID)"
            @mousedown="revealHints($event, p.squareID)"
          />
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
  components: {
    Piece,
  },
  data() {
    return {
      srcURL: "./assets/images/board/",
      boardModel: [],
      currentDragOverSquare: null,
      moveHighlightSquares: [],
      tempMoveHighlightSquare: null,
      manualHighlightSquares: {},
      promotionMoves: [],
      promotionSquare: null,
      hints: [],
      coords: {
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
      },
      promotionOptions: ["Q", "N", "R", "B"],
    };
  },
  computed: {
    ...mapGetters({
      boardTheme: "settings/getBoardTheme",
      showLegal: "settings/showLegalMoves",
      showCoordinates: "settings/showCoordinates",

      getBoard: "game/getBoard",
      getLegalMoves: "game/getLegalMoves",
      getTurn: "game/getTurn",
    }),

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
      console.log(this.boardModel);
      console.log(this.legalMoves);

      return this.boardModel;
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
        if (move.promotion) {
          if (this.promotionMoves[from]) {
            this.promotionMoves[from].push(to);
          } else {
            this.promotionMoves[from] = [to];
          }
        }
      }
      return moves;
    },
  },
  methods: {
    ...mapMutations({
      pushMove: "game/pushMove",
    }),
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
      return options;
    },
    setPromotionOption(option) {
      const op = option.toLowerCase()[1];
      this.commitMove(this.tempMoveHighlightSquare, this.promotionSquare, op);
    },

    legalHints(id) {
      const hints = this.legalMoves;
      if (hints[id]) {
        return hints[id];
      }
      return [];
    },
    revealHints(event, id) {
      if (event.which === 1) {
        this.hints = this.legalHints(id);
      }
    },
    clearHints() {
      this.hints = [];
    },
    startDrag(event, item) {
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("itemID", item);
      this.setTempMoveHighlight(item);
    },
    dragOver(id) {
      if (id != this.currentDragOverSquare) {
        this.currentDragOverSquare = id;
      }
    },
    clearDragOutline() {
      this.currentDragOverSquare = null;
    },
    onDrop(id) {
      this.moveClick(id);
      this.clearDragOutline();
    },
    moveClick(id) {
      // console.log(id);
      // console.log(this.tempMoveHighlightSquare);
      if (this.tempMoveHighlightSquare && id !== this.tempMoveHighlightSquare) {
        this.commitMove(this.tempMoveHighlightSquare, id);
        return;
      }
      // TEMP
      const rank = this.configuration.find((rank) =>
        rank.find((square) => square.squareID === id)
      );
      const square = rank.find((square) => square.squareID === id);
      if (square.pieceName) {
        this.setTempMoveHighlight(id);
      }
    },
    commitMove(id1, id2, promotion = null) {
      if (this.promotionMoves[id1] && this.promotionMoves[id1].includes(id2)) {
        if (!promotion) {
          this.promotionSquare = id2;
          return;
        }
        this.pushMove({
          from: id1,
          to: id2,
          promotion: promotion,
        });
        this.clearMoveHighlights();
        this.setMoveHighlight(id1);
        this.setMoveHighlight(id2);
        this.clearHints();
        this.promotionMoves = [];
        this.promotionSquare = null;
      }
      if (this.legalMoves[id1] && this.legalMoves[id1].includes(id2)) {
        this.pushMove({
          from: id1,
          to: id2,
        });
        this.clearMoveHighlights();
        this.setMoveHighlight(id1);
        this.setMoveHighlight(id2);
        this.clearHints();
      } else {
        // TEMP
        const rank = this.configuration.find((rank) =>
          rank.find((square) => square.squareID === id2)
        );
        const square = rank.find((square) => square.squareID === id2);
        if (square.pieceName) {
          this.setTempMoveHighlight(id2);
        }
      }
    },
    setTempMoveHighlight(id) {
      this.tempMoveHighlightSquare = id;
    },
    clearTempMoveHighlight() {
      this.tempMoveHighlightSquare = null;
    },
    setMoveHighlight(id) {
      this.moveHighlightSquares.push(id);
    },
    clearMoveHighlights() {
      this.moveHighlightSquares = [];
    },
    setManualHighlight(event, id) {
      if (event.which === 3) {
        if (this.manualHighlightSquares[id]) {
          delete this.manualHighlightSquares[id];
        } else {
          this.manualHighlightSquares[id] = true;
        }
      } else {
        this.clearManualHighlights();
      }
    },
    clearManualHighlights() {
      this.manualHighlightSquares = {};
    },
  },
};
</script>

<style lang="scss" scoped>
$drag-outline-color: #d1e8e4;
$move-highlight-color: #d8e04a;
$manual-highlight-color: #d4715f;
$coord-light-color: #779952;
$coord-dark-color: #edeed1;
$board-size-min: 400px;
$board-size: min(70vh, 70vw);
$coord-size: max(calc($board-size/40), calc($board-size-min/40));
$drag-outline-size: max(calc($board-size/120), calc($board-size-min/120));
$legal-circle-color: #abab95;
$legal-circle-size: max(calc($board-size/25), calc($board-size-min/25));
$legal-circle-take-size: max(calc($board-size/10), calc($board-size-min/10));
$legal-circle-take-border: max(calc($board-size/80), calc($board-size-min/80));

.board-container {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  // position: relative;
  width: 100%;
  height: 100%;
  .board {
    touch-action: none;
    border-radius: 5px;
    background-repeat: no-repeat;
    background-size: contain;
    // min-width: $board-size-min;
    // min-height: $board-size-min;
    width: $board-size;
    height: $board-size;
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
            font-weight: 600;
            font-family: Arial, Helvetica, sans-serif;
            font-size: $coord-size;
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
            color: $coord-light-color;
          }
          .coord-dark {
            color: $coord-dark-color;
          }
          .legal-circle {
            position: absolute;
            background: $legal-circle-color;
            opacity: 0.7;
            width: $legal-circle-size;
            height: $legal-circle-size;
            border-radius: 50%;
            margin-top: 34%;
            margin-left: 34%;
          }
          .legal-circle-take {
            position: absolute;
            background: transparent;
            opacity: 0.7;
            width: $legal-circle-take-size;
            height: $legal-circle-take-size;
            border-radius: 50%;
            border-style: solid;
            border-color: $legal-circle-color;
            border-width: $legal-circle-take-border;
          }
          .promotion-options {
            position: absolute;
            background: white;
            z-index: 100;
            width: calc($board-size/8);
            height: calc($board-size/2);
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
            .option {
              width: calc($board-size/8);
              height: calc($board-size/8);
              &:hover {
                background: lightblue;
              }
            }
          }
        }
      }
      .drag-over {
        outline-offset: calc(-1 * $drag-outline-size);
        outline: $drag-outline-size solid $drag-outline-color;
      }
      .move-highlight {
        background-color: $move-highlight-color;
        opacity: 0.9;
      }
      .manual-highlight {
        background-color: $manual-highlight-color;
        opacity: 0.9;
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