import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Typography, Box, Alert, List, ListItem, ListItemText, Divider } from '@mui/material';

interface PaymentFormProps {
  applicationId: string;
  paymentInfo: {
    totalDue: number;
    message: string;
    breakdown?: {
      principal: 'paid' | 'unpaid';
      coApplicants: Array<{
        email: string;
        status: 'paid' | 'unpaid';
      }>;
    };
  };
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  applicationId,
  paymentInfo,
  onPaymentSuccess,
  onPaymentError
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const response = await fetch('http://localhost:5000/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          applicationId,
          amount: paymentInfo.totalDue * 100 // Convert to cents for Stripe
        })
      });

      const { clientSecret } = await response.json();

      // Confirm payment using PaymentElement
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href // Not strictly needed for embedded flow
        },
        redirect: 'if_required'
      });

      if (stripeError) {
        setError(stripeError.message || 'An error occurred with your payment');
        onPaymentError(stripeError.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        const confirmResponse = await fetch('http://localhost:5000/api/payments/confirm-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            applicationId,
            paymentIntentId: paymentIntent.id
          })
        });
        if (!confirmResponse.ok) {
          throw new Error('Failed to confirm payment');
        }
        setPaymentSuccess(true);
        onPaymentSuccess();
      }
    } catch (err) {
      setError('An error occurred while processing your payment');
      onPaymentError('Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Application Fee Payment
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Please review the payment breakdown below and complete your payment to proceed with your rental application.
        </Typography>
        {paymentInfo.breakdown && (
          <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Payment Breakdown
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary={<b>Principal Applicant</b>}
                  secondary={<span>Status: <b style={{color: paymentInfo.breakdown.principal === 'paid' ? 'green' : 'red'}}>{paymentInfo.breakdown.principal === 'paid' ? 'Paid' : 'Unpaid'}</b></span>}
                />
              </ListItem>
              {paymentInfo.breakdown.coApplicants.map((coApp, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={<span>Co-Applicant: <b>{coApp.email}</b></span>}
                    secondary={<span>Status: <b style={{color: coApp.status === 'paid' ? 'green' : 'red'}}>{coApp.status === 'paid' ? 'Paid' : 'Unpaid'}</b></span>}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          {paymentInfo.message}
        </Typography>
        {paymentSuccess ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            Payment successful! Thank you for your application.
          </Alert>
        ) : paymentInfo.totalDue > 0 && (
          <>
            <Typography variant="h6" color="primary" gutterBottom>
              Total Due: ${paymentInfo.totalDue}
            </Typography>
            <Box sx={{ mt: 2, mb: 2 }}>
              <PaymentElement />
            </Box>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!stripe || processing}
              fullWidth
              sx={{ py: 1.5, fontSize: '1.1rem', mt: 2 }}
            >
              {processing ? 'Processing...' : `Pay $${paymentInfo.totalDue}`}
            </Button>
          </>
        )}
        {paymentInfo.totalDue === 0 && !paymentSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            No payment is required at this time.
          </Alert>
        )}
      </Box>
    </form>
  );
};

export default PaymentForm; 