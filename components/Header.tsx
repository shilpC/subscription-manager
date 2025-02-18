"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { Subscription } from "@/types/subscription"

export default function Header() {
  const [monthlySpending, setMonthlySpending] = useState(0)
  const [yearlySpending, setYearlySpending] = useState(0)

  useEffect(() => {
    const calculateSpending = () => {
      const savedSubscriptions = localStorage.getItem("subscriptions")
      if (savedSubscriptions) {
        const subscriptions: Subscription[] = JSON.parse(savedSubscriptions)
        let monthly = 0
        let yearly = 0

        subscriptions.forEach((sub) => {
          if (sub.status === "active") {
            if (sub.billingCycle === "monthly") {
              monthly += sub.cost
              yearly += sub.cost * 12
            } else {
              yearly += sub.cost
              monthly += sub.cost / 12
            }
          }
        })

        setMonthlySpending(monthly)
        setYearlySpending(yearly)
      }
    }

    calculateSpending()
    window.addEventListener("subscriptionAdded", calculateSpending)
    window.addEventListener("subscriptionUpdated", calculateSpending)

    return () => {
      window.removeEventListener("subscriptionAdded", calculateSpending)
      window.removeEventListener("subscriptionUpdated", calculateSpending)
    }
  }, [])

  return (
    <header className="flex justify-between items-center p-4 bg-primary text-primary-foreground">
      <div>
        <span className="mr-4">Monthly: ${monthlySpending.toFixed(2)}</span>
        <span>Yearly: ${yearlySpending.toFixed(2)}</span>
      </div>
      <Button variant="secondary">Sign Up</Button>
    </header>
  )
}

