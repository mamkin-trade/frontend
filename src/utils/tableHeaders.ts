// Dependencies
import VueI18n from 'vue-i18n'

export function cryptoHeaders(i18n: VueI18n) {
  return [
    {
      text: i18n.t('pair'),
      value: 'pair',
    },
    { text: i18n.t('price'), value: 'lastPrice' },
    { text: i18n.t('tickers.change'), value: 'dailyChangePerc' },
    { text: i18n.t('tickers.volume'), value: 'volume' },
    { text: i18n.t('tickers.buy'), value: 'buy' },
    { text: i18n.t('tickers.sell'), value: 'sell' },
    { text: i18n.t('tickers.spread'), value: 'spread' },
    {
      sortable: false,
    },
  ]
}

export function nasdaqHeaders(i18n: VueI18n) {
  return [
    {
      text: i18n.t('symbol'),
      value: 'symbol',
    },
    { text: i18n.t('price'), value: 'lastPrice' },
    { text: i18n.t('tickers.totalCash'), value: 'totalCash' },
    { text: i18n.t('tickers.grossProfits'), value: 'grossProfits' },
    {
      sortable: false,
    },
  ]
}
