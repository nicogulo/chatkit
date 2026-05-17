"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { checkEmailVerified } from "@/lib/actions/auth-verify";
import { resendVerificationEmail } from "@/lib/actions/auth-verify";
import { Mail, RefreshCw, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if already verified — redirect to chat if so
  useEffect(() => {
    checkEmailVerified().then((result) => {
      if (result.verified) {
        router.replace("/chat");
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  // Poll every 3 seconds to detect when user confirms email
  useEffect(() => {
    if (checking) return;

    const interval = setInterval(async () => {
      const result = await checkEmailVerified();
      if (result.verified) {
        router.replace("/chat");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [checking, router]);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setError(null);
    const result = await resendVerificationEmail(email);
    if (result.error) {
      setError(result.error);
    } else {
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    }
    setResending(false);
  };

  // Show loader while checking auth status
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
          <Mail className="h-8 w-8 text-primary" />
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a verification link to
          </p>
          {email && (
            <p className="mt-1 text-sm font-medium text-foreground">{email}</p>
          )}
        </div>

        {/* Instructions */}
        <div className="rounded-xl border border-border/50 bg-card p-4 text-left">
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                1
              </span>
              Open your email inbox
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                2
              </span>
              Find the email from ChatKit
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                3
              </span>
              Click the confirmation link
            </li>
          </ol>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Resend */}
        <div className="space-y-3">
          {resent ? (
            <div className="flex items-center justify-center gap-2 text-sm text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              Verification email sent!
            </div>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending || !email}
              className="flex items-center justify-center gap-2 w-full rounded-lg border border-border/50 bg-card px-4 py-2.5 text-sm font-medium hover:bg-card/80 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} />
              {resending ? "Sending..." : "Resend verification email"}
            </button>
          )}
        </div>

        {/* Back to login */}
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
