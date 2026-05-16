import Stripe from "stripe";

let _stripe: Stripe | undefined;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");
  }
  return _stripe;
}

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    messagesPerDay: 20,
  },
  pro: {
    name: "Pro",
    price: 19,
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
    messagesPerDay: Infinity,
  },
  enterprise: {
    name: "Enterprise",
    price: 49,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "",
    messagesPerDay: Infinity,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
