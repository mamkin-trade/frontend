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

export function ordersHeaders(i18n: VueI18n, userId?: string) {
  const result: object[] = [
    {
      text: i18n.t('orders.created'),
      value: 'createdAt',
      sortable: false,
    },
    { text: i18n.t('pair'), value: 'symbol', sortable: false },
    {
      text: i18n.t('amount'),
      value: 'amount',
      sortable: false,
    },
    {
      text: i18n.t('price'),
      value: 'price',
      sortable: false,
    },
    {
      text: i18n.t('side'),
      value: 'side',
      sortable: false,
    },
    {
      text: i18n.t('type'),
      value: 'type',
      sortable: false,
    },
    {
      text: i18n.t('orders.status'),
      value: 'status',
      sortable: false,
    },
    {
      text: i18n.t('orders.fee'),
      value: 'fee',
      sortable: false,
    },
  ]
  if (!userId) {
    result.unshift({
      sortable: false,
    })
  }
  return result
}

export function leaderboardHeaders(i18n: VueI18n) {
  return [
    {
      text: '#',
      value: 'index',
      sortable: false,
    },
    { text: i18n.t('leaderboard.name'), value: 'name', sortable: false },
    {
      text: i18n.t('leaderboard.balance'),
      value: 'overallBalance',
    },
    {
      text: i18n.t('leaderboard.subs'),
      value: 'subCount',
    },
    { sortable: false },
  ]
}
