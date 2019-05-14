// Dependencies
import * as store from '../plugins/store'
import { Big } from 'big.js'

export function minimumOrderSize(currency: string) {
  for (const ticker of store.tickers()) {
    if (ticker.pair.toUpperCase() === currency.toUpperCase()) {
      return new Big(ticker.minimumOrderSize)
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
  return new Big(1)
}
