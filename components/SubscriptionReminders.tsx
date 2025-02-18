"use client"

import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import type { Subscription } from "@/types/subscription"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Bell } from "lucide-react"
import Payment from "./Payment"

export default function SubscriptionReminders() {
  const [upcomingPayments, setUpcomingPayments] = useState<Subscription[]>([])
  const [showPayment, setShowPayment] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)

  useEffect(() => {
    const checkUpcomingPayments = () => {
      const savedSubscriptions = localStorage.getItem("subscriptions")
      if (savedSubscriptions) {
        const subscriptions: Subscription[] = JSON.parse(savedSubscriptions)
        const today = new Date()
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

        const upcoming = subscriptions.filter((sub) => {
          const paymentDate = new Date(sub.nextPaymentDate)
          return paymentDate >= today && paymentDate <= nextWeek && sub.status === "active"
        })

        setUpcomingPayments(upcoming)
      }
    }

    checkUpcomingPayments()
    window.addEventListener("subscriptionAdded", checkUpcomingPayments)
    window.addEventListener("subscriptionUpdated", checkUpcomingPayments)

    return () => {
      window.removeEventListener("subscriptionAdded", checkUpcomingPayments)
      window.removeEventListener("subscriptionUpdated", checkUpcomingPayments)
    }
  }, [])

  const handlePayNow = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setShowPayment(true)
  }

  const handlePaymentComplete = () => {
    setShowPayment(false)
    setSelectedSubscription(null)
    // Here you would typically update the subscription's next payment date
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
    setSelectedSubscription(null)
  }

  if (showPayment && selectedSubscription) {
    return (
      <Payment amount={selectedSubscription.cost} onComplete={handlePaymentComplete} onCancel={handlePaymentCancel} />
    )
  }

  if (upcomingPayments.length === 0) {
    return null
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Upcoming Payments</CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingPayments.map((sub) => (
          <Alert key={sub.id} className="mb-2">
            <Bell className="h-4 w-4" />
            <AlertTitle>{sub.name}</AlertTitle>
            <AlertDescription>
              Payment of ${sub.cost.toFixed(2)} due on {sub.nextPaymentDate}
              <Button variant="link" onClick={() => handlePayNow(sub)}>
                Pay Now
              </Button>
            </AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  )
}

