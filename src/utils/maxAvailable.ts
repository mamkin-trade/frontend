// Dependencies
import { Ticker } from '../models/ticker'
import * as store from '../plugins/store'
import { NasdaqTicker } from '../models/nasdaqTicker'
import { isCrypto } from './isCrypto'
import { feeMultiplier } from './fee'

export function maxAvailable(
  pair: string,
  side: string,
  isMarket: boolean,
  price?: number
) {
  // Split symbols
  const first = isCrypto(pair)
    ? pair.slice(0, 3).toLowerCase()
    : pair.toLowerCase()
  const second = isCrypto(pair) ? pair.slice(3).toLowerCase() : 'usd'
  // Get ticker
  let ticker: Ticker | NasdaqTicker | undefined
  for (const t of store.tickers()) {
    if (t.pair === pair) {
      ticker = t
    }
  }
  for (const t of store.nasdaqTickers()) {
    if (t.symbol === pair) {
      ticker = t
    }
  }
  if (
    !ticker ||
    ('ask' in ticker && !ticker.ask) ||
    ('currentPrice' in ticker &&
      (!ticker.currentPrice || !ticker.currentPrice.raw))
  ) {
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
    if (isCrypto(pair)) {
      return balance[second] / (price || (ticker as Ticker).ask!)
    } else {
      return Math.floor(
        (balance[second] * feeMultiplier(isMarket)) /
          (price || (ticker as NasdaqTicker).currentPrice.raw)
      )
    }
  } else {
    return balance[first]
  }
}
