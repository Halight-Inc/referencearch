import express from 'express';
import { createPaymentIntent, stripeWebhook } from '../../controllers/v1/stripeController';

const router = express.Router();

router.post('/create-payment-intent', createPaymentIntent);
router.post('/webhook', stripeWebhook);

export default router;
