const mongoose = require('mongoose');

const rentalApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  propertyName: {
    type: String,
    required: true
  },
  propertyAddress: {
    type: String,
    required: true
  },
  applicantName: {
    type: String,
    required: true
  },
  applicantEmail: {
    type: String,
    required: true,
    index: true // Add index for faster email lookups
  },
  applicantPhone: {
    type: String,
    required: true
  },
  isPrincipalApplicant: {
    type: Boolean,
    default: false
  },
  numberOfAdults: {
    type: Number,
    default: 1
  },
  coApplicantEmails: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  }],
  householdId: {
    type: String,
    index: true // Add index for faster household grouping
  },
  status: {
    type: String,
    enum: ['generated', 'pending_payment', 'pending_submission', 'submitted', 'approved', 'rejected'],
    default: 'generated'
  },
  documents: [{
    type: {
      type: String,
      enum: ['rental', 'id', 'ssn', 'income'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    documentId: {
      type: String,
      default: function() {
        return this.type + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      }
    },
    description: {
      type: String,
      default: ''
    }
  }],
  documentsSubmitted: {
    type: Boolean,
    default: false
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  hasPdfBase64: {
    type: Boolean,
    default: false
  },
  pdfBase64: {
    type: String
  },
  paymentId: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  totalPaymentAmount: {
    type: Number,
    default: 50 // Default application fee
  },
  hasPaid: {
    type: Boolean,
    default: false
  },
  paymentAmount: {
    type: Number,
    default: 0
  },
  paymentSessionId: {
    type: String,
    default: ''
  },
  viewingRequested: {
    type: Boolean,
    default: false
  },
  viewingDate: {
    type: Date
  },
  viewingStatus: {
    type: String,
    enum: ['pending', 'scheduled', 'completed', 'cancelled'],
    default: 'pending'
  },
  submittedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create a compound index for household grouping
rentalApplicationSchema.index({ householdId: 1, applicantEmail: 1 });

// Pre-save middleware to handle household grouping
rentalApplicationSchema.pre('save', async function(next) {
  if (this.isModified('applicantEmail') || this.isModified('coApplicantEmails')) {
    // If this is a principal applicant, create a new household
    if (this.isPrincipalApplicant) {
      this.householdId = this.applicantEmail;
    } else {
      // For additional applicants, try to find their household
      const principalApp = await this.constructor.findOne({
        isPrincipalApplicant: true,
        coApplicantEmails: this.applicantEmail
      });
      if (principalApp) {
        this.householdId = principalApp.householdId;
      }
    }
  }
  this.updatedAt = new Date();
  next();
});

const RentalApplication = mongoose.model('RentalApplication', rentalApplicationSchema);

module.exports = RentalApplication; 