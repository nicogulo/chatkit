"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { User, Key, CreditCard, LogOut, Save, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const profileSchema = z.object({
  displayName: z.string().min(1, "Name is required").max(50),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (data: ProfileValues) => {
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ display_name: data.displayName })
        .eq("id", user.id);

      if (updateError) throw updateError;
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/chat" className="text-sm text-muted-foreground hover:text-foreground transition">
              ← Chat
            </Link>
            <span className="text-lg font-semibold">Settings</span>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="space-y-6">
          {/* Profile */}
          <div className="rounded-xl border border-border/50 bg-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Profile</h2>
                <p className="text-xs text-muted-foreground">Update your display name</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Display Name</label>
                <input
                  {...register("displayName")}
                  placeholder="Your name"
                  className="mt-1.5 w-full rounded-lg bg-muted/50 px-3 py-2.5 text-sm border border-border focus:border-primary/50 outline-none transition"
                />
                {errors.displayName && (
                  <p className="mt-1 text-xs text-destructive">{errors.displayName.message}</p>
                )}
              </div>

              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                {saved ? "Saved!" : "Save Changes"}
              </button>
            </form>
          </div>

          {/* API Keys Info */}
          <div className="rounded-xl border border-border/50 bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Key className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">AI Models</h2>
                <p className="text-xs text-muted-foreground">Connected via ZAI API</p>
              </div>
            </div>

            <div className="space-y-2">
              {["GLM-4.7 Flash", "GLM-4.7", "GLM-5"].map((model, i) => (
                <div
                  key={model}
                  className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2"
                >
                  <span className="text-sm">{model}</span>
                  <span className={`text-xs ${i < 2 ? "text-green-400" : "text-amber-400"}`}>
                    {i < 2 ? "Available" : "Pro only"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Billing */}
          <Link
            href="/settings/billing"
            className="block rounded-xl border border-border/50 bg-card p-6 transition hover:bg-card/80"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold">Billing</h2>
                <p className="text-xs text-muted-foreground">
                  Manage subscription and view usage
                </p>
              </div>
              <span className="text-sm text-muted-foreground">→</span>
            </div>
          </Link>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-left transition hover:bg-destructive/10"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
              <LogOut className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <h2 className="font-semibold text-destructive">Sign Out</h2>
              <p className="text-xs text-muted-foreground">
                End your current session
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
