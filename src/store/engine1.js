const engineDepth = "18"

var depth = "";
var evalType = "";
var evalScore = "";
var pv = "";

var worker = new Worker("../engine/stockfish11.js")

worker.onmessage = function (e) {
  const message = e.data;
  var matches = message.match(/depth (\d+) .*score (cp|mate) ([-\d]+) .*pv (.+)/);
  if (matches) {
    depth = matches[1];
    evalType = matches[2];
    evalScore = matches[3];
    pv = matches[4];
    console.log(evalType, evalScore)
  } else if (/score mate 0\b/.test(message)) {
    depth = "0";
    evalType = "mate";
    evalScore = "0";
    pv = "";
  }
}

function sendCommand(message) {
  worker.postMessage(message);
}

function stop() {
  sendCommand("stop");
  console.log("stop")
}

function loadFen(fen) {
  sendCommand("position fen " + fen);
}

function evaluate() {
  sendCommand("go depth " + engineDepth);
}

export {
  depth, evalType, evalScore, pv,
  stop, loadFen, evaluate
}

