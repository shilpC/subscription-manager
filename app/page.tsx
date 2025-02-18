import SubscriptionList from "@/components/SubscriptionList"
import SubscriptionForm from "@/components/SubscriptionForm"
import SubscriptionSummary from "@/components/SubscriptionSummary"
import SubscriptionReminders from "@/components/SubscriptionReminders"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Subscription Manager</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <SubscriptionList />
        </div>
        <div>
          <SubscriptionForm />
          <SubscriptionSummary />
          <SubscriptionReminders />
        </div>
      </div>
    </main>
  )
}

