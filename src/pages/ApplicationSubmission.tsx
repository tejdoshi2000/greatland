import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  TextField,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  FormControlLabel,
  Switch,
  Chip
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import PaymentForm from '../components/RentalApplication/PaymentForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';

interface Property {
  _id: string;
  title: string;
  price: number;
  location: string;
  description: string;
}

type DocumentType = 'rental' | 'id' | 'ssn' | 'income';

interface Document {
  type: DocumentType;
  file: File;
  preview: string;
}

interface CoApplicant {
  email: string;
  status: 'pending' | 'submitted';
}

const steps = ['Select Property', 'Applicant Information', 'Upload Documents', 'Application Fee & Payment'];

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '');

export default function ApplicationSubmission() {
  const [activeStep, setActiveStep] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [email, setEmail] = useState('');
  const [isPrincipalApplicant, setIsPrincipalApplicant] = useState(true);
  const [numberOfAdults, setNumberOfAdults] = useState(1);
  const [coApplicantEmails, setCoApplicantEmails] = useState<string[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [existingApplication, setExistingApplication] = useState<any>(null);
  const [paymentInfo, setPaymentInfo] = useState<{ totalDue: number, message: string, breakdown?: any } | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/properties');
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
      }
    };

    fetchProperties();
  }, []);

  const checkExistingApplication = async (email: string) => {
    try {
      const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + `/api/rental-applications/email/${email}`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setExistingApplication(data);
          setApplicationId(data._id);
          setSelectedProperty(data.propertyId);
          setIsPrincipalApplicant(data.isPrincipalApplicant);
          setNumberOfAdults(data.numberOfAdults);
          setCoApplicantEmails(data.coApplicantEmails || []);
          // Convert document URLs to Document objects
          const docs = data.documents?.map((doc: any) => ({
            type: doc.type,
            file: new File([], doc.url.split('/').pop() || ''),
            preview: (process.env.REACT_APP_API_URL || 'http://localhost:5000') + (doc.url || '')
          })) || [];
          setDocuments(docs);
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('Error checking existing application:', err);
      return false;
    }
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      if (!selectedProperty) {
        setError('Please select a property');
        return;
      }
    } else if (activeStep === 1) {
      if (!email) {
        setError('Please enter your email');
        return;
      }

      // If principal applicant, require all co-applicant emails if numberOfAdults > 1
      if (isPrincipalApplicant && numberOfAdults > 1) {
        const missingEmails = coApplicantEmails.filter(e => !e.trim());
        if (coApplicantEmails.length !== numberOfAdults - 1 || missingEmails.length > 0) {
          setError('Please enter the email address for each additional adult in the household.');
          return;
        }
      }

      // Check for existing application
      const exists = await checkExistingApplication(email);
      if (!exists) {
        // Always create a new application for this email/property if one does not exist
        const property = properties.find(p => p._id === selectedProperty);
        if (!property) {
          setError('Selected property not found');
          return;
        }
        const applicationData = {
          propertyId: selectedProperty,
          propertyName: property.title,
          propertyAddress: property.location || property.title,
          applicantName: email.split('@')[0],
          applicantEmail: email,
          applicantPhone: '123-456-7890',
          isPrincipalApplicant: isPrincipalApplicant,
          numberOfAdults: numberOfAdults || 1,
          coApplicantEmails: isPrincipalApplicant ? coApplicantEmails : [],
          hasPdfBase64: false,
          pdfBase64: '',
          status: 'generated',
          documents: [],
          documentsSubmitted: false,
          applicationDate: new Date().toISOString(),
          user: '000000000000000000000000'
        };
        try {
          const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/rental-applications', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(applicationData)
          });
          if (!response.ok) {
            const errorData = await response.json();
            setError(errorData.message || 'Failed to create application');
            return;
          }
          const data = await response.json();
          setExistingApplication(data);
          setApplicationId(data._id);
        } catch (err) {
          setError('Failed to create application. Please try again.');
          return;
        }
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } else if (activeStep === 2) {
      // On the documents step, check if all required documents are uploaded
      const requiredTypes: DocumentType[] = ['rental', 'id', 'ssn'];
      const uploadedTypes = documents.map(doc => doc.type);
      const missingTypes = requiredTypes.filter(type => !uploadedTypes.includes(type));
      
      if (missingTypes.length > 0) {
        setError(`Please upload all required documents: ${missingTypes.join(', ')}`);
        return;
      }

      // Update application status to pending_payment
      if (applicationId) {
        try {
          const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + `/api/rental-applications/${applicationId}/status`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              status: 'pending_payment',
              documentsSubmitted: true 
            })
          });

          if (!response.ok) {
            throw new Error('Failed to update application status');
          }
        } catch (err) {
          console.error('Error updating application status:', err);
          setError('Failed to submit application. Please try again.');
          return;
        }
      }

      // Fetch payment info before advancing to payment step
      if (applicationId) {
        setPaymentLoading(true);
        setPaymentError(null);
        try {
          const feeRes = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + `/api/rental-applications/${applicationId}/fee`);
          if (!feeRes.ok) {
            throw new Error('Failed to fetch payment info');
          }
          const feeData = await feeRes.json();
          setPaymentInfo(feeData);
        } catch (err) {
          setPaymentError('Failed to fetch payment info. Please try again.');
          return;
        } finally {
          setPaymentLoading(false);
        }
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
    setError(null);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError(null);
  };

  const handleAddCoApplicant = () => {
    if (coApplicantEmails.length < numberOfAdults - 1) {
      setCoApplicantEmails([...coApplicantEmails, '']);
    }
  };

  const handleCoApplicantEmailChange = (index: number, value: string) => {
    const newEmails = [...coApplicantEmails];
    newEmails[index] = value;
    setCoApplicantEmails(newEmails);
  };

  const handleNumberOfAdultsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setNumberOfAdults(value);
      // Adjust co-applicant emails array if needed
      if (value - 1 < coApplicantEmails.length) {
        setCoApplicantEmails(coApplicantEmails.slice(0, value - 1));
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: Document['type']) => {
    try {
      setLoading(true);
      setError(null);
      const file = event.target.files?.[0];
      if (!file) {
        throw new Error('Please select a file');
      }

      if (!selectedProperty) {
        throw new Error('Please select a property first');
      }

      if (!email) {
        throw new Error('Please enter your email');
      }

      if (!applicationId) {
        setError('Application not found. Please complete the previous step before uploading documents.');
        setLoading(false);
        return;
      }

      const property = properties.find(p => p._id === selectedProperty);
      if (!property) {
        throw new Error('Selected property not found');
      }

      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;
      const pdfBase64 = (base64Data as string).split(',')[1]; // Remove data URL prefix

      // Upload document
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('applicationId', applicationId);

      const uploadResponse = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/rental-applications/upload-document', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || 'Failed to upload document');
      }

      const uploadData = await uploadResponse.json();

      // Update documents state: replace if type exists, else add
      setDocuments(prev => {
        const filtered = prev.filter(doc => doc.type !== type);
        return [
          ...filtered,
          {
            type,
            file,
            preview: (process.env.REACT_APP_API_URL || 'http://localhost:5000') + (uploadData.documents.find((d: any) => d.type === type)?.url || '')
          }
        ];
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handlePaymentSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      navigate('/submission-confirmation');
    }, 2000);
  };

  useEffect(() => {
    if (
      applicationId &&
      paymentInfo &&
      typeof paymentInfo.totalDue === 'number' &&
      paymentInfo.totalDue > 0
    ) {
      fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/payments/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, amount: paymentInfo.totalDue * 100 })
      })
        .then(res => res.json())
        .then(data => setClientSecret(data.clientSecret));
    } else {
      setClientSecret(null);
    }
  }, [applicationId, paymentInfo]);

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="Select Property"
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              sx={{ mb: 2 }}
            >
              {properties.map((property) => (
                <MenuItem key={property._id} value={property._id}>
                  {property.title} - ${property.price}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={isPrincipalApplicant}
                  onChange={(e) => setIsPrincipalApplicant(e.target.checked)}
                />
              }
              label="I am the principal applicant (head of household)"
              sx={{ mb: 2 }}
            />
            {isPrincipalApplicant && (
              <>
                <TextField
                  fullWidth
                  type="number"
                  label="Number of Adults in Household"
                  value={numberOfAdults}
                  onChange={handleNumberOfAdultsChange}
                  inputProps={{ min: 1 }}
                  sx={{ mb: 2 }}
                />
                {coApplicantEmails.map((email, index) => (
                  <TextField
                    key={index}
                    fullWidth
                    label={`Co-Applicant ${index + 1} Email`}
                    type="email"
                    value={email}
                    onChange={(e) => handleCoApplicantEmailChange(index, e.target.value)}
                    sx={{ mb: 2 }}
                  />
                ))}
                {coApplicantEmails.length < numberOfAdults - 1 && (
                  <Button
                    variant="outlined"
                    onClick={handleAddCoApplicant}
                    sx={{ mb: 2 }}
                  >
                    Add Co-Applicant
                  </Button>
                )}
              </>
            )}
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Upload Rental Application (PDF)
                  <input
                    type="file"
                    hidden
                    accept=".pdf"
                    onChange={(e) => handleFileUpload(e, 'rental')}
                  />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Upload Government ID (PDF/Image)
                  <input
                    type="file"
                    hidden
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileUpload(e, 'id')}
                  />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Upload Social Security Card (PDF/Image)
                  <input
                    type="file"
                    hidden
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileUpload(e, 'ssn')}
                  />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Upload Proof of Income (PDF/Image)
                  <input
                    type="file"
                    hidden
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileUpload(e, 'income')}
                  />
                </Button>
              </Grid>
            </Grid>
            {documents.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Uploaded Documents
                </Typography>
                {documents.map((doc, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ flex: 1 }}>
                      {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} Document
                    </Typography>
                    <IconButton onClick={() => removeDocument(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            {paymentLoading ? (
              <CircularProgress />
            ) : paymentError ? (
              <Alert severity="error">{paymentError}</Alert>
            ) : paymentInfo ? (
              <>
                <Typography variant="h6" gutterBottom>
                  {paymentInfo.message}
                </Typography>
                {paymentInfo.totalDue > 0 ? (
                  applicationId && clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <PaymentForm
                        applicationId={applicationId}
                        paymentInfo={paymentInfo}
                        onPaymentSuccess={handlePaymentSuccess}
                        onPaymentError={setPaymentError}
                      />
                    </Elements>
                  ) : (
                    <Alert severity="error">Payment form is not ready. Please refresh the page or contact support.</Alert>
                  )
                ) : (
                  <Alert severity="success">No payment is required at this time.</Alert>
                )}
              </>
            ) : (
              <Typography>No payment information available.</Typography>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        {!isPrincipalApplicant && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <b>Co-Applicant Instructions:</b><br />
            1. Enter the <b>same property</b> and <b>your email address</b> as provided by your principal applicant.<br />
            2. Upload all required documents.<br />
            3. If your principal applicant has already paid, you will not be asked to pay again.<br />
            4. If you encounter any issues, please contact the principal applicant or support.
          </Alert>
        )}
        <Typography variant="h4" gutterBottom align="center">
          Rental Application
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {existingApplication ? 'Application loaded successfully!' : 'Document uploaded successfully!'}
          </Alert>
        )}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}
        {getStepContent(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === steps.length - 1 || loading}
          >
            {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 