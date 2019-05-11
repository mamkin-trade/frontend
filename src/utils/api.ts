import axios from 'axios'
import { Ticker } from '../models/ticker'
import { User } from '../models/user'
import { Order } from '../models/order'

const API_URL = 'https://backend.mamkin.trade/'

export async function getTickers() {
  return (await axios.get(API_URL + 'market/tickers')).data as {
    [index: string]: Ticker
  }
}

export async function getLeaderboard() {
  return (await axios.get(API_URL + 'users/leaderboard')).data as User[]
}

export async function getOrders(user: User) {
  return (await axios.get(API_URL + 'orders/user/' + user._id)).data as Order[]
}

export async function createOrder(user: User, symbol: String, amount: Number, side: String, type: String) {
  return (await axios.post(API_URL + 'orders/order/', {symbol: symbol, amount: +amount, side: side, type: type}, {headers: {token: user.token}})).data as Order[]
}

export async function loginFacebook(accessToken: string) {
  return (await axios.post('https://backend.mamkin.trade/login/facebook', {
    accessToken,
  })).data as User
}
