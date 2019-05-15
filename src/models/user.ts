export interface User {
  _id: string
  email?: string
  facebookId?: string

  name: string
  balance: { [index: string]: number }
  overallBalance: number

  token?: string
}
