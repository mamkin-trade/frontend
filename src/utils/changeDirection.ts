import { Ticker } from '../models/ticker'

export enum ChangeDirection {
  up,
  down,
  none,
}

export function getChangeDirection(ticker: Ticker) {
  if (!ticker.dailyChangePerc) {
    return ChangeDirection.none
  }
  if (ticker.dailyChangePerc > 0) {
    return ChangeDirection.up
  } else if (ticker.dailyChangePerc < 0) {
    return ChangeDirection.down
  } else {
    return ChangeDirection.none
  }
}