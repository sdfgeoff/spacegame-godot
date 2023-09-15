import { GameDataResponse } from "../network/TrackerMessages"

export type GameMode = {
    'mode': 'play',
    'gameData': GameDataResponse
  } | {
    'mode': 'home'
  }