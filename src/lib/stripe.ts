import Stripe from "stripe";
import config from "../config";

if (!config.stripe_api_secret) {
  throw new Error("Stripe API Secret Key is missing in configuration!");
}

export const stripe = new Stripe(config.stripe_api_secret, {
  apiVersion: "2023-10-01" as any,
});
