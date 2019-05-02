import Vue from 'vue'
import Vuex from 'vuex'

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
    }
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
    }
  },
  actions: {

  }
})
