export const engine = {
  namespaced: true,

  state() {
    return {
      worker: null,
      engineDepth: 18,
      multipv: 1,
      depth: "0",
      evalType: "cp",
      evalScore: "0",
      pvs: [],
      contempt: 0
    }
  },

  mutations: {
    createEngine(state, fen) {
      state.worker = new Worker("../engine/stockfish11.js");
      this.commit("engine/createPvArray")

      state.worker.onmessage = function (e) {
        const message = e.data;
        var matches = message.match(/depth (\d+) .*multipv ([-\d]+) .*score (cp|mate) ([-\d]+) .*pv (.+)/);
        if (matches) {
          state.depth = matches[1];
          const pvIdx = matches[2] - 1;
          if (pvIdx === 0) {
            state.evalType = matches[3];
            state.evalScore = matches[4];
          }
          state.pvs[pvIdx].evalType = matches[3];
          state.pvs[pvIdx].evalScore = matches[4];
          state.pvs[pvIdx].line = matches[5];
        } else if (/score mate 0\b/.test(message)) {
          state.depth = "0";
          state.evalType = "mate";
          state.evalScore = "0";
          state.pvs.forEach(pv => {
            pv.line = "";
            pv.evalScore = "mate";
            state.evalScore = "0";
          })
        }
      };
      state.worker.postMessage("uci")
      state.worker.postMessage("setoption name MultiPV value " + state.multipv)
      state.worker.postMessage("setoption name Contempt value " + state.contempt)
      this.commit("engine/loadFen", fen)
      this.commit("engine/evaluate")
    },

    destroyEngine(state) {
      this.commit("engine/stopEngine")
      state.worker = null
    },

    stopEngine(state) {
      if (state.worker)
        state.worker.postMessage("stop")
    },

    loadFen(state, fen) {
      this.commit("engine/stopEngine")
      state.worker.postMessage("position fen " + fen)
    },

    evaluate(state) {
      state.worker.postMessage("go depth " + state.engineDepth)
    },

    createPvArray(state) {
      state.pvs = [];
      for (var i = 0; i < state.multipv; i++) {
        state.pvs.push({ line: [], evalType: "", evalScore: "" });
      }
    },

    setEngineContempt(state, val) {
      this.commit("engine/stopEngine")
      state.contempt = val
      state.worker.postMessage("setoption name Contempt value " + state.contempt)
      this.commit("engine/evaluate")
    },

    setEngineDepth(state, val) {
      this.commit("engine/stopEngine")
      state.engineDepth = val
      this.commit("engine/evaluate")
    },

    setMultiPv(state, val) {
      this.commit("engine/stopEngine")
      state.multipv = val
      state.worker.postMessage("setoption name MultiPV value " + state.multipv)
      this.commit("engine/createPvArray")
      this.commit("engine/evaluate")
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
    getEngineContempt(state) {
      return state.contempt
    },
    getMultiPv(state) {
      return state.multipv
    },
    getPvs(state) {
      return state.pvs
    },
    getEngineSuggestions(state) {
      const suggestions = []
      state.pvs.forEach((pv) => {
        if (pv.line) {
          suggestions.push(pv.line.slice(0, 4))
        } else {
          suggestions.push("")
        }
      })
      return suggestions
    }
  }
}
