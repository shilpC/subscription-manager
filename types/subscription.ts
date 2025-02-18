export interface Subscription {
  id: string
  name: string
  cost: number
  billingCycle: "monthly" | "yearly"
  nextPaymentDate: string
  status: "active" | "cancelled"
  currency: string
  autoPayment: boolean
}

