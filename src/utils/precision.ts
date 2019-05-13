// Dependencies
import * as store from '../plugins/store'

export function precision(pairOrCurrency: string) {
  const currency = pairOrCurrency.substr(0, 3)
  for (const ticker of store.tickers()) {
    if (ticker.pair.substr(0, 3).toUpperCase() === currency.toUpperCase()) {
      return ticker.pricePrecision
    }
  }
  return 2
}
