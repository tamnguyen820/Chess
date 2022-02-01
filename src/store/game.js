import { Chess } from "chess.js";
import LichessServices from "../services/LichessServices.js";
import playSound from "./sounds.js";

const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }

function abc(state) {
  console.log(state)
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export const game = {
  namespaced: true,

  state() {
    return {
      chessGame: null,
      fen: "",
      board: [],
      turn: "",
      legalMoves: [],
      lastMove: null,
      capture: {
        w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
        b: { p: 0, n: 0, b: 0, r: 0, q: 0 }
      },
      gameOver: false,
      history: [],
      shortHistory: [],
      tempShortHistory: [],
      reviewStack: [],
      openingLine: "",
      openingInfo: null,
    }
  },

  mutations: {
    set_def(state, payload) {
      abc(state);
    },

    updateGame(state) {
      state.fen = state.chessGame.fen()
      state.board = state.chessGame.board()
      state.legalMoves = state.chessGame.moves({ verbose: true })
      state.gameOver = state.chessGame.game_over()
      state.history = state.chessGame.history({ verbose: true })
      state.shortHistory = state.chessGame.history()
      state.turn = state.chessGame.turn()
    },

    createNewGame(state) {
      if (!state.chessGame) {
        state.chessGame = new Chess()
        this.commit("game/updateGame")
      }
    },
    async pushMove(state, move) {
      // Make move
      state.lastMove = state.chessGame.move(move)

      // Play sound and update info
      if (state.lastMove.captured) {
        playSound("capture")
        state.capture[state.lastMove.color][state.lastMove.captured]++;
      } else {
        playSound("move")
      }
      this.commit("game/updateGame")
      if (state.gameOver) {
        await sleep(500)
        playSound("click")
        state.legalMoves = []
      }

      // Find opening info
      if (!state.tempShortHistory.length && state.history.length) {
        const historyLen = state.history.length;
        if (historyLen > 1) {
          state.openingLine += ","
        }
        const move = state.lastMove;
        state.openingLine += move.from + move.to
        LichessServices.
          getOpeningInfo(state.openingLine).
          then(res => { state.openingInfo = res.data.opening }).
          catch(err => console.log(err))
      }
    },
    async playGame(state) {
      while (!state.gameOver) {
        const moves = state.legalMoves
        const move = moves[Math.floor(Math.random() * moves.length)]
        this.commit("game/pushMove", move)
        await sleep(500)
      }
    },
    goBack(state, times = 1) {
      if (!state.reviewStack.length) {
        state.tempShortHistory = JSON.parse(JSON.stringify(state.shortHistory))
      }
      for (var i = 0; i < times; i++) {
        const move = state.chessGame.undo()
        if (move) {
          state.reviewStack.push(move)
          state.capture[move.color][move.captured]--;
        } else {
          break;
        }
      }
      this.commit("game/updateGame")
      state.lastMove = state.history[state.history.length - 1]
      if (state.lastMove) {
        if (state.lastMove.captured) {
          playSound("capture")
        } else {
          playSound("move")
        }
      }
    },
    goForward(state, times = 1) {
      for (var i = 0; i < times; i++) {
        const move = state.reviewStack.pop()
        if (move) {
          this.commit("game/pushMove", move)
        } else {
          state.tempShortHistory = []
          break;
        }
      }
      this.commit("game/updateGame")
    },
  },

  getters: {
    ABC(state) {
      return abc(state);
    },
    getFen(state) {
      return state.fen
    },
    getBoard(state) {
      return state.board
    },
    getLegalMoves(state, getters) {
      if (getters.isInReview) {
        return []
      }
      return state.legalMoves
    },
    getTurn(state) {
      return state.turn
    },
    getGameHistory(state) {
      return state.history
    },
    getShortGameHistory(state, getters) {
      if (getters.isInReview) {
        return state.tempShortHistory
      }
      return state.shortHistory
    },
    getLastMove(state) {
      return state.lastMove
    },
    getLastMoveIndex(state) {
      return state.history.length - 1
    },
    isGameOver(state) {
      return state.gameOver
    },
    isDraw(state) {
      if (state.gameOver) {
        return state.chessGame.in_draw()
      }
      return false
    },
    isInReview(state) {
      return state.reviewStack.length
    },
    getOpeningInfo(state) {
      return state.openingInfo
    },
    getCaptureInfo: (state) => (side) => {
      if (side !== "b" && side !== "w") {
        return null;
      }
      return Object.entries(state.capture[side])
    },
    getMaterialAdvantage(state) {
      const board = state.board
      var advantage = 0
      for (const row of board) {
        for (const piece of row) {
          if (piece) {
            const value = pieceValues[piece.type]
            if (piece.color === 'b') {
              advantage -= value
            } else {
              advantage += value
            }
          }
        }
      }
      return advantage;
    }
  }
}
