export const settings = {
  namespaced: true,

  state() {
    return {
      boardTheme: "danyablue.svg",
      boardSize: 800,
      pieceTheme: "merida",
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
      return state.boardTheme.substring(0, state.boardTheme.indexOf("."))
    },
    getBoardUrl(state) {
      const srcURL = "./assets/images/board/";
      const theme = state.boardTheme;
      const extension = theme.substr(theme.length - 4);
      var subdir = extension === ".svg" ? "svg/" : "";
      const imageURL = srcURL + subdir + theme;
      return imageURL;
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
