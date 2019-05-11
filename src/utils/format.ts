import momen from 'moment'
import moment = require('moment');

export function formatNumber(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function formatPair(pair: string) {
  return `${pair.slice(0, 3)}/${pair.slice(3)}`
}

export function formatVolume(volume: number) {
  return volume.toFixed(3)
}

export function formatDate(date: string) {
  return moment(date).format('YYYY-MM-DD hh:mm')
}

export function formatBool(bool: Boolean) {
  if (bool) return 'Yes'
  else return 'No'
}