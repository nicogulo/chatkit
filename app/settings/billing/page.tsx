export default function BillingPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold">Billing</h1>
        <div className="mt-8 rounded-xl bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Free Plan</h2>
              <p className="text-sm text-muted-foreground">10 messages per day</p>
            </div>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition">
              Upgrade to Pro
            </button>
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-card p-6">
          <h2 className="font-semibold">Usage this month</h2>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Messages sent</span>
              <span>7 / 10</span>
            </div>
            <div className="h-2 rounded-full bg-secondary">
              <div className="h-2 rounded-full bg-primary" style={{ width: "70%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
