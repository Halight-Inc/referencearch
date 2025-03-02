import express, { Router, Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
});

const router = Router();

export const setRoutes = (app: express.Application) => {
    /**
     * @swagger
     * /api/v1/payment/create-payment-intent:
     *   post:
     *     summary: Create a payment intent
     *     description: Create a payment intent for a given amount.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               amount:
     *                 type: number
     *     responses:
     *       200:
     *         description: The client secret for the payment intent.
     */
    app.post('/api/v1/payment/create-payment-intent', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { amount } = req.body;
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            res.json({
                clientSecret: paymentIntent.client_secret,
            });
        } catch (error) {
            next(error);
        }
    });
};
