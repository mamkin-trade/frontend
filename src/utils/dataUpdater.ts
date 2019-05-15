// Dependencies
import * as api from './api'
import * as store from '../plugins/store'

export function startUpdatingData() {
  updateLeaderboard()
  updateTickers()
  updateUser()

  setInterval(updateLeaderboard, 10 * 1000)
  setInterval(updateTickers, 10 * 1000)
  setInterval(updateUser, 10 * 1000)
}

let leaderboardUpdating = false
export async function updateLeaderboard() {
  if (leaderboardUpdating) {
    return
  }
  leaderboardUpdating = true
  try {
    store.setLeaderboard(await api.getLeaderboard())
  } finally {
    leaderboardUpdating = false
  }
}

let tickersUpdating = false
export async function updateTickers() {
  if (tickersUpdating) {
    return
  }
  tickersUpdating = true
  try {
    store.setTickers(Object.values(await api.getTickers()))
  } finally {
    tickersUpdating = false
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
      store.setUser({ ...(await api.getUser(user._id)), token: user.token })
    }
  } finally {
    userUpdating = false
  }
}
