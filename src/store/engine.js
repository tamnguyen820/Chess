export const engine = {
  namespaced: true,

  state() {
    return {
      worker: null,
      engineDepth: "18",
      depth: "0",
      evalType: "cp",
      evalScore: "0",
      pv: "",
    }
  },

  mutations: {
    createEngine(state, fen) {
      if (!state.worker) {
        state.worker = new Worker("../engine/stockfish11.js");

        state.worker.onmessage = function (e) {
          const message = e.data;
          var matches = message.match(/depth (\d+) .*score (cp|mate) ([-\d]+) .*pv (.+)/);
          if (matches) {
            state.depth = matches[1];
            state.evalType = matches[2];
            state.evalScore = matches[3];
            state.pv = matches[4];
          } else if (/score mate 0\b/.test(message)) {
            state.depth = "0";
            state.evalType = "mate";
            state.evalScore = "0";
            state.pv = "";
          }
        };

        this.commit("engine/loadFen", fen)
        this.commit("engine/evaluate")
      }
    },

    stopEngine(state) {
      state.worker.postMessage("stop")
    },

    loadFen(state, fen) {
      this.commit("engine/stopEngine")
      state.worker.postMessage("position fen " + fen)
    },

    evaluate(state) {
      state.worker.postMessage("go depth " + state.engineDepth)
    },
  },

  getters: {
    getEngineDepth(state) {
      return state.engineDepth
    },
    getDepth(state) {
      return state.depth
    },
    getEval(state) {
      return { evalType: state.evalType, evalScore: state.evalScore }
    },
    getPv(state) {
      return state.pv
    },
  }
}
