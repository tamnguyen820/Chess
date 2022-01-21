import axios from "axios";

const explorerBase = axios.create({
  baseURL: "https://explorer.lichess.ovh/"
})

export default {
  // Get opening info from lichess/masters databases
  getOpeningInfo(play, from = "lichess") {
    return explorerBase.get(from + "?play=" + play)
  }
}