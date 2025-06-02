const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');
const RentalApplication = require('../models/RentalApplication');

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { applicationId, amount } = req.body;

    // Verify application exists
    const application = await RentalApplication.findOne({
      _id: applicationId
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Create payment intent with the specified amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: 'usd',
      metadata: {
        applicationId: applicationId
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
});

// Handle successful payment
router.post('/confirm-payment', async (req, res) => {
  try {
    const { applicationId, paymentIntentId } = req.body;

    // Verify application exists
    const application = await RentalApplication.findOne({
      _id: applicationId
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    // Update application status
    application.paymentStatus = 'completed';
    application.paymentId = paymentIntentId;
    application.paymentAmount = paymentIntent.amount / 100; // Convert from cents to dollars
    
    // If documents are submitted, mark as submitted
    if (application.documentsSubmitted) {
      application.status = 'submitted';
    } else {
      application.status = 'pending_submission';
    }
    
    await application.save();

    // If principal applicant, update co-applicants' paymentStatus if all fees are covered
    if (application.isPrincipalApplicant && Array.isArray(application.coApplicantEmails) && application.coApplicantEmails.length > 0) {
      // Find all co-applicant applications in the same household
      const coApps = await RentalApplication.find({
        applicantEmail: { $in: application.coApplicantEmails },
        householdId: application.householdId
      });
      // Update paymentStatus and status for each co-applicant if not already completed
      for (const coApp of coApps) {
        if (coApp.paymentStatus !== 'completed') {
          coApp.paymentStatus = 'completed';
          if (coApp.documentsSubmitted) {
            coApp.status = 'submitted';
          } else {
            coApp.status = 'pending_submission';
          }
          await coApp.save();
        }
      }
    }

    res.json({
      message: 'Payment confirmed and application updated',
      application
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Error confirming payment' });
  }
});

// Webhook to handle Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const applicationId = paymentIntent.metadata.applicationId;

      try {
        const application = await RentalApplication.findById(applicationId);
        if (application) {
          application.paymentStatus = 'completed';
          application.stripePaymentId = paymentIntent.id;
          
          // If documents are submitted, mark as submitted
          if (application.documentsSubmitted) {
            application.status = 'submitted';
          } else {
            application.status = 'pending_submission';
          }
          
          await application.save();
          console.log('Application updated after successful payment:', applicationId);
        }
      } catch (error) {
        console.error('Error updating application after payment:', error);
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      const failedApplicationId = failedPayment.metadata.applicationId;

      try {
        const application = await RentalApplication.findById(failedApplicationId);
        if (application) {
          application.paymentStatus = 'failed';
          await application.save();
          console.log('Application updated after failed payment:', failedApplicationId);
        }
      } catch (error) {
        console.error('Error updating application after failed payment:', error);
      }
      break;
  }

  res.json({ received: true });
});

module.exports = router; 