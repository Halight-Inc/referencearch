import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { authenticateToken } from '../../auth';

// Load environment variables from .env file
dotenv.config();

const router = express.Router();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
    throw new Error('Stripe secret key is not defined');
}

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-02-24.acacia',
});

router.post('/create-payment-intent', authenticateToken, async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: 'usd',
        });
        res.status(201).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
});

export default router;