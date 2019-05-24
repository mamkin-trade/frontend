export interface User {
  _id: string
  email?: string
  facebookId?: string
  telegramId?: string
  vkId?: string

  name: string
  balance: { [index: string]: number }
  overallBalance: number
  ordersBalance: number

  token?: string
}
