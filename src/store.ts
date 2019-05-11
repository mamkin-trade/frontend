// Dependencies
import Vue from 'vue'
import Vuex from 'vuex'
import { Ticker } from './models/ticker'
import { User } from './models/user'
import { Order } from './models/order'

Vue.use(Vuex)

interface State {
  user?: User

  tickers: Ticker[]
  leaderboard: User[]
  orders: Order[]
  pair: String
}

const storeOptions = {
  state: {
    user: undefined,

    tickers: [],
    leaderboard: [],
    orders: [],
    pair: 'BTCUSD'
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
    setOrders(state: State, orders: Order[]) {
      state.orders = orders
    },
    setPair(state: State, pair: String) {
      state.pair = pair
    }
  },
  getters: {
    user: (state: State) => state.user,
    tickers: (state: State) => state.tickers,
    leaderboard: (state: State) => state.leaderboard,
    orders: (state: State) => state.orders,
    pair: (state: State) => state.pair,
  },
}

export const store = new Vuex.Store<State>(storeOptions)

// Getters
const getters = store.getters
export const user = () => getters.user as User | undefined
export const pair = () => getters.pair as String

export const tickers = () => getters.tickers as Ticker[]
export const leaderboard = () => getters.leaderboard as User[]
export const orders = () => getters.orders as Order[]

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
export const setOrders = (orders: Order[]) => {
  store.commit('setOrders', orders)
}
export const setPair = (pair: String) => {
  store.commit('setPair', pair)
}
