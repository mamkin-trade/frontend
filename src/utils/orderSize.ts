// Dependencies
import * as store from '../plugins/store'
import { Big } from 'big.js'

export function minimumOrderSize(currency: string) {
  for (const ticker of store.tickers()) {
    if (ticker.pair.toUpperCase() === currency.toUpperCase()) {
      return new Big(ticker.minimumOrderSize)
    }
  }
  for (const ticker of store.nasdaqTickers()) {
    if (ticker.symbol.toUpperCase() === currency.toUpperCase()) {
      return new Big(20).div(ticker.currentPrice.raw).round(0, 3)
    }
  }
  return new Big(1)
}

export function maximumOrderSize(currency: string) {
  for (const ticker of store.tickers()) {
    if (ticker.pair.toUpperCase() === currency.toUpperCase()) {
      return new Big(ticker.maximumOrderSize)
    }
  }
  return new Big(100000000)
}
