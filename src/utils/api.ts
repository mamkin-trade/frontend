import axios from 'axios'
import store from '../store'
import { Ticker } from '../models/ticker'
import { User } from '../models/user'

const API_URL = 'https://backend.mamkin.trade/'

export async function updateTickers() {
  const data = (await axios.get(API_URL + 'market/tickers')).data as {
    [index: string]: Ticker
  }
  store.commit(
    'setTickers',
    Object.values(data).filter(ticker => !!ticker.volume)
  )
}

export async function updateRating() {
  const users = (await axios.get(API_URL + 'users/leaderboard')).data as User[]
  store.commit('setRating', users)
}