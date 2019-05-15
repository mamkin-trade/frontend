// Dependencies
import Vue from 'vue'
import Vuex from 'vuex'
import { Ticker } from '../models/ticker'
import { User } from '../models/user'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

interface State {
  user?: User

  tickers: Ticker[]
  leaderboard: User[]
  pair: String

  snackbar: SnackbarState

  language?: String

  dark: Boolean

  favPairs: String[]
}

interface SnackbarState {
  message: String
  submessage?: String
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
      submessage: undefined,
      color: 'success',
    },

    string: undefined,

    dark: false,

    favPairs: [],
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
