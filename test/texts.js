export const texts = {
  namespaced: true,

  state() {
    return {
      content: "Test"
    }
  },

  mutations: {
    setContent(state) {
      state.content = "Changed"
    }
  },

  getters: {
    getContent(state) {
      return state.content
    }
  }
}