// Dependencies
import { getLeaderboard, getTickers, getOrders } from './api'
import * as store from '../plugins/store'

export function startUpdatingData() {
  updateLeaderboard()
  updateTickers()

  setInterval(updateLeaderboard, 10 * 1000)
  setInterval(updateTickers, 10 * 1000)
}

let leaderboardUpdating = false
async function updateLeaderboard() {
  if (leaderboardUpdating) {
    return
  }
  leaderboardUpdating = true
  try {
    store.setLeaderboard(await getLeaderboard())
  } finally {
    leaderboardUpdating = false
  }
}

let tickersUpdating = false
async function updateTickers() {
  if (tickersUpdating) {
    return
  }
  tickersUpdating = true
  try {
    store.setTickers(Object.values(await getTickers()))
  } finally {
    tickersUpdating = false
  }
}
