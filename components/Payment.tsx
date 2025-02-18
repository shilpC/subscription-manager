"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface PaymentProps {
  amount: number
  onComplete: () => void
  onCancel: () => void
}

export default function Payment({ amount, onComplete, onCancel }: PaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState("credit_card")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically process the payment
    // For this example, we'll just simulate a successful payment
    alert("Payment processed successfully!")
    onComplete()
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Amount to pay: ${amount.toFixed(2)}</Label>
          </div>
          <RadioGroup defaultValue="credit_card" onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="credit_card" id="credit_card" />
              <Label htmlFor="credit_card">Credit Card</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal">PayPal</Label>
            </div>
          </RadioGroup>
          {paymentMethod === "credit_card" && (
            <>
              <Input type="text" placeholder="Card Number" required />
              <div className="flex space-x-2">
                <Input type="text" placeholder="MM/YY" required />
                <Input type="text" placeholder="CVC" required />
              </div>
            </>
          )}
          {paymentMethod === "paypal" && <p>You will be redirected to PayPal to complete your payment.</p>}
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Pay Now</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

