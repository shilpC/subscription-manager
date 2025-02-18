"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import type { Subscription } from "@/types/subscription"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
]

// Mock exchange rates (in a real app, you'd fetch these from an API)
const exchangeRates = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110,
}

export default function SubscriptionForm() {
  const [name, setName] = useState("")
  const [cost, setCost] = useState("")
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [nextPaymentDate, setNextPaymentDate] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [convertedAmount, setConvertedAmount] = useState<string | null>(null)

  useEffect(() => {
    if (cost && currency !== "USD") {
      const usdAmount = Number.parseFloat(cost) / exchangeRates[currency as keyof typeof exchangeRates]
      setConvertedAmount(`${usdAmount.toFixed(2)} USD`)
    } else {
      setConvertedAmount(null)
    }
  }, [cost, currency])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newSubscription: Subscription = {
      id: uuidv4(),
      name,
      cost: Number.parseFloat(cost),
      billingCycle: billingCycle as "monthly" | "yearly",
      nextPaymentDate,
      status: "active",
      currency,
      autoPayment: false,
    }

    const savedSubscriptions = localStorage.getItem("subscriptions")
    const subscriptions = savedSubscriptions ? JSON.parse(savedSubscriptions) : []
    subscriptions.push(newSubscription)
    localStorage.setItem("subscriptions", JSON.stringify(subscriptions))

    // Reset form
    setName("")
    setCost("")
    setBillingCycle("monthly")
    setNextPaymentDate("")
    setCurrency("USD")

    window.dispatchEvent(new Event("subscriptionAdded"))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subscription Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Subscription Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost">Cost</Label>
            <div className="flex space-x-2">
              <Select onValueChange={setCurrency} defaultValue={currency}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((cur) => (
                    <SelectItem key={cur.code} value={cur.code}>
                      {cur.symbol} {cur.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="cost"
                type="number"
                placeholder="Cost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                required
                min="0"
                step="0.01"
              />
            </div>
            {convertedAmount && <p className="text-sm text-gray-600">Equivalent: {convertedAmount}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="billing-cycle">Billing Cycle</Label>
            <Select onValueChange={setBillingCycle} defaultValue={billingCycle}>
              <SelectTrigger className="w-full" id="billing-cycle">
                <SelectValue placeholder="Select billing cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="next-payment-date">Next Payment Date</Label>
            <Input
              id="next-payment-date"
              type="date"
              value={nextPaymentDate}
              onChange={(e) => setNextPaymentDate(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Add Subscription
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

