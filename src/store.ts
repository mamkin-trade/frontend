import Vue from 'vue'
import Vuex from 'vuex'
import { updateRating } from './utils/api'
import { updateTickers } from './utils/api'
import { updateOrders } from './utils/api'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      balance: {
        usd: 0
      },
      _id: '',
      email: '',
      name: '',
      token: '',
      overallBalance: 0,
      formatted: ''
    },
    tickers: [],
    rating: [],
    orders: []
  },
  mutations: {
    setUser: (state, data) => {
      let temp = data

      temp.formatted = temp.overallBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      state.user = data
    },
    logout: (state) => {
      state.user = {
        balance: {
          usd: 0
        },
        _id: '',
        email: '',
        name: '',
        token: '',
        overallBalance: 0,
        formatted: ''
      }
    },
    setTickers: (state, data) => {
      Vue.set(state, 'tickers', data);
    },
    setRating: (state, data) => {
      Vue.set(state, 'rating', data);
    },
    setOrders: (state, data) => {
      Vue.set(state, 'orders', data);
    }
  },
  actions: {

  },
  getters: {
    tickersList: state => {
      return state.tickers;
    },
    ratingList: state => {
      return state.rating;
    },
    ordersList: state => {
      return state.orders;
    },
  }
})

updateRating()
updateTickers()
updateOrders()

setInterval(() => {
  updateRating()
}, 600 * 1000)

setInterval(() => {
  updateTickers()
}, 60 * 1000)

setInterval(() => {
  updateOrders()
}, 10 * 1000)
