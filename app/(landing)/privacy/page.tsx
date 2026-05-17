import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — ChatKit",
  description: "How ChatKit handles your data, messages, and privacy.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: May 2026
      </p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Overview</h2>
          <p className="mt-2">
            ChatKit (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, store, and
            protect your information when you use our AI chat service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. Data We Collect</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Account information:</strong> Email address and display name provided during sign-up.</li>
            <li><strong>Chat messages:</strong> The text you send and the AI responses you receive.</li>
            <li><strong>Usage data:</strong> Token counts, model usage, message frequency, and timestamps.</li>
            <li><strong>Device data:</strong> Browser type, IP address (for rate limiting and security).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. How We Use Your Data</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>To provide and improve the AI chat service.</li>
            <li>To enforce rate limits and prevent abuse.</li>
            <li>To calculate billing and usage quotas.</li>
            <li>To communicate important service updates.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Message Encryption &amp; Security</h2>
          <div className="mt-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="font-medium text-foreground">🔒 Your messages are encrypted at rest.</p>
            <p className="mt-1">
              All chat messages are encrypted using <strong>AES-256-GCM</strong> before being
              stored in our database. This means:
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>Even if our database is compromised, your messages remain unreadable without the encryption key.</li>
              <li>The encryption key never touches the database — it is stored separately in a secure environment.</li>
              <li>Each message uses a unique random initialization vector (IV), making identical messages produce different ciphertext.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Admin Access Policy</h2>
          <p className="mt-2">
            ChatKit administrators <strong>cannot read the content of your messages</strong>.
            Admin access is limited to:
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>Account metadata (email, plan type, role, registration date).</li>
            <li>Usage statistics (message counts, token usage, model used).</li>
            <li>Conversation titles (auto-generated from your first message).</li>
          </ul>
          <p className="mt-2">
            We do not access, read, or moderate individual message content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">6. Third-Party Services</h2>
          <p className="mt-2">ChatKit uses the following third-party services:</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li><strong>Supabase</strong> — Database, authentication, and storage (encrypted at rest and in transit).</li>
            <li><strong>AI Provider</strong> — Messages are sent to our AI provider to generate responses. The provider&apos;s own privacy policy applies to data they process.</li>
            <li><strong>Vercel</strong> — Application hosting (SSL/TLS encrypted).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">7. Data Retention</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Your messages are stored until you delete your conversations or account.</li>
            <li>Usage data is retained for billing and analytics purposes.</li>
            <li>You can request full data deletion by contacting us.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">8. Your Rights</h2>
          <p className="mt-2">You have the right to:</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>Access all data we hold about you.</li>
            <li>Delete your account and all associated data.</li>
            <li>Export your data in a machine-readable format.</li>
            <li>Object to processing of your personal data.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">9. Cookies</h2>
          <p className="mt-2">
            ChatKit uses essential cookies for authentication and session management.
            We do not use tracking cookies or third-party analytics cookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">10. Contact</h2>
          <p className="mt-2">
            For privacy-related questions or data requests, please contact us at the
            email address provided during purchase.
          </p>
        </section>
      </div>

      <div className="mt-12 border-t border-border pt-6 text-center">
        <a href="/terms" className="text-sm text-primary hover:underline">
          Terms of Service →
        </a>
      </div>
    </div>
  );
}
