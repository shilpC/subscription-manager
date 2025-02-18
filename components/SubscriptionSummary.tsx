"use client"

import { useState, useEffect } from "react"
import type { Subscription } from "@/types/subscription"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SubscriptionSummary() {
  const [totalMonthly, setTotalMonthly] = useState(0)
  const [totalYearly, setTotalYearly] = useState(0)

  useEffect(() => {
    const calculateTotals = () => {
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

        setTotalMonthly(monthly)
        setTotalYearly(yearly)
      }
    }

    calculateTotals()
    window.addEventListener("subscriptionAdded", calculateTotals)
    window.addEventListener("subscriptionUpdated", calculateTotals)

    return () => {
      window.removeEventListener("subscriptionAdded", calculateTotals)
      window.removeEventListener("subscriptionUpdated", calculateTotals)
    }
  }, [])

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg">Monthly Total: ${totalMonthly.toFixed(2)}</p>
        <p className="text-lg">Yearly Total: ${totalYearly.toFixed(2)}</p>
      </CardContent>
    </Card>
  )
}

