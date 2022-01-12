import { Chess } from "chess.js";
import playSound from "./sounds.js";

function abc(state) {
  console.log(state)
}

export const game = {
  namespaced: true,

  state() {
    return {
      chessGame: null,
      fen: "",
      turn: "",
      legalMoves: [],
      lastMove: {},
      gameOver: false,
      history: [],
    }
  },

  mutations: {
    set_def(state, payload) {
      abc(state);
    },

    updateGame(state) {
      state.fen = state.chessGame.fen()
      state.legalMoves = state.chessGame.moves({ verbose: true })
      state.gameOver = state.chessGame.game_over()
      state.history = state.chessGame.history({ verbose: true })
    },

    createNewGame(state) {
      if (!state.chessGame) {
        state.chessGame = new Chess()
        this.commit("game/updateGame")
      }
    },
    pushMove(state, move) {
      state.lastMove = state.chessGame.move(move)
      if (state.lastMove.flags.includes("c") || state.lastMove.flags.includes("e")) {
        playSound("capture")
      } else {
        playSound("move")
      }
      this.commit("game/updateGame")
    }
  },

  getters: {
    ABC(state) {
      return abc(state);
    },
    getBoard(state) {
      console.log(state.chessGame.board())
      return state.fen.split(" ")[0]
    },
    getLegalMoves(state) {
      return state.legalMoves
    },
    getTurn(state) {
      return state.turn
    },
    getGameHistory(state) {
      return state.history
    },
    isGameOver(state) {
      return state.gameOver
    }
  }
}
