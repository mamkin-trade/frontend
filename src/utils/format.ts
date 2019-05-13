// Dependencies
import moment = require('moment')
import { i18n } from '../plugins/i18n'

export function formatNumber(n: number, sig?: number) {
  let res = n
  if (sig !== undefined) {
    const tens = 10 ** sig
    res = Math.floor(n * tens) / tens
  }
  return res.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function formatPair(pair: string) {
  return `${pair.slice(0, 3)}/${pair.slice(3)}`
}

export function formatVolume(volume: number) {
  return volume.toFixed(3)
}

export function formatDate(date: string) {
  return moment(date).format('DD.MM.YYYY hh:mm')
}

export function formatShortDate(date: string) {
  return moment(date).format('MM.DD')
}

export function formatBool(bool: Boolean) {
  return i18n.t(bool ? 'bool.yes' : 'bool.no')
}
