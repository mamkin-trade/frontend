import axios from 'axios'
import store from '../store'

const API_URL = 'https://backend.mamkin.trade/'

export default {
  async getTickers() {
    await axios
      .get(API_URL + 'market/tickers')
      .then(res => {
        console.log(res.data)
        let temp = res.data
        let arr = new Array

        Object.keys(temp).forEach(item => {
            // @ts-ignore
            arr.push(temp[item])
        })

        arr = arr.filter(item => {
          if (item.volume) return item
        })
        
        arr.map(item => {
          item.pairFormatted = item.pair.slice(0,3) + '/' + item.pair.slice(3)
          item.volumeFormatted = item.volume ? item.volume.toFixed(3) : '0'
          item.change = item.dailyChangePerc > 0 ? 'up' : item.dailyChangePerc == 0 ? '' : 'down'
          return item
        })

        store.commit('setTickers', arr)
      })
  },
  async getRating() {
    await axios
      .get(API_URL + 'users/leaderboard')
      .then(res => {
        console.log(res.data)
        let temp = res.data
         //  @ts-ignore
        temp.forEach(item => {
          item.overallBalance = item.overallBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        })

        store.commit('setRating', temp)
        })
  },
}