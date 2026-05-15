"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";
import { registerWithEmail, registerWithGoogle, registerWithGitHub } from "@/lib/actions/auth-register";

export function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterValues) => {
    setLoading(true);
    setServerError(null);
    const result = await registerWithEmail(data.email, data.password);
    if (result?.error) {
      setServerError(result.error);
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setLoading(true);
    setServerError(null);
    const action = provider === "google" ? registerWithGoogle : registerWithGitHub;
    const result = await action();
    if (result?.error) {
      setServerError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold gradient-text">ChatKit</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your account
          </p>
        </div>

        {serverError && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        {/* OAuth buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleOAuth("google")}
            disabled={loading}
            className="gradient-border w-full rounded-lg bg-card px-4 py-2.5 text-sm font-medium hover:bg-card/80 transition disabled:opacity-50"
          >
            Sign up with Google
          </button>
          <button
            onClick={() => handleOAuth("github")}
            disabled={loading}
            className="gradient-border w-full rounded-lg bg-card px-4 py-2.5 text-sm font-medium hover:bg-card/80 transition disabled:opacity-50"
          >
            Sign up with GitHub
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="mt-1.5 w-full rounded-lg bg-card px-3 py-2.5 text-sm border border-border focus:border-primary outline-none transition"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="Min 8 characters"
              {...register("password")}
              className="mt-1.5 w-full rounded-lg bg-card px-3 py-2.5 text-sm border border-border focus:border-primary outline-none transition"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              placeholder="Repeat password"
              {...register("confirmPassword")}
              className="mt-1.5 w-full rounded-lg bg-card px-3 py-2.5 text-sm border border-border focus:border-primary outline-none transition"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="glow w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
