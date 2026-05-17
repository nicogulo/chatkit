"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export function LandingNavbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user);
      setMounted(true);
    });
  }, []);

  return (
    <nav className="glass sticky top-0 z-50 border-b border-border/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">ChatKit</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 sm:flex">
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Pricing
          </Link>
          {mounted && loggedIn ? (
            <Link
              href="/chat"
              className="glow rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
            >
              Open Chat
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="glow rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-md p-2 text-muted-foreground hover:text-foreground transition sm:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/50 sm:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              <Link
                href="/pricing"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition"
              >
                Pricing
              </Link>
              {mounted && loggedIn ? (
                <Link
                  href="/chat"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
                >
                  Open Chat
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
