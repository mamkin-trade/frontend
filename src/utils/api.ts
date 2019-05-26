// Dependencies
import { StatsState } from '../plugins/store'
import axios from 'axios'
import { Ticker } from '../models/ticker'
import { NasdaqTicker } from '../models/nasdaqTicker'
import { User } from '../models/user'
import { Order } from '../models/order'

const base = 'https://backend.mamkin.trade'

export async function getTickers() {
  return (await axios.get(`${base}/market/tickers`)).data as {
    [index: string]: Ticker
  }
}

export async function getNasdaqTickers() {
  return (await axios.get(`${base}/market/nasdaq`)).data as {
    [index: string]: NasdaqTicker
  }
}

export async function getLeaderboard(sortBy?: string, descending?: boolean) {
  let url = `${base}/users/leaderboard?`
  if (sortBy !== undefined) {
    url = `${url}&sortBy=${sortBy}`
  }
  if (descending !== undefined) {
    url = `${url}&descending=${descending}`
  }
  return (await axios.get(url)).data as User[]
}

export async function getOrders(
  user: User | string,
  skip: number,
  limit: number,
  completed?: boolean,
  cancelled?: boolean,
  active?: boolean
) {
  let url = `${base}/orders/user/${
    typeof user === 'string' ? user : (user as User)._id
  }?skip=${skip}&limit=${limit}`
  if (completed !== undefined) {
    url = `${url}&completed=${completed}`
  }
  if (cancelled !== undefined) {
    url = `${url}&cancelled=${cancelled}`
  }
  if (active !== undefined) {
    url = `${url}&active=${active}`
  }
  return (await axios.get(url)).data as {
    count: number
    orders: Order[]
  }
}

export async function postOrder(
  user: User,
  symbol: string,
  amount: string,
  side: string,
  type: string,
  price?: number
) {
  return (await axios.post(
    `${base}/orders/order`,
    { symbol, amount, side, type, price },
    { headers: { token: user.token } }
  )).data as Order
}

export async function deleteOrder(user: User, order: Order) {
  return (await axios.delete(`${base}/orders/order/${order._id}`, {
    headers: { token: user.token },
  })).data as Order
}

export async function loginFacebook(accessToken: string) {
  return (await axios.post(`${base}/login/facebook`, {
    accessToken,
  })).data as User
}

export async function loginGoogle(accessToken: string) {
  return (await axios.post(`${base}/login/google`, {
    accessToken,
  })).data as User
}

export async function loginTelegram(loginInfo: any) {
  return (await axios.post(`${base}/login/telegram`, loginInfo)).data as User
}

export async function loginVk(loginInfo: any) {
  return (await axios.post(`${base}/login/vk`, loginInfo)).data as User
}

export async function getUser(id: string) {
  return (await axios.get(`${base}/users/${id}`)).data as User
}

export async function getStats() {
  return (await axios.get(`${base}/stats`)).data as StatsState
}

export async function reset(user: User) {
  return (await axios.post(
    `${base}/users/reset`,
    {},
    {
      headers: { token: user.token },
    }
  )).data as Order
}

export async function getKeys(user: User) {
  return (await axios.get(`${base}/users/keys`, {
    headers: { token: user.token },
  })).data as string[]
}

export async function addKey(user: User) {
  return (await axios.post(`${base}/users/keys`, undefined, {
    headers: { token: user.token },
  })).data as string
}

export async function deleteKey(user: User, key: string) {
  await axios.delete(`${base}/users/key/${key}`, {
    headers: { token: user.token },
  })
}
