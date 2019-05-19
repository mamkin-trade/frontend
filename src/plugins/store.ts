// Dependencies
import Vue from 'vue'
import Vuex from 'vuex'
import { Ticker } from '../models/ticker'
import { User } from '../models/user'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

interface CardState {
  name: String
  width: Number
}

interface State {
  user?: User
  tickers: Ticker[]
  leaderboard: User[]
  pair: String
  snackbar: SnackbarState
  language?: String
  dark: Boolean
  favPairs: String[]
  stats?: StatsState
  chartExpanded: Boolean
  layout: CardState[]
  viewEditActive: Boolean
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
    tickers: [],
    leaderboard: [],
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
  },
  mutations: {
    setUser(state: State, user: User) {
      state.user = user
    },
    logout(state: State) {
      state.user = undefined
    },
    setTickers(state: State, tickers: Ticker[]) {
      state.tickers = tickers
    },
    setLeaderboard(state: State, leaderboard: User[]) {
      state.leaderboard = leaderboard
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
  },
  getters: {
    user: (state: State) => state.user,
    tickers: (state: State) => state.tickers,
    leaderboard: (state: State) => state.leaderboard,
    pair: (state: State) => state.pair,
    isLoggedIn: (state: State) => !!state.user,
    currentTicker: (state: State) => {
      for (const ticker of state.tickers) {
        if (ticker.pair === state.pair) {
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
  },
  plugins: [createPersistedState()],
}

export const store = new Vuex.Store<State>(storeOptions)

// Getters
const getters = store.getters

export const user = () => getters.user as User | undefined
export const pair = () => getters.pair as string
export const tickers = () => getters.tickers as Ticker[]
export const leaderboard = () => getters.leaderboard as User[]
export const isLoggedIn = () => getters.isLoggedIn as boolean
export const currentTicker = () => getters.currentTicker as Ticker
export const snackbar = () => getters.snackbar as SnackbarState
export const language = () => getters.language as string | undefined
export const dark = () => getters.dark as boolean
export const favPairs = () => getters.favPairs as string[]
export const stats = () => getters.stats as StatsState
export const chartExpanded = () => getters.chartExpanded as boolean
export const layout = () => getters.layout as CardState[]
export const viewEditActive = () => getters.viewEditActive as Boolean

// Mutations
export const setUser = (user: User) => {
  store.commit('setUser', user)
}
export const logout = () => {
  store.commit('logout')
}
export const setTickers = (tickers: Ticker[]) => {
  store.commit('setTickers', tickers)
}
export const setLeaderboard = (leaderboard: User[]) => {
  store.commit('setLeaderboard', leaderboard)
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
