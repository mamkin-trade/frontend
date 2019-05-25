// Dependencies
import * as api from './api'
import * as store from '../plugins/store'

export function startUpdatingData() {
  updateTickers()
  updateNasdaqTickers()
  updateUser()
  updateStats()

  setInterval(updateTickers, 10 * 1000)
  setInterval(updateNasdaqTickers, 30 * 60 * 1000)
  setInterval(updateUser, 10 * 1000)
  setInterval(updateStats, 60 * 1000)
}

let tickersUpdating = false
export async function updateTickers() {
  if (tickersUpdating) {
    return
  }
  tickersUpdating = true
  try {
    store.setTickers(Object.values(await api.getTickers()))
    store.setTickersUpdated(new Date())
  } finally {
    tickersUpdating = false
  }
}

let nasdaqTickersUpdating = false
export async function updateNasdaqTickers() {
  if (nasdaqTickersUpdating) {
    return
  }
  nasdaqTickersUpdating = true
  try {
    store.setNasdaqTickers(Object.values(await api.getNasdaqTickers()))
    store.setNasdaqTickersUpdated(new Date())
  } finally {
    nasdaqTickersUpdating = false
  }
}

let userUpdating = false
export async function updateUser() {
  if (userUpdating) {
    return
  }
  userUpdating = true
  try {
    const user = store.user()
    if (user) {
      store.setUser({
        ...(await api.getUser(user._id)),
        token: user.token,
        email: user.email,
        facebookId: user.facebookId,
        telegramId: user.telegramId,
        vkId: user.vkId,
      })
      store.setUserUpdated(new Date())
    }
  } finally {
    userUpdating = false
  }
}

let statsUpdating = false
export async function updateStats() {
  if (statsUpdating) {
    return
  }
  statsUpdating = true
  try {
    store.setStats(await api.getStats())
  } finally {
    statsUpdating = false
  }
}
