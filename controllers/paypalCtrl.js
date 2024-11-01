import paypal from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";

dotenv.config();

// Create a new instance of the PayPalClient with the given credentials and environment.

const paypalEnvironment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
export const paypalClient = new paypal.core.PayPalHttpClient(paypalEnvironment);
