// filepath: /C:/code/referencearch/my-react-app/src/Payment.tsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripeKey = typeof process !== 'undefined' && process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY : '';

const stripePromise = loadStripe(stripeKey);

const CheckoutForm: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    interface PaymentIntentResponse {
        clientSecret: string;
    }

    interface ConfirmCardPaymentResult {
        error?: {
            message: string;
        };
        paymentIntent?: {
            status: string;
        };
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        try {
            const { data: { clientSecret } } = await axios.post<PaymentIntentResponse>(`${process.env.API_URL}/v1/payment/create-payment-intent`, {
                amount: 1000, // Amount in cents
            });

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement!,
                },
            }) as ConfirmCardPaymentResult;

            if (error) {
                setError(error.message);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                setSuccess(true);
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe}>
                Pay
            </button>
            {error && <div>{error}</div>}
            {success && <div>Payment successful!</div>}
        </form>
    );
};

const Payment: React.FC = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
};

export default Payment;