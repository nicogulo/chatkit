import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

export const metadata: Metadata = {
  title: "ChatKit — AI Chat SaaS Starter Kit",
  description:
    "Production-ready Next.js AI Chat starter kit. Multi-model support, Stripe billing, Supabase auth. Ship your AI product in hours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ "--font-sans": "system-ui, -apple-system, sans-serif", "--font-mono": "ui-monospace, SFMono-Regular, monospace" } as React.CSSProperties}>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
