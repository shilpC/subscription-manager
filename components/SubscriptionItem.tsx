"use client"

import { useState } from "react"
import type { Subscription } from "@/types/subscription"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Payment from "./Payment"

interface SubscriptionItemProps {
  subscription: Subscription
  onUpdate: (id: string, updates: Partial<Subscription>) => void
  onDelete: (id: string) => void
  onSelect: (id: string) => void
  isSelected: boolean
}

export default function SubscriptionItem({
  subscription,
  onUpdate,
  onDelete,
  onSelect,
  isSelected,
}: SubscriptionItemProps) {
  const [showPayment, setShowPayment] = useState(false)
  const [pendingBillingCycle, setPendingBillingCycle] = useState<"monthly" | "yearly" | null>(null)

  const handleBillingCycleChange = (value: string) => {
    if (value === "monthly" || value === "yearly") {
      if (subscription.billingCycle === "monthly" && value === "yearly") {
        setPendingBillingCycle("yearly")
        setShowPayment(true)
      } else {
        onUpdate(subscription.id, { billingCycle: value })
      }
    }
  }

  const handleCancel = () => {
    onUpdate(subscription.id, { status: "cancelled" })
  }

  const handlePaymentComplete = () => {
    if (pendingBillingCycle) {
      onUpdate(subscription.id, { billingCycle: pendingBillingCycle })
    }
    setShowPayment(false)
    setPendingBillingCycle(null)
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
    setPendingBillingCycle(null)
  }

  const handleAutoPaymentChange = (checked: boolean) => {
    onUpdate(subscription.id, { autoPayment: checked })
  }

  const yearlyAmount = subscription.cost * 12

  if (showPayment) {
    return <Payment amount={yearlyAmount} onComplete={handlePaymentComplete} onCancel={handlePaymentCancel} />
  }

  return (
    <Card className={subscription.status === "cancelled" ? "opacity-50" : ""}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`select-${subscription.id}`}
            checked={isSelected}
            onCheckedChange={() => onSelect(subscription.id)}
          />
          <h3 className="text-lg font-semibold">{subscription.name}</h3>
        </div>
        <p className="text-sm text-gray-600">
          {subscription.currency} {subscription.cost.toFixed(2)} / {subscription.billingCycle}
        </p>
        <p className="text-sm text-gray-600">Next payment: {subscription.nextPaymentDate}</p>
        <p className="text-sm text-gray-600">Status: {subscription.status}</p>
        <div className="flex items-center space-x-2 mt-2">
          <Switch
            id={`auto-payment-${subscription.id}`}
            checked={subscription.autoPayment}
            onCheckedChange={handleAutoPaymentChange}
          />
          <Label htmlFor={`auto-payment-${subscription.id}`}>Auto-payment</Label>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex flex-wrap gap-2">
        {subscription.status === "active" && (
          <>
            <Select onValueChange={handleBillingCycleChange} defaultValue={subscription.billingCycle}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select billing cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel Subscription
            </Button>
          </>
        )}
        <Button variant="destructive" onClick={() => onDelete(subscription.id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}

