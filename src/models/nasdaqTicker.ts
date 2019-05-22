export interface NasdaqTicker {
  symbol: string
  currentPrice: {
    raw: number
    fmt: string
  }
  totalCash?: {
    raw: number
    fmt: string
    longFmt: string
  }
  totalCashPerShare?: {
    raw: number
    fmt: string
  }
  totalRevenue?: {
    raw: number
    fmt: string
    longFmt: string
  }
  grossProfits?: {
    raw: number
    fmt: string
    longFmt: string
  }
  earningsGrowth?: {
    raw: number
    fmt: string
  }
  revenueGrowth?: {
    raw: number
    fmt: string
  }
}
