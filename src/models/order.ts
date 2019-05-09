export interface Order {
  symbol: string
  amount: number
  price	: number
  side: string
  type: string
  completed: boolean
  cancelled: boolean
  completionDate: Date
}