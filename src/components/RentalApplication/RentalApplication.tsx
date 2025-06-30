import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar,
  FormControl,
  InputAdornment,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox
} from '@mui/material';
import { PDFDocument } from 'pdf-lib';
import { useNavigate } from 'react-router-dom';
import { fillFormFieldsRevised } from './formFillingRevised';
import { analyzePdfFields } from './analyzePdfFields';
import { PDFFormWithFields, RentalApplicationFormData } from './types';

interface RentalApplicationProps {
  propertyName: string;
  propertyAddress: string;
  onClose: () => void;
  propertyId: string;
  propertyPrice: number;
  existingApplicationId?: string;
}

export const RentalApplication: React.FC<RentalApplicationProps> = ({
  propertyName,
  propertyAddress,
  onClose,
  propertyId,
  propertyPrice,
  existingApplicationId,
}) => {
  const [formData, setFormData] = useState<RentalApplicationFormData>({
    // Agent/Broker Information
    preparedByAgent: 'John Smith',
    preparedByBroker: 'Greatland Real Estate',
    agentPhone: '(916) 555-1234',
    agentEmail: 'john.smith@greatland.com',

    // Application Details
    applicationDate: new Date().toISOString().split('T')[0],
    applicationDateFormatted: `${new Date().getDate()}/${new Date().getMonth() + 1}`,
    applicationYear: new Date().getFullYear().toString().slice(2),
    propertyAddress: propertyAddress,
    monthlyRentAmount: propertyPrice.toString(),
    creditReportFee: '48',
    depositAmount: propertyPrice.toString(),

    // Applicant One Information
    applicantOneName: 'John Doe',
    applicantOneDOB: '1990-05-15',
    applicantOneSSN: '123-45-6789',
    applicantOneDriversLic: 'D123456789',
    applicantOneState: 'CA',
    applicantOnePhone: '(916) 555-0101',
    applicantOneCell: '(916) 555-0102',
    applicantOneEmail: 'john.doe@email.com',

    // Additional Occupants
    additionalOccupants: 'None',

    // Rental History
    hasEviction: 'no',
    hasBankruptcy: 'no',

    // Present Address
    presentAddress: '123 Main Street',
    presentCity: 'Sacramento',
    presentZip: '95814',
    presentLengthOfResidency: '2 years',
    presentMonthlyRent: '1800',
    presentLandlordAgent: 'ABC Property Management',
    presentLandlordDRE: '1234567',
    presentLandlordAddress: '456 Oak Avenue, Sacramento, CA 95814',
    presentLandlordPhone: '(916) 555-0301',
    presentLandlordCell: '(916) 555-0302',
    presentLandlordEmail: 'landlord@abcpm.com',
    reasonForMoving: 'Looking for larger space',
    movingDate: '2024-06-01',

    // Previous Address
    previousAddress: '789 Pine Street',
    previousCity: 'Davis',
    previousZip: '95616',
    previousLengthOfResidency: '1 year',
    previousMonthlyRent: '1600',
    previousLandlordAgent: 'XYZ Rentals',
    previousLandlordDRE: '7654321',
    previousLandlordAddress: '321 Elm Street, Davis, CA 95616',
    previousLandlordPhone: '(530) 555-0401',
    previousLandlordCell: '(530) 555-0402',
    previousLandlordEmail: 'landlord@xyzrentals.com',

    // Employment Information
    employerOne: 'Tech Solutions Inc',
    employerOneAddress: '1000 Innovation Drive, Sacramento, CA 95814',
    employerOnePhone: '(916) 555-0501',
    employerOneCell: '(916) 555-0502',
    employerOneEmail: 'hr@techsolutions.com',
    employerOneLengthOfEmployment: '3 years',
    employerOnePosition: 'Software Engineer',
    employerOneWages: '7500',
    employerOnePayPeriod: 'Monthly',
    employerOneUnion: 'No',

    // Previous Employment
    previousEmployerOne: 'Startup Company',
    previousEmployerOneAddress: '500 Startup Lane, Sacramento, CA 95814',
    previousEmployerOnePhone: '(916) 555-0601',
    previousEmployerOneCell: '(916) 555-0602',
    previousEmployerOneEmail: 'hr@startup.com',
    previousEmployerOneLengthOfEmployment: '2 years',
    previousEmployerOnePosition: 'Junior Developer',
    previousEmployerOneWages: '5000',
    previousEmployerOnePayPeriod: 'Monthly',
    previousEmployerOneUnion: 'No',

    // Additional Income
    additionalIncomeAmount: '500',
    additionalIncomeSource: 'Freelance Design',
    additionalIncomeRecipient: 'Jane Doe',

    // Automobiles
    autoOneMake: 'Toyota',
    autoOneYear: '2020',
    autoOneModel: 'Camry',
    autoOneLicState: 'CA',
    autoOneLender: 'Toyota Financial',
    autoTwoMake: 'Honda',
    autoTwoYear: '2019',
    autoTwoModel: 'Civic',
    autoTwoLicState: 'CA',
    autoTwoLender: 'Honda Financial',

    // Bank Accounts
    bankOneBranch: 'Wells Fargo - Downtown',
    bankOneChecking: '1234567890',
    bankOneSavings: '0987654321',
    bankTwoBranch: 'Bank of America - Midtown',
    bankTwoChecking: '1122334455',
    bankTwoSavings: '5544332211',

    // Credit References
    creditRefOneName: 'Capital One',
    creditRefOneAddress: 'PO Box 30285, Salt Lake City, UT 84130',
    creditRefOneAccountNum: '1234567890123456',
    creditRefOneBalance: '2500',
    creditRefOnePhone: '(800) 955-7070',
    creditRefTwoName: 'Chase Bank',
    creditRefTwoAddress: 'PO Box 15298, Wilmington, DE 19850',
    creditRefTwoAccountNum: '9876543210987654',
    creditRefTwoBalance: '1800',
    creditRefTwoPhone: '(800) 935-9935',

    // Personal References
    personalRefName: 'Mike Johnson',
    personalRefAddress: '555 Friend Street, Sacramento, CA 95814',
    personalRefPhone: '(916) 555-0801',
    personalRefCell: '(916) 555-0802',
    personalRefEmail: 'mike.johnson@email.com',

    // Emergency Contacts
    nearestRelativeName: 'Sarah Doe',
    nearestRelativeRelation: 'Sister',
    nearestRelativeAddress: '777 Family Lane, Sacramento, CA 95814',
    nearestRelativePhone: '(916) 555-0901',
    nearestRelativeCell: '(916) 555-0902',
    nearestRelativeEmail: 'sarah.doe@email.com',
    emergencyContactName: 'Bob Wilson',
    emergencyContactRelation: 'Friend',
    emergencyContactAddress: '888 Emergency Ave, Sacramento, CA 95814',
    emergencyContactPhone: '(916) 555-1001',
    emergencyContactCell: '(916) 555-1002',
    emergencyContactEmail: 'bob.wilson@email.com',

    // Signatures and Dates
    signatureDate: new Date().toISOString().split('T')[0],
    acknowledgmentDate: new Date().toISOString().split('T')[0],
    agreeToTerms: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [applicationGenerated, setApplicationGenerated] = useState(false);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);

  // Load PDF template on component mount
  useEffect(() => {
    const loadPdfTemplate = async () => {
      try {
        // Use the new ApplicationRevised template
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/static/ApplicationRevised.pdf`);
        if (!response.ok) {
          throw new Error('Failed to load PDF template');
        }
        const arrayBuffer = await response.arrayBuffer();
        const pdfBytes = new Uint8Array(arrayBuffer);
        setPdfBytes(pdfBytes);
        
        // Analyze the PDF fields to see what's actually available
        console.log('Analyzing PDF template fields...');
        await analyzePdfFields(pdfBytes);
        
      } catch (error) {
        console.error('Error loading PDF template:', error);
        setErrorMessage('Failed to load PDF template');
        setShowError(true);
      }
    };

    loadPdfTemplate();
  }, []);

  const handleInputChange = (field: keyof RentalApplicationFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!pdfBytes) {
        throw new Error('PDF template not loaded');
      }

      // Create a new ArrayBuffer from the Uint8Array
      const arrayBuffer = new ArrayBuffer(pdfBytes.byteLength);
      new Uint8Array(arrayBuffer).set(pdfBytes);

      // Load the PDF template with the ArrayBuffer
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Get the form
      const form = pdfDoc.getForm() as PDFFormWithFields;
      
      try {
        // Debug: Log all field names
        const fields = form.getFields();
        console.log('PDF Form Fields:', fields.map(f => f.getName()));
        
        // Fill form fields using the new revised function
        fillFormFieldsRevised(form, formData);
      } catch (error) {
        console.error('Error filling form fields:', error);
        throw error;
      }
      
      // Save the PDF
      const modifiedPdfBytes = await pdfDoc.save();
      
      // Convert PDF to base64 for storage - simple approach
      const uint8Array = new Uint8Array(modifiedPdfBytes);
      const pdfBase64 = btoa(
        Array.from(uint8Array, byte => String.fromCharCode(byte)).join('')
      );

      console.log('PDF generated, size:', modifiedPdfBytes.length, 'bytes');
      console.log('Base64 length:', pdfBase64.length);
      console.log('Base64 starts with:', pdfBase64.substring(0, 50));
      
      console.log('Sending application to backend...');
      // Save the application to the backend
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('API URL:', apiUrl);
      
      const requestBody = {
        propertyId,
        propertyName,
        propertyAddress,
        applicantName: formData.applicantOneName,
        applicantEmail: formData.applicantOneEmail,
        applicantPhone: formData.applicantOnePhone,
        formData,
        pdfBase64
      };
      
      console.log('Request body keys:', Object.keys(requestBody));
      console.log('Request body (without pdfBase64):', {
        ...requestBody,
        pdfBase64: requestBody.pdfBase64 ? `[BASE64 STRING - ${requestBody.pdfBase64.length} chars]` : 'null'
      });
      
      let response;
      if (existingApplicationId) {
        // Update existing application with PDF
        console.log('Updating existing application:', existingApplicationId);
        response = await fetch(`${apiUrl}/api/rental-applications/${existingApplicationId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pdfBase64,
            hasPdfBase64: true
          }),
        });
      } else {
        // Create new application
        console.log('Creating new application');
        response = await fetch(`${apiUrl}/api/rental-applications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
      }

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error response:', errorData);
        throw new Error(errorData.details || errorData.error || 'Failed to save application');
      }

      const responseData = await response.json();
      console.log('Backend success response:', responseData);

      // Create a blob and download link
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'filled-rental-application.pdf';
      link.click();
      URL.revokeObjectURL(url);
      
      setSuccessMessage('Application submitted successfully!');
      setShowSuccess(true);
      setApplicationGenerated(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      setErrorMessage(`Error submitting application: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplicationGenerated = () => {
    // Add navigation to submission page
    window.location.href = `/submit-application/${propertyId}`;
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Rental Application
      </Typography>
      <Typography variant="h6" gutterBottom>
        {propertyName}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {propertyAddress}
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Rental History: Eviction/Bankruptcy */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Rental History
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset">
              <Typography>Have you ever been party to an eviction?</Typography>
              <RadioGroup
                row
                name="hasEviction"
                value={formData.hasEviction}
                onChange={handleInputChange('hasEviction')}
              >
                <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
                <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset">
              <Typography>Have you ever filed bankruptcy?</Typography>
              <RadioGroup
                row
                name="hasBankruptcy"
                value={formData.hasBankruptcy}
                onChange={handleInputChange('hasBankruptcy')}
              >
                <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
                <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>

        {/* Application Details Section */}
        <Typography variant="h5" gutterBottom sx={{ mt: 3, mb: 2 }}>
          Application Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Date"
              name="applicationDateFormatted"
              value={formData.applicationDateFormatted}
              InputProps={{
                readOnly: true,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Year"
              name="applicationYear"
              value={formData.applicationYear}
              InputProps={{
                readOnly: true,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Property Address"
              name="propertyAddress"
              value={formData.propertyAddress}
              InputProps={{
                readOnly: true,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Monthly Rent Amount"
              name="monthlyRentAmount"
              value={formData.monthlyRentAmount}
              InputProps={{
                readOnly: true,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Credit Report Fee"
              name="creditReportFee"
              value="48"
              InputProps={{
                readOnly: true,
              }}
              required
            />
          </Grid>
        </Grid>

        {/* Agent/Broker Information */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Agent/Broker Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Prepared by Agent"
              name="preparedByAgent"
              value={formData.preparedByAgent}
              onChange={handleInputChange('preparedByAgent')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Broker"
              name="preparedByBroker"
              value={formData.preparedByBroker}
              onChange={handleInputChange('preparedByBroker')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Agent Phone"
              name="agentPhone"
              value={formData.agentPhone}
              onChange={handleInputChange('agentPhone')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Agent Email"
              name="agentEmail"
              type="email"
              value={formData.agentEmail}
              onChange={handleInputChange('agentEmail')}
              required
            />
          </Grid>
        </Grid>

        {/* Applicant One Information */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Applicant One Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="applicantOneName"
              value={formData.applicantOneName}
              onChange={handleInputChange('applicantOneName')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="applicantOneDOB"
              type="date"
              value={formData.applicantOneDOB}
              onChange={handleInputChange('applicantOneDOB')}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Social Security Number"
              name="applicantOneSSN"
              value={formData.applicantOneSSN}
              onChange={handleInputChange('applicantOneSSN')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Driver's License"
              name="applicantOneDriversLic"
              value={formData.applicantOneDriversLic}
              onChange={handleInputChange('applicantOneDriversLic')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State"
              name="applicantOneState"
              value={formData.applicantOneState}
              onChange={handleInputChange('applicantOneState')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              name="applicantOnePhone"
              value={formData.applicantOnePhone}
              onChange={handleInputChange('applicantOnePhone')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cell"
              name="applicantOneCell"
              value={formData.applicantOneCell}
              onChange={handleInputChange('applicantOneCell')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="applicantOneEmail"
              type="email"
              value={formData.applicantOneEmail}
              onChange={handleInputChange('applicantOneEmail')}
              required
            />
          </Grid>
        </Grid>

        {/* Additional Occupants */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Additional Occupants
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Occupants"
              name="additionalOccupants"
              value={formData.additionalOccupants}
              onChange={handleInputChange('additionalOccupants')}
              helperText="List all additional occupants who will live in the property"
              multiline
              rows={3}
            />
          </Grid>
        </Grid>

        {/* Present Address */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Present Address
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="presentAddress"
              value={formData.presentAddress}
              onChange={handleInputChange('presentAddress')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              name="presentCity"
              value={formData.presentCity}
              onChange={handleInputChange('presentCity')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Zip Code"
              name="presentZip"
              value={formData.presentZip}
              onChange={handleInputChange('presentZip')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Length of Residency"
              name="presentLengthOfResidency"
              value={formData.presentLengthOfResidency}
              onChange={handleInputChange('presentLengthOfResidency')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Monthly Rent"
              name="presentMonthlyRent"
              value={formData.presentMonthlyRent}
              onChange={handleInputChange('presentMonthlyRent')}
              required
            />
          </Grid>
        </Grid>

        {/* Present Landlord Information */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Present Landlord Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Landlord/Agent"
              name="presentLandlordAgent"
              value={formData.presentLandlordAgent}
              onChange={handleInputChange('presentLandlordAgent')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="DRE #"
              name="presentLandlordDRE"
              value={formData.presentLandlordDRE}
              onChange={handleInputChange('presentLandlordDRE')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Landlord Address"
              name="presentLandlordAddress"
              value={formData.presentLandlordAddress}
              onChange={handleInputChange('presentLandlordAddress')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Landlord Phone"
              name="presentLandlordPhone"
              value={formData.presentLandlordPhone}
              onChange={handleInputChange('presentLandlordPhone')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Landlord Cell"
              name="presentLandlordCell"
              value={formData.presentLandlordCell}
              onChange={handleInputChange('presentLandlordCell')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Landlord Email"
              name="presentLandlordEmail"
              type="email"
              value={formData.presentLandlordEmail}
              onChange={handleInputChange('presentLandlordEmail')}
              required
            />
          </Grid>
        </Grid>

        {/* Moving Information */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Moving Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Reason for Moving"
              name="reasonForMoving"
              value={formData.reasonForMoving}
              onChange={handleInputChange('reasonForMoving')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Moving Date"
              name="movingDate"
              type="date"
              value={formData.movingDate}
              onChange={handleInputChange('movingDate')}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
        </Grid>

        {/* Previous Address */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Previous Address (if applicable)
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="previousAddress"
              value={formData.previousAddress}
              onChange={handleInputChange('previousAddress')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              name="previousCity"
              value={formData.previousCity}
              onChange={handleInputChange('previousCity')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Zip Code"
              name="previousZip"
              value={formData.previousZip}
              onChange={handleInputChange('previousZip')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Length of Residency"
              name="previousLengthOfResidency"
              value={formData.previousLengthOfResidency}
              onChange={handleInputChange('previousLengthOfResidency')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Monthly Rent"
              name="previousMonthlyRent"
              value={formData.previousMonthlyRent}
              onChange={handleInputChange('previousMonthlyRent')}
            />
          </Grid>
        </Grid>

        {/* Previous Landlord Details */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Previous Landlord Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Previous Landlord/Agent Name"
              name="previousLandlordAgent"
              value={formData.previousLandlordAgent}
              onChange={handleInputChange('previousLandlordAgent')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Previous Landlord DRE"
              name="previousLandlordDRE"
              value={formData.previousLandlordDRE}
              onChange={handleInputChange('previousLandlordDRE')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Previous Landlord Address"
              name="previousLandlordAddress"
              value={formData.previousLandlordAddress}
              onChange={handleInputChange('previousLandlordAddress')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Previous Landlord Phone"
              name="previousLandlordPhone"
              value={formData.previousLandlordPhone}
              onChange={handleInputChange('previousLandlordPhone')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Previous Landlord Cell"
              name="previousLandlordCell"
              value={formData.previousLandlordCell}
              onChange={handleInputChange('previousLandlordCell')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Previous Landlord Email"
              name="previousLandlordEmail"
              value={formData.previousLandlordEmail}
              onChange={handleInputChange('previousLandlordEmail')}
              required
            />
          </Grid>
        </Grid>

        {/* Employment Information */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Employment Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Employer"
              name="employerOne"
              value={formData.employerOne}
              onChange={handleInputChange('employerOne')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Position"
              name="employerOnePosition"
              value={formData.employerOnePosition}
              onChange={handleInputChange('employerOnePosition')}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Employer Address"
              name="employerOneAddress"
              value={formData.employerOneAddress}
              onChange={handleInputChange('employerOneAddress')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Employer Phone"
              name="employerOnePhone"
              value={formData.employerOnePhone}
              onChange={handleInputChange('employerOnePhone')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Length of Employment"
              name="employerOneLengthOfEmployment"
              value={formData.employerOneLengthOfEmployment}
              onChange={handleInputChange('employerOneLengthOfEmployment')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Monthly Wages"
              name="employerOneWages"
              value={formData.employerOneWages}
              onChange={handleInputChange('employerOneWages')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Pay Period"
              name="employerOnePayPeriod"
              value={formData.employerOnePayPeriod}
              onChange={handleInputChange('employerOnePayPeriod')}
              required
            />
          </Grid>
        </Grid>

        {/* Rental History */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Rental History
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset">
              <Typography>Have you ever been party to an eviction?</Typography>
              <RadioGroup
                row
                name="hasEviction"
                value={formData.hasEviction}
                onChange={handleInputChange('hasEviction')}
              >
                <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
                <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset">
              <Typography>Have you ever filed bankruptcy?</Typography>
              <RadioGroup
                row
                name="hasBankruptcy"
                value={formData.hasBankruptcy}
                onChange={handleInputChange('hasBankruptcy')}
              >
                <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
                <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>

        {/* Previous Employment */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Previous Employment (if applicable)
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Previous Employer"
              name="previousEmployerOne"
              value={formData.previousEmployerOne}
              onChange={handleInputChange('previousEmployerOne')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Position"
              name="previousEmployerOnePosition"
              value={formData.previousEmployerOnePosition}
              onChange={handleInputChange('previousEmployerOnePosition')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Employer Address"
              name="previousEmployerOneAddress"
              value={formData.previousEmployerOneAddress}
              onChange={handleInputChange('previousEmployerOneAddress')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Employer Phone"
              name="previousEmployerOnePhone"
              value={formData.previousEmployerOnePhone}
              onChange={handleInputChange('previousEmployerOnePhone')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Length of Employment"
              name="previousEmployerOneLengthOfEmployment"
              value={formData.previousEmployerOneLengthOfEmployment}
              onChange={handleInputChange('previousEmployerOneLengthOfEmployment')}
            />
          </Grid>
        </Grid>

        {/* Additional Income */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Additional Income (if applicable)
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Additional Income Amount"
              name="additionalIncomeAmount"
              value={formData.additionalIncomeAmount}
              onChange={handleInputChange('additionalIncomeAmount')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Source"
              name="additionalIncomeSource"
              value={formData.additionalIncomeSource}
              onChange={handleInputChange('additionalIncomeSource')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Recipient"
              name="additionalIncomeRecipient"
              value={formData.additionalIncomeRecipient}
              onChange={handleInputChange('additionalIncomeRecipient')}
            />
          </Grid>
        </Grid>

        {/* Automobiles */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Automobiles
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Vehicle 1</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Make"
              name="autoOneMake"
              value={formData.autoOneMake}
              onChange={handleInputChange('autoOneMake')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Year"
              name="autoOneYear"
              value={formData.autoOneYear}
              onChange={handleInputChange('autoOneYear')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Model"
              name="autoOneModel"
              value={formData.autoOneModel}
              onChange={handleInputChange('autoOneModel')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="License State"
              name="autoOneLicState"
              value={formData.autoOneLicState}
              onChange={handleInputChange('autoOneLicState')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Lender"
              name="autoOneLender"
              value={formData.autoOneLender}
              onChange={handleInputChange('autoOneLender')}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Vehicle 2 (if applicable)</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Make"
              name="autoTwoMake"
              value={formData.autoTwoMake}
              onChange={handleInputChange('autoTwoMake')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Year"
              name="autoTwoYear"
              value={formData.autoTwoYear}
              onChange={handleInputChange('autoTwoYear')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Model"
              name="autoTwoModel"
              value={formData.autoTwoModel}
              onChange={handleInputChange('autoTwoModel')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="License State"
              name="autoTwoLicState"
              value={formData.autoTwoLicState}
              onChange={handleInputChange('autoTwoLicState')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Lender"
              name="autoTwoLender"
              value={formData.autoTwoLender}
              onChange={handleInputChange('autoTwoLender')}
            />
          </Grid>
        </Grid>

        {/* Bank Accounts */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Bank Accounts
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Bank 1</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bank/Branch"
              name="bankOneBranch"
              value={formData.bankOneBranch}
              onChange={handleInputChange('bankOneBranch')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Checking Account #"
              name="bankOneChecking"
              value={formData.bankOneChecking}
              onChange={handleInputChange('bankOneChecking')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Savings Account #"
              name="bankOneSavings"
              value={formData.bankOneSavings}
              onChange={handleInputChange('bankOneSavings')}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Bank 2 (if applicable)</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bank/Branch"
              name="bankTwoBranch"
              value={formData.bankTwoBranch}
              onChange={handleInputChange('bankTwoBranch')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Checking Account #"
              name="bankTwoChecking"
              value={formData.bankTwoChecking}
              onChange={handleInputChange('bankTwoChecking')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Savings Account #"
              name="bankTwoSavings"
              value={formData.bankTwoSavings}
              onChange={handleInputChange('bankTwoSavings')}
            />
          </Grid>
        </Grid>

        {/* Credit References */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Credit References
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Reference 1</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="creditRefOneName"
              value={formData.creditRefOneName}
              onChange={handleInputChange('creditRefOneName')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="creditRefOneAddress"
              value={formData.creditRefOneAddress}
              onChange={handleInputChange('creditRefOneAddress')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Account #"
              name="creditRefOneAccountNum"
              value={formData.creditRefOneAccountNum}
              onChange={handleInputChange('creditRefOneAccountNum')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Balance Due $"
              name="creditRefOneBalance"
              value={formData.creditRefOneBalance}
              onChange={handleInputChange('creditRefOneBalance')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Phone"
              name="creditRefOnePhone"
              value={formData.creditRefOnePhone}
              onChange={handleInputChange('creditRefOnePhone')}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Reference 2</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="creditRefTwoName"
              value={formData.creditRefTwoName}
              onChange={handleInputChange('creditRefTwoName')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="creditRefTwoAddress"
              value={formData.creditRefTwoAddress}
              onChange={handleInputChange('creditRefTwoAddress')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Account #"
              name="creditRefTwoAccountNum"
              value={formData.creditRefTwoAccountNum}
              onChange={handleInputChange('creditRefTwoAccountNum')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Balance Due $"
              name="creditRefTwoBalance"
              value={formData.creditRefTwoBalance}
              onChange={handleInputChange('creditRefTwoBalance')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Phone"
              name="creditRefTwoPhone"
              value={formData.creditRefTwoPhone}
              onChange={handleInputChange('creditRefTwoPhone')}
            />
          </Grid>
        </Grid>

        {/* Personal References */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Personal References
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="personalRefName"
              value={formData.personalRefName}
              onChange={handleInputChange('personalRefName')}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="personalRefAddress"
              value={formData.personalRefAddress}
              onChange={handleInputChange('personalRefAddress')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Phone"
              name="personalRefPhone"
              value={formData.personalRefPhone}
              onChange={handleInputChange('personalRefPhone')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Cell"
              name="personalRefCell"
              value={formData.personalRefCell}
              onChange={handleInputChange('personalRefCell')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Email"
              name="personalRefEmail"
              type="email"
              value={formData.personalRefEmail}
              onChange={handleInputChange('personalRefEmail')}
              required
            />
          </Grid>
        </Grid>

        {/* Emergency Contacts */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Emergency Contacts
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Nearest Relative</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name/Relationship"
              name="nearestRelativeName"
              value={formData.nearestRelativeName}
              onChange={handleInputChange('nearestRelativeName')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Relation"
              name="nearestRelativeRelation"
              value={formData.nearestRelativeRelation}
              onChange={handleInputChange('nearestRelativeRelation')}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="nearestRelativeAddress"
              value={formData.nearestRelativeAddress}
              onChange={handleInputChange('nearestRelativeAddress')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Phone"
              name="nearestRelativePhone"
              value={formData.nearestRelativePhone}
              onChange={handleInputChange('nearestRelativePhone')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Cell"
              name="nearestRelativeCell"
              value={formData.nearestRelativeCell}
              onChange={handleInputChange('nearestRelativeCell')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Email"
              name="nearestRelativeEmail"
              type="email"
              value={formData.nearestRelativeEmail}
              onChange={handleInputChange('nearestRelativeEmail')}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Emergency Contact</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name/Relationship"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleInputChange('emergencyContactName')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Relation"
              name="emergencyContactRelation"
              value={formData.emergencyContactRelation}
              onChange={handleInputChange('emergencyContactRelation')}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="emergencyContactAddress"
              value={formData.emergencyContactAddress}
              onChange={handleInputChange('emergencyContactAddress')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Phone"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleInputChange('emergencyContactPhone')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Cell"
              name="emergencyContactCell"
              value={formData.emergencyContactCell}
              onChange={handleInputChange('emergencyContactCell')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Email"
              name="emergencyContactEmail"
              type="email"
              value={formData.emergencyContactEmail}
              onChange={handleInputChange('emergencyContactEmail')}
              required
            />
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={isLoading}
            sx={{ minWidth: 200 }}
          >
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </Box>
      </form>

      {/* Success/Error Messages */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
      >
        <Alert onClose={() => setShowError(false)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 