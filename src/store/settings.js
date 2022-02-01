export const settings = {
  namespaced: true,

  state() {
    return {
      boardTheme: "neogreen.svg",
      boardSize: 800,
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
    setBoardSize(state, size) {
      state.boardSize = size
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
    getBoardSize(state) {
      return state.boardSize
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
