import { Router } from 'express';
import Stripe from 'stripe';
import { authenticateToken } from '../../auth';

const router = Router();
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe secret key is not defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia',
});

router.post('/create-payment-intent', authenticateToken, async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({ error: (error as Error).message });
    }
});

export default router;