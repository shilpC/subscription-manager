"use client"

import { useState, useEffect } from "react"
import type { Subscription } from "@/types/subscription"
import SubscriptionItem from "./SubscriptionItem"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Payment from "./Payment"

type SortOption = "name" | "cost" | "date"

export default function SubscriptionList() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([])
  const [showPayment, setShowPayment] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("name")

  useEffect(() => {
    const loadSubscriptions = () => {
      const savedSubscriptions = localStorage.getItem("subscriptions")
      if (savedSubscriptions) {
        setSubscriptions(JSON.parse(savedSubscriptions))
      }
    }

    loadSubscriptions()
    window.addEventListener("subscriptionAdded", loadSubscriptions)
    window.addEventListener("subscriptionUpdated", loadSubscriptions)

    return () => {
      window.removeEventListener("subscriptionAdded", loadSubscriptions)
      window.removeEventListener("subscriptionUpdated", loadSubscriptions)
    }
  }, [])

  const handleUpdate = (id: string, updates: Partial<Subscription>) => {
    const updatedSubscriptions = subscriptions.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub))
    setSubscriptions(updatedSubscriptions)
    localStorage.setItem("subscriptions", JSON.stringify(updatedSubscriptions))
    window.dispatchEvent(new Event("subscriptionUpdated"))
  }

  const handleDelete = (id: string) => {
    const updatedSubscriptions = subscriptions.filter((sub) => sub.id !== id)
    setSubscriptions(updatedSubscriptions)
    localStorage.setItem("subscriptions", JSON.stringify(updatedSubscriptions))
    window.dispatchEvent(new Event("subscriptionUpdated"))
  }

  const handleSelect = (id: string) => {
    setSelectedSubscriptions((prev) => (prev.includes(id) ? prev.filter((subId) => subId !== id) : [...prev, id]))
  }

  const handlePaySelected = () => {
    setShowPayment(true)
  }

  const totalSelectedAmount = subscriptions
    .filter((sub) => selectedSubscriptions.includes(sub.id))
    .reduce((total, sub) => total + sub.cost, 0)

  const handlePaymentComplete = () => {
    setShowPayment(false)
    setSelectedSubscriptions([])
    // Here you would typically update the subscriptions' next payment dates
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
  }

  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "cost":
        return a.cost - b.cost
      case "date":
        return new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime()
      default:
        return 0
    }
  })

  if (showPayment) {
    return <Payment amount={totalSelectedAmount} onComplete={handlePaymentComplete} onCancel={handlePaymentCancel} />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Your Subscriptions</h2>
        <Select onValueChange={(value: SortOption) => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="cost">Cost</SelectItem>
            <SelectItem value="date">Next Payment Date</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {subscriptions.length === 0 ? (
        <p>No subscriptions added yet.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {sortedSubscriptions.map((subscription) => (
              <SubscriptionItem
                key={subscription.id}
                subscription={subscription}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onSelect={handleSelect}
                isSelected={selectedSubscriptions.includes(subscription.id)}
              />
            ))}
          </ul>
          {selectedSubscriptions.length > 0 && (
            <div className="mt-4">
              <Button onClick={handlePaySelected}>Pay Selected (${totalSelectedAmount.toFixed(2)})</Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

