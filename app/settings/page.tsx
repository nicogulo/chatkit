export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="mt-8 space-y-6">
          <div className="rounded-xl bg-card p-6">
            <h2 className="font-semibold">Profile</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your account settings
            </p>
          </div>
          <div className="rounded-xl bg-card p-6">
            <h2 className="font-semibold">API Keys</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Configure your AI model API keys
            </p>
          </div>
          <div className="rounded-xl bg-card p-6">
            <h2 className="font-semibold">Billing</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your subscription and usage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
