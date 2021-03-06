// Dependencies
import Vue from 'vue'
import Vuex from 'vuex'
import { Ticker } from '../models/ticker'
import { NasdaqTicker } from '../models/nasdaqTicker'
import { User } from '../models/user'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

interface CardState {
  name: String
  width: Number
}

export interface State {
  user?: User
  userUpdated: Date | null
  tickers: Ticker[]
  tickersUpdated: Date | null
  nasdaqTickers: NasdaqTicker[]
  nasdaqTickersUpdated: Date | null
  pair: String
  snackbar: SnackbarState
  language?: String
  dark: Boolean
  favPairs: String[]
  stats?: StatsState
  chartExpanded: Boolean
  layout: CardState[]
  viewEditActive: Boolean
  tickersSelected: String
}

export interface StatsState {
  userCount: number
  ordersCounr: number
  totalUSDTraded: number
}

interface LocalizedError {
  en: string
  ru: string
}

interface SnackbarState {
  message: String | LocalizedError
  active: Boolean
  color: String
}

const storeOptions = {
  state: {
    user: undefined,
    userUpdated: null,
    tickers: [],
    tickersUpdated: null,
    nasdaqTickers: [],
    nasdaqTickersUpdated: null,
    pair: 'BTCUSD',
    snackbar: {
      message: '',
      active: false,
      color: 'success',
    },
    string: undefined,
    dark: false,
    favPairs: [],
    stats: undefined,
    chartExpanded: true,
    layout: [
      { name: 'OrderForm', width: 3 },
      { name: 'Tickers', width: 9 },
      { name: 'Chart', width: 12 },
      { name: 'Balance', width: 4 },
      { name: 'Orders', width: 8 },
      { name: 'Leaderboard', width: 12 },
    ],
    viewEditActive: false,
    tickersSelected: 'crypto',
  },
  mutations: {
    setUser(state: State, user: User) {
      state.user = user
    },
    setUserUpdated(state: State, userUpdated: Date) {
      state.userUpdated = userUpdated
    },
    logout(state: State) {
      state.user = undefined
    },
    setTickers(state: State, tickers: Ticker[]) {
      state.tickers = tickers
    },
    setTickersUpdated(state: State, tickersUpdated: Date) {
      state.tickersUpdated = tickersUpdated
    },
    setNasdaqTickers(state: State, nasdaqTickers: NasdaqTicker[]) {
      state.nasdaqTickers = nasdaqTickers
    },
    setNasdaqTickersUpdated(state: State, nasdaqTickersUpdated: Date) {
      state.nasdaqTickersUpdated = nasdaqTickersUpdated
    },
    setPair(state: State, pair: String) {
      state.pair = pair
    },
    setSnackbar(state: State, snackbar: SnackbarState) {
      state.snackbar = snackbar
    },
    setLanguage(state: State, language: String) {
      state.language = language
    },
    setDark(state: State, dark: Boolean) {
      state.dark = dark
    },
    setFavPairs(state: State, favPairs: String[]) {
      state.favPairs = favPairs
    },
    setStats(state: State, stats: StatsState) {
      state.stats = stats
    },
    setChartExpanded(state: State, chartExpanded: Boolean) {
      state.chartExpanded = chartExpanded
    },
    setLayout(state: State, layout: CardState[]) {
      state.layout = layout
    },
    setViewEditActive(state: State, viewEditActive: Boolean) {
      state.viewEditActive = viewEditActive
    },
    setTickersSelected(state: State, tickersSelected: String) {
      state.tickersSelected = tickersSelected
    },
  },
  getters: {
    user: (state: State) => state.user,
    userUpdated: (state: State) => state.userUpdated,
    tickers: (state: State) => state.tickers,
    tickersUpdated: (state: State) => state.tickersUpdated,
    nasdaqTickers: (state: State) => state.nasdaqTickers,
    nasdaqTickersUpdated: (state: State) => state.nasdaqTickersUpdated,
    pair: (state: State) => state.pair,
    isLoggedIn: (state: State) => !!state.user,
    currentTicker: (state: State) => {
      for (const ticker of state.tickers) {
        if (ticker.pair === state.pair) {
          return ticker
        }
      }
      for (const ticker of state.nasdaqTickers) {
        if (ticker.symbol === state.pair) {
          return ticker
        }
      }
    },
    snackbar: (state: State) => state.snackbar,
    language: (state: State) => state.language,
    dark: (state: State) => state.dark,
    favPairs: (state: State) => state.favPairs,
    stats: (state: State) => state.stats,
    chartExpanded: (state: State) => state.chartExpanded,
    layout: (state: State) => state.layout,
    viewEditActive: (state: State) => state.viewEditActive,
    tickersSelected: (state: State) => state.tickersSelected,
  },
  plugins: [createPersistedState()],
}

export const store = new Vuex.Store<State>(storeOptions)

// Getters
const getters = store.getters

export const user = () => getters.user as User | undefined
export const userUpdated = () => getters.userUpdated as Date | null
export const pair = () => getters.pair as string
export const tickers = () => getters.tickers as Ticker[]
export const tickersUpdated = () => getters.tickersUpdated as Date | null
export const nasdaqTickers = () => getters.nasdaqTickers as NasdaqTicker[]
export const nasdaqTickersUpdated = () =>
  getters.nasdaqTickersUpdated as Date | null
export const isLoggedIn = () => getters.isLoggedIn as boolean
export const currentTicker = () =>
  getters.currentTicker as Ticker | NasdaqTicker
export const snackbar = () => getters.snackbar as SnackbarState
export const language = () => getters.language as string | undefined
export const dark = () => getters.dark as boolean
export const favPairs = () => getters.favPairs as string[]
export const stats = () => getters.stats as StatsState
export const chartExpanded = () => getters.chartExpanded as boolean
export const layout = () => getters.layout as CardState[]
export const viewEditActive = () => getters.viewEditActive as Boolean
export const tickersSelected = () => getters.tickersSelected as String

// Mutations
export const setUser = (user: User) => {
  store.commit('setUser', user)
}
export const setUserUpdated = (userUpdated: Date) => {
  store.commit('setUserUpdated', userUpdated)
}
export const logout = () => {
  store.commit('logout')
}
export const setTickers = (tickers: Ticker[]) => {
  store.commit('setTickers', tickers)
}
export const setTickersUpdated = (tickersUpdated: Date) => {
  store.commit('setTickersUpdated', tickersUpdated)
}
export const setNasdaqTickers = (nasdaqTickers: NasdaqTicker[]) => {
  store.commit('setNasdaqTickers', nasdaqTickers)
}
export const setNasdaqTickersUpdated = (nasdaqTickersUpdated: Date) => {
  store.commit('setNasdaqTickersUpdated', nasdaqTickersUpdated)
}
export const setPair = (pair: String) => {
  store.commit('setPair', pair)
}
export const setSnackbar = (snackbar: SnackbarState) => {
  store.commit('setSnackbar', snackbar)
}
export const hideSnackbar = () => {
  store.commit('setSnackbar', { ...store.state.snackbar, active: false })
}
export const setLanguage = (language: String) => {
  store.commit('setLanguage', language)
}
export const setDark = (dark: Boolean) => {
  store.commit('setDark', dark)
}
export const setFavPairs = (favPairs: String[]) => {
  store.commit('setFavPairs', favPairs)
}
export const setStats = (stats: StatsState) => {
  store.commit('setStats', stats)
}
export const setChartExpanded = (chartExpanded: Boolean) => {
  store.commit('setChartExpanded', chartExpanded)
}
export const setLayout = (layout: CardState[]) => {
  store.commit('setLayout', layout)
}
export const setViewEditActive = (viewEditActive: Boolean) => {
  store.commit('setViewEditActive', viewEditActive)
}
export const setTickersSelected = (tickersSelected: String) => {
  store.commit('setTickersSelected', tickersSelected)
}

export const moveCard = (name: string, forward: boolean) => {
  const layout = store.state.layout
  let index = undefined
  for (const card of layout) {
    if (card.name === name) {
      index = layout.indexOf(card)
      break
    }
  }
  if (
    index === undefined ||
    (index <= 0 && !forward) ||
    (index >= layout.length - 1 && forward)
  ) {
    return
  }
  const card = layout.splice(index, 1)[0]
  layout.splice(forward ? index + 1 : index - 1, 0, card)
  store.commit('setLayout', layout)
}
export const changeCardSize = (name: string, increment: boolean) => {
  const layout = store.state.layout
  let index = undefined
  for (const card of layout) {
    if (card.name === name) {
      index = layout.indexOf(card)
      break
    }
  }
  if (index === undefined) {
    return
  }
  const card = layout.splice(index, 1)[0]
  if ((card.width < 12 && increment) || (card.width > 3 && !increment)) {
    card.width = increment ? Number(card.width) + 1 : Number(card.width) - 1
  }
  layout.splice(index, 0, card)
  store.commit('setLayout', layout)
}
