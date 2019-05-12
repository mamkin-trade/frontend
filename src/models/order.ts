export interface Order {
  _id: string
  createdAt: Date
  symbol: string
  amount: number
  price: number
  side: string
  type: string
  completed: boolean
  cancelled: boolean
  completionDate: Date
}
