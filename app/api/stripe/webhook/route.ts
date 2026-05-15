import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { headers } from "next/headers";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Import Supabase client (service role for webhook — bypasses RLS)
  const { createClient: createSupabaseClient } = await import(
    "@supabase/supabase-js"
  );
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0]?.price.id;

      let plan = "free";
      if (priceId === process.env.STRIPE_PRO_PRICE_ID) plan = "pro";
      if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) plan = "enterprise";

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (profile) {
        await supabase.from("subscriptions").upsert({
          user_id: profile.id,
          stripe_subscription_id: subscriptionId,
          plan,
          status: subscription.status,
          current_period_start: new Date(
            (subscription as any).current_period_start * 1000
          ).toISOString(),
          current_period_end: new Date(
            (subscription as any).current_period_end * 1000
          ).toISOString(),
          cancel_at_period_end: (subscription as any).cancel_at_period_end,
        });

        await supabase
          .from("profiles")
          .update({ plan })
          .eq("id", profile.id);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0]?.price.id;

      let plan = "free";
      if (priceId === process.env.STRIPE_PRO_PRICE_ID) plan = "pro";
      if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) plan = "enterprise";

      await supabase
        .from("subscriptions")
        .update({
          plan,
          status: subscription.status,
          current_period_start: new Date(
            (subscription as any).current_period_start * 1000
          ).toISOString(),
          current_period_end: new Date(
            (subscription as any).current_period_end * 1000
          ).toISOString(),
          cancel_at_period_end: (subscription as any).cancel_at_period_end,
        })
        .eq("stripe_subscription_id", subscription.id);

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_subscription_id", subscription.id)
        .single();

      if (sub) {
        await supabase
          .from("profiles")
          .update({ plan })
          .eq("id", sub.user_id);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", subscription.id);

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_subscription_id", subscription.id)
        .single();

      if (sub) {
        await supabase
          .from("profiles")
          .update({ plan: "free" })
          .eq("id", sub.user_id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
