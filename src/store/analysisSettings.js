export const analysisSettings = {
  namespaced: true,

  state() {
    return {
      analysisModalOpen: false,
      engineOn: true,
      suggestionsOn: false,

      importModalOpen: false,
    }
  },

  mutations: {
    setAnalysisModalOpen(state, open) {
      state.analysisModalOpen = open
    },
    setEngineOn(state, on) {
      state.engineOn = on
    },
    setSuggestionsOn(state, on) {
      state.suggestionsOn = on
    },

    setImportModalOpen(state, open) {
      state.importModalOpen = open
    },
  },

  getters: {
    getAnalysisModalOpen(state) {
      return state.analysisModalOpen
    },
    getEngineOn(state) {
      return state.engineOn
    },
    getSuggestionsOn(state) {
      return state.suggestionsOn
    },

    getImportModalOpen(state) {
      return state.importModalOpen
    },
  }
}
