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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
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
  documentId?: string;
  description?: string;
}

interface CoApplicant {
  email: string;
  status: 'pending' | 'submitted';
}

const steps = ['Select Property', 'Applicant Information', 'Upload Documents', 'Application Fee & Payment'];

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '');

// Income Document Upload Component
interface IncomeDocumentUploadProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>, type: 'income', description?: string) => void;
}

const IncomeDocumentUpload: React.FC<IncomeDocumentUploadProps> = ({ onUpload }) => {
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [incomeType, setIncomeType] = useState('paystub');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File select event triggered:', event);
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.size);
      setSelectedFile(file);
    } else {
      console.log('No file selected');
    }
  };

  const handleFileButtonClick = () => {
    console.log('File button clicked, triggering file input');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error('File input ref not found');
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile.name);
      // Create a synthetic event for the onUpload callback
      const syntheticEvent = {
        target: {
          files: [selectedFile]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      const finalDescription = description || getDefaultDescription();
      onUpload(syntheticEvent, 'income', finalDescription);
      
      // Reset form
      setDescription('');
      setSelectedFile(null);
      setIncomeType('paystub');
    } else {
      console.error('No file selected for upload');
    }
  };

  const getDefaultDescription = () => {
    const currentDate = new Date();
    switch (incomeType) {
      case 'paystub':
        return `Paystub ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
      case 'social_security':
        return `Social Security Benefits ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
      case 'public_assistance':
        return `Public Assistance ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
      case 'disability':
        return `Disability Benefits ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
      case 'pension':
        return `Pension ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
      case 'other':
        return `Other Income ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
      default:
        return `Income Document ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    }
  };

  const getMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      months.push(monthYear);
    }
    return months;
  };

  return (
    <Box sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1, p: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Upload Proof of Income Documents
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Upload your income documents such as paystubs, social security benefits, public assistance letters, etc.
      </Typography>
      
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Income Type</InputLabel>
            <Select
              value={incomeType}
              onChange={(e) => setIncomeType(e.target.value)}
              label="Income Type"
            >
              <MenuItem value="paystub">Paystub</MenuItem>
              <MenuItem value="social_security">Social Security Benefits</MenuItem>
              <MenuItem value="public_assistance">Public Assistance</MenuItem>
              <MenuItem value="disability">Disability Benefits</MenuItem>
              <MenuItem value="pension">Pension</MenuItem>
              <MenuItem value="other">Other Income</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Period</InputLabel>
            <Select
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              label="Period"
            >
              {getMonthOptions().map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="outlined"
            onClick={handleFileButtonClick}
            fullWidth
            size="small"
          >
            Select File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            accept=".pdf,image/*"
            onChange={handleFileSelect}
          />
          {selectedFile && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Selected: {selectedFile.name}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile}
            fullWidth
            size="small"
            startIcon={<AddIcon />}
          >
            Upload
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

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

  // File input refs
  const rentalFileRef = React.useRef<HTMLInputElement>(null);
  const idFileRef = React.useRef<HTMLInputElement>(null);
  const ssnFileRef = React.useRef<HTMLInputElement>(null);

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

  // Debug environment variables
  useEffect(() => {
    console.log('Environment variables:', {
      REACT_APP_API_URL: process.env.REACT_APP_API_URL,
      NODE_ENV: process.env.NODE_ENV,
      currentLocation: window.location.href
    });
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
            preview: (process.env.REACT_APP_API_URL || 'http://localhost:5000') + (doc.url || ''),
            documentId: doc.documentId || doc._id,
            description: doc.description
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

      // Income documents are optional (applicant might be unemployed)
      // No validation needed for income documents

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: Document['type'], description?: string) => {
    try {
      console.log('handleFileUpload called:', { type, description, event });
      setLoading(true);
      setError(null);
      
      const file = event.target.files?.[0];
      if (!file) {
        throw new Error('Please select a file');
      }

      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });

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

      console.log('Preparing to upload file to:', (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/rental-applications/upload-document');

      // Upload document
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('applicationId', applicationId);
      if (description) {
        formData.append('description', description);
      }

      console.log('FormData prepared:', {
        hasFile: formData.has('file'),
        type: formData.get('type'),
        applicationId: formData.get('applicationId'),
        description: formData.get('description')
      });

      const uploadResponse = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/rental-applications/upload-document', {
        method: 'POST',
        body: formData
      });

      console.log('Upload response status:', uploadResponse.status);

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        console.error('Upload failed:', errorData);
        throw new Error(errorData.message || 'Failed to upload document');
      }

      const uploadData = await uploadResponse.json();
      console.log('Upload successful:', uploadData);

      // Update documents state: for income documents, add to the list; for others, replace
      if (type === 'income') {
        // Add new income document to the list
        const uploadedDoc = uploadData.documents.find((d: any) => d.type === type && d.description === description);
        const newDocument = {
          type,
          file,
          preview: (process.env.REACT_APP_API_URL || 'http://localhost:5000') + (uploadedDoc?.url || ''),
          documentId: uploadedDoc?.documentId || uploadedDoc?._id,
          description: description || `Income Document ${new Date().toLocaleDateString()}`
        };
        setDocuments(prev => [...prev, newDocument]);
      } else {
        // Replace existing document of the same type
        const uploadedDoc = uploadData.documents.find((d: any) => d.type === type);
      setDocuments(prev => {
        const filtered = prev.filter(doc => doc.type !== type);
        return [
          ...filtered,
          {
            type,
            file,
              preview: (process.env.REACT_APP_API_URL || 'http://localhost:5000') + (uploadedDoc?.url || ''),
              documentId: uploadedDoc?.documentId || uploadedDoc?._id,
              description: uploadedDoc?.description
          }
        ];
      });
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error in handleFileUpload:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const deleteDocument = async (documentId: string, index: number) => {
    try {
      setLoading(true);
      setError(null);

      if (!applicationId) {
        setError('Application not found');
        return;
      }

      if (!documentId) {
        // If no documentId, just remove from local state (for documents that weren't uploaded yet)
        setDocuments(prev => prev.filter((_, i) => i !== index));
        return;
      }

      const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + `/api/rental-applications/${applicationId}/document/${documentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete document');
      }

      // Remove the document from the local state
      setDocuments(prev => prev.filter((_, i) => i !== index));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
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
                  onClick={() => {
                    console.log('Rental file button clicked');
                    rentalFileRef.current?.click();
                  }}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Upload Rental Application (PDF)
                  <input
                    ref={rentalFileRef}
                    type="file"
                    style={{ display: 'none' }}
                    accept=".pdf"
                    onChange={(e) => handleFileUpload(e, 'rental')}
                  />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={() => {
                    console.log('ID file button clicked');
                    idFileRef.current?.click();
                  }}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Upload Government ID (PDF/Image)
                  <input
                    ref={idFileRef}
                    type="file"
                    style={{ display: 'none' }}
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileUpload(e, 'id')}
                  />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={() => {
                    console.log('SSN file button clicked');
                    ssnFileRef.current?.click();
                  }}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Upload Social Security Card (PDF/Image)
                  <input
                    ref={ssnFileRef}
                    type="file"
                    style={{ display: 'none' }}
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileUpload(e, 'ssn')}
                  />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Proof of Income (Optional)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Upload your last 3 months of paystubs. If you are unemployed, you may skip this section.
                </Typography>
                <IncomeDocumentUpload onUpload={handleFileUpload} />
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
                      {doc.type === 'income' && doc.description 
                        ? doc.description
                        : `${doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} Document`
                      }
                    </Typography>
                    <IconButton 
                      onClick={() => {
                        if (doc.documentId) {
                          deleteDocument(doc.documentId, index);
                        } else {
                          removeDocument(index);
                        }
                      }} 
                      color="error"
                    >
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