import express from 'express';
import { createPaymentIntent, stripeWebhook } from '../../controllers/v1/stripeController';
import authenticateToken from '../../middlewares/authMiddleware';

const router = express.Router();

router.post('/create-payment-intent', authenticateToken, createPaymentIntent);
router.post('/webhook', stripeWebhook); // Webhook does not require auth.

export default router;
