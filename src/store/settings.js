export const settings = {
  namespaced: true,

  state() {
    return {
      boardTheme: "neogreen.svg",
      pieceTheme: "neo",
      showLegal: true,
      showCoords: true,
      soundOn: true,
      flipBoard: false,
    }
  },

  mutations: {
    setBoardTheme(state, theme) {
      state.boardTheme = theme
    },
    setPieceTheme(state, theme) {
      state.pieceTheme = theme
    },
    setShowLegal(state, show) {
      state.showLegal = show
    },
    setShowCoords(state, show) {
      state.showCoords = show
    },
    setSoundOn(state, on) {
      state.soundOn = on
    },
    setFlipBoard(state) {
      state.flipBoard = !state.flipBoard
    }
  },

  getters: {
    getBoardTheme(state) {
      return state.boardTheme
    },
    getPieceTheme(state) {
      return state.pieceTheme
    },
    showLegalMoves(state) {
      return state.showLegal
    },
    showCoordinates(state) {
      return state.showCoords
    },
    getSoundOn(state) {
      return state.soundOn
    },
    getFlipBoard(state) {
      return state.flipBoard
    }
  }
}
