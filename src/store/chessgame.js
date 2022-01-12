import { Chess } from "chess.js";

export const chess = () => {
  console.log("START")
  const chess = new Chess()
  // while (!chess.game_over()) {
  //   const moves = chess.moves()
  //   const move = moves[Math.floor(Math.random() * moves.length)]
  //   chess.move(move)
  // }
  // console.log(chess.pgn())

  const moves = chess.moves({ verbose: true })
  console.log(moves)
}