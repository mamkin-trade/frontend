// Dependencies
import moment = require('moment')
import { i18n } from '../plugins/i18n'
import { precision } from './precision'
import { Big } from 'big.js'
const commaNumber = require('comma-number')

Big.PE = 40
Big.NE = -40

const balanceFormat = commaNumber.bindWith(' ', '.')

interface formatNumberOptions {
  sig?: number
  currency?: string
}

export function formatNumber(n: number, options: formatNumberOptions = {}) {
  let res = new Big(n)
  res.toString()
  if (options.sig !== undefined) {
    res = res.round(options.sig, 0)
  } else if (options.currency) {
    res = res.round(precision(options.currency), 0)
  }
  return balanceFormat(res.toString())
}

export function formatPair(pair: string) {
  return `${pair.slice(0, 3)}/${pair.slice(3)}`
}

export function formatVolume(volume: number) {
  return formatNumber(volume, { sig: 3 })
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
