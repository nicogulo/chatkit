import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

export const metadata: Metadata = {
  title: "ChatKit — AI Chat SaaS Starter Kit",
  description:
    "Production-ready Next.js AI Chat starter kit with multi-model support, encrypted messages, Supabase auth, and Stripe billing. Ship your AI product in hours.",
  keywords: ["AI chat", "SaaS starter kit", "Next.js", "Supabase", "chatbot", "AI SaaS", "OpenAI", "starter template"],
  authors: [{ name: "ChatKit" }],
  openGraph: {
    title: "ChatKit — AI Chat SaaS Starter Kit",
    description:
      "Production-ready Next.js AI Chat starter kit. Multi-model support, encrypted messages, Stripe billing. Ship your AI product in hours.",
    url: "https://chatkit-ashy.vercel.app",
    siteName: "ChatKit",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatKit — AI Chat SaaS Starter Kit",
    description:
      "Production-ready Next.js AI Chat starter kit. Multi-model support, encrypted messages, Stripe billing.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
