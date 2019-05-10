// Dependencies
import Vue from 'vue'
import Vuex from 'vuex'
import { Ticker } from './models/ticker'
import { User } from './models/user'
import { Order } from './models/order'
import { getStoreAccessors } from 'vuex-typescript'

Vue.use(Vuex)

interface State {
  user?: User

  tickers: Ticker[]
  leaderboard: User[]
  orders: Order[]
}

const storeOptions = {
  state: {
    tickers: [],
    leaderboard: [],
    orders: [],
  },
  mutations: {
    setUser: (state: State, user: User) => {
      state.user = user
    },
    logout: (state: State) => {
      state.user = undefined
    },

    setTickers: (state: State, tickers: Ticker[]) => {
      Vue.set(state, 'tickers', tickers)
    },
    setLeaderboard: (state: State, leaderboard: User[]) => {
      Vue.set(state, 'leaderboard', leaderboard)
    },
    setOrders: (state: State, orders: Order[]) => {
      Vue.set(state, 'orders', orders)
    },
  },
  getters: {
    user: (state: State) => state.user,

    tickers: (state: State) => state.tickers,
    leaderboard: (state: State) => state.leaderboard,
    orders: (state: State) => state.orders,
  },
}

export const store = new Vuex.Store<State>(storeOptions)

const { commit, read } = getStoreAccessors<State, State>('')

const getters = storeOptions.getters
export const user = read(getters.user)

export const tickers = read(getters.tickers)
export const leaderboard = read(getters.leaderboard)
export const orders = read(getters.orders)

const mutations = storeOptions.mutations
export const setUser = commit(mutations.setUser)
export const logout = commit(mutations.logout)

export const setTickers = commit(mutations.setTickers)
export const setLeaderboard = commit(mutations.setLeaderboard)
export const setOrders = commit(mutations.setOrders)
