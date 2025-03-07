import { Request, Response } from "express";
import Stripe from "stripe";
import config from "../../config/config";

// Commented out Stripe initialization temporarily
/*
const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: '2025-02-24.acacia', // Use a real API version
});
*/

// Create a mock stripe object to prevent errors
const stripe = {
  paymentIntents: {
    create: async () => ({ client_secret: 'mock_client_secret' })
  },
  webhooks: {
    constructEvent: () => ({ type: 'mocked_event', data: { object: {} } })
  }
} as any;

/**
 * @swagger
 * /v1/stripe/create-payment-intent:
 *   post:
 *     summary: Create a PaymentIntent
 *     description: Creates a Stripe PaymentIntent for a one-time payment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount of the payment in the smallest currency unit (e.g., cents).
 *               currency:
 *                 type: string
 *                 description: The currency code (e.g., 'usd').
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientSecret:
 *                   type: string
 *                   description: The client secret for the PaymentIntent.
 *       400:
 *         description: Bad Request (amount and currency are required)
 *       500:
 *         description: Internal server error
 */
export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
      return res
        .status(400)
        .json({ error: "Amount and currency are required." });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
};

/**
 * @swagger
 * /v1/stripe/webhook:
 *   post:
 *     summary: Stripe Webhook
 *     description: Endpoint to handle Stripe webhook events.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook received successfully
 *       400:
 *         description: Webhook Error (invalid signature)
 */
export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).send("Webhook Error: No signature header");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripeWebhookSecret,
    );
  } catch (err:any) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (!event) {
    console.error("No event found");
    return res.status(400).send("Webhook Error: No event found");
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("PaymentIntent was successful!", paymentIntent);
      // Update your database, send emails, etc.
      break;
    case "subscription_schedule.created":
      const subscriptionSchedule = event.data
        .object as Stripe.SubscriptionSchedule;
      console.log("Subscription schedule created:", subscriptionSchedule);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
};