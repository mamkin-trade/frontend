export interface Ticker {
  pair: string
  pricePrecision: number
  initialMargin: string
  minimumMargin: string
  maximumOrderSize: string
  minimumOrderSize: string
  expiration: number
  margin: boolean
  
  bid?: number
  bidSize?: number
  ask?: number
  askSize?: number
  dailyChange?: number
  dailyChangePerc?: number
  lastPrice?: number
  volume?: number
  high?: number
  low?: number
}