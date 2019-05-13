// Dependencies
import moment = require('moment')
import { i18n } from '../plugins/i18n'
import { precision } from './precision'
const commaNumber = require('comma-number')

const balanceFormat = commaNumber.bindWith(' ', '.')

interface formatNumberOptions {
  sig?: number
  currency?: string
}

export function formatNumber(n: number, options: formatNumberOptions = {}) {
  let res = n
  if (options.sig !== undefined) {
    const tens = 10 ** options.sig
    res = Math.floor(n * tens) / tens
  } else if (options.currency) {
    const tens = 10 ** precision(options.currency)
    res = Math.floor(n * tens) / tens
  }
  return balanceFormat(res)
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
