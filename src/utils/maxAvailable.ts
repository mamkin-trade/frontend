// Dependencies
import { Ticker } from './../models/ticker'
import * as store from '../plugins/store'

export function maxAvailable(pair: string, side: string, price?: number) {
  // Split symbols
  const first = pair.slice(0, 3).toLowerCase()
  const second = pair.slice(3).toLowerCase()
  // Get ticker
  let ticker: Ticker | undefined
  for (const t of store.tickers()) {
    if (t.pair === pair) {
      ticker = t
    }
  }
  if (!ticker || !ticker.lastPrice) {
    return 0
  }
  // Get balance
  const user = store.user()
  if (!user) {
    return 0
  }
  const balance = user.balance
  // Return max available
  if (side === 'buy') {
    return balance[second] / (price || ticker.lastPrice)
  } else {
    return balance[first]
  }
}
