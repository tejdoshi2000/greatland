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
import { fillFormFields } from './formFilling';
import { PDFFormWithFields, RentalApplicationFormData } from './types';

interface RentalApplicationProps {
  propertyName: string;
  propertyAddress: string;
  onClose: () => void;
  propertyId: string;
  propertyPrice: number;
}

export const RentalApplication: React.FC<RentalApplicationProps> = ({
  propertyName,
  propertyAddress,
  onClose,
  propertyId,
  propertyPrice,
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
    applicantOneName: '',
    applicantOneDOB: '',
    applicantOneSSN: '',
    applicantOneDriversLic: '',
    applicantOneState: '',
    applicantOnePhone: '',
    applicantOneCell: '',
    applicantOneEmail: '',

    // Applicant Two Information
    applicantTwoName: 'John Doe',
    applicantTwoDOB: '1988-08-22',
    applicantTwoSSN: '987-65-4321',
    applicantTwoDriversLic: 'D87654321',
    applicantTwoState: 'CA',
    applicantTwoPhone: '(916) 555-4321',
    applicantTwoCell: '(916) 555-4322',
    applicantTwoEmail: 'john.doe@email.com',

    // Additional Occupants
    additionalOccupants: 'None',

    // Rental History
    hasEviction: false,
    hasBankruptcy: false,

    // Present Address
    presentAddress: '',
    presentCity: '',
    presentZip: '',
    presentLengthOfResidency: '',
    presentMonthlyRent: '',
    presentLandlordAgent: '',
    presentLandlordDRE: '',
    presentLandlordAddress: '',
    presentLandlordPhone: '',
    presentLandlordCell: '',
    presentLandlordEmail: '',
    reasonForMoving: '',
    movingDate: '',

    // Previous Address
    previousAddress: '4321 Elm St',
    previousCity: 'Sacramento',
    previousZip: '95815',
    previousLengthOfResidency: '3 years',
    previousMonthlyRent: '2000',
    previousLandlordAgent: 'Michael Brown',
    previousLandlordDRE: '76543210',
    previousLandlordAddress: '8765 Pine St, Sacramento, CA 95815',
    previousLandlordPhone: '(916) 555-2222',
    previousLandlordCell: '(916) 555-2223',
    previousLandlordEmail: 'michael.brown@pm.com',

    // Employment Information
    employerOne: '',
    employerOneAddress: '',
    employerOnePhone: '',
    employerOneCell: '',
    employerOneEmail: '',
    employerOneLengthOfEmployment: '',
    employerOnePosition: '',
    employerOneWages: '',
    employerOnePayPeriod: '',
    employerOneUnion: '',

    previousEmployerOne: 'Digital Innovations',
    previousEmployerOneAddress: '3456 Innovation Way, Sacramento, CA 95817',
    previousEmployerOnePhone: '(916) 555-4444',
    previousEmployerOneCell: '(916) 555-4445',
    previousEmployerOneEmail: 'hr@digitalinnovations.com',
    previousEmployerOneLengthOfEmployment: '3 years',
    previousEmployerOnePosition: 'Software Engineer',
    previousEmployerOneWages: '90000',
    previousEmployerOnePayPeriod: 'Monthly',
    previousEmployerOneUnion: 'No',

    employerTwo: 'Global Marketing',
    employerTwoAddress: '2345 Market St, Sacramento, CA 95818',
    employerTwoPhone: '(916) 555-5555',
    employerTwoCell: '(916) 555-5556',
    employerTwoEmail: 'hr@globalmarketing.com',
    employerTwoLengthOfEmployment: '4 years',
    employerTwoPosition: 'Marketing Manager',
    employerTwoWages: '95000',
    employerTwoPayPeriod: 'Monthly',
    employerTwoUnion: 'No',

    // Additional Income
    additionalIncomeAmount: '5000',
    additionalIncomeSource: 'Freelance Design Work',
    additionalIncomeRecipient: 'Jane Doe',

    // Automobiles
    autoOneMake: 'Toyota',
    autoOneYear: '2020',
    autoOneModel: 'Camry',
    autoOneLicState: 'CA',
    autoOneLender: 'Bank of America',

    autoTwoMake: 'Honda',
    autoTwoYear: '2019',
    autoTwoModel: 'CR-V',
    autoTwoLicState: 'CA',
    autoTwoLender: 'Chase Bank',

    // Banking Information
    bankOneBranch: 'Bank of America - Downtown',
    bankOneChecking: '1234567890',
    bankOneSavings: '0987654321',

    bankTwoBranch: 'Chase Bank - Midtown',
    bankTwoChecking: '2345678901',
    bankTwoSavings: '1098765432',

    // Credit References
    creditRefOneName: 'Capital One',
    creditRefOneAddress: 'PO Box 85000, Richmond, VA 23285',
    creditRefOneAccountNum: '1234-5678-9012-3456',
    creditRefOneBalance: '5000',
    creditRefOnePhone: '(800) 955-7070',

    creditRefTwoName: 'American Express',
    creditRefTwoAddress: 'PO Box 981537, El Paso, TX 79998',
    creditRefTwoAccountNum: '9876-5432-1098-7654',
    creditRefTwoBalance: '3000',
    creditRefTwoPhone: '(800) 528-4800',

    // Personal Reference
    personalRefName: '',
    personalRefAddress: '',
    personalRefPhone: '',
    personalRefCell: '',
    personalRefEmail: '',

    // Nearest Relative
    nearestRelativeName: '',
    nearestRelativeRelation: '',
    nearestRelativeAddress: '',
    nearestRelativePhone: '',
    nearestRelativeCell: '',
    nearestRelativeEmail: '',

    // Emergency Contact
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactAddress: '',
    emergencyContactPhone: '',
    emergencyContactCell: '',
    emergencyContactEmail: '',

    // Signatures and Dates
    signatureDate: new Date().toISOString().split('T')[0],
    acknowledgmentDate: new Date().toISOString().split('T')[0],
    agreeToTerms: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [applicationGenerated, setApplicationGenerated] = useState(false);

  useEffect(() => {
    // Load the PDF template
    const loadPdfTemplate = async () => {
      try {
        console.log('Attempting to load PDF template...');
        // Encode the filename properly
        const filename = encodeURIComponent('RPI 553, Application to Rent (1).pdf');
        const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + `/static/${filename}`);
        
        if (!response.ok) {
          console.error('Failed to load PDF:', {
            status: response.status,
            statusText: response.statusText,
            url: response.url
          });
          throw new Error(`Failed to load PDF template: ${response.status} ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        setPdfBytes(new Uint8Array(arrayBuffer));
        console.log('PDF template loaded successfully');
      } catch (error) {
        console.error('Error loading PDF template:', error);
        setErrorMessage(`Error loading PDF template: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setShowError(true);
      }
    };

    loadPdfTemplate();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
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
        
        // Format the date as MM/DD for the PDF
        const date = new Date();
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
        const year = date.getFullYear().toString().slice(2);

        // Fill the date fields in the PDF
        form.getTextField('Date').setText(formattedDate);
        form.getTextField('Year').setText(year);
        
        // Try different possible field names for property address
        const addressFieldNames = ['At', 'at', 'Property Address', 'propertyAddress', 'Address'];
        let addressFieldFound = false;
        
        for (const fieldName of addressFieldNames) {
          try {
            const field = form.getTextField(fieldName);
            if (field) {
              field.setText(propertyAddress);
              addressFieldFound = true;
              console.log(`Successfully set property address in field: ${fieldName}`);
              break;
            }
          } catch (error) {
            console.log(`Field ${fieldName} not found, trying next...`);
          }
        }

        if (!addressFieldFound) {
          console.error('Could not find property address field in PDF');
        }

        // Fill other form fields
        fillFormFields(form, formData);
      } catch (error) {
        console.error('Error filling form fields:', error);
        throw error;
      }
      
      // Save the PDF
      const modifiedPdfBytes = await pdfDoc.save();
      
      // Convert PDF to base64 for storage
      const pdfBase64 = btoa(
        new Uint8Array(modifiedPdfBytes)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      console.log('Sending application to backend...');
      // Save the application to the backend
      const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/rental-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          propertyName,
          propertyAddress,
          applicantName: formData.applicantOneName,
          applicantEmail: formData.applicantOneEmail,
          applicantPhone: formData.applicantOnePhone,
          formData,
          pdfBase64
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to save application');
      }

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
        <Grid container spacing={3}>
          {/* Agent/Broker Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Agent/Broker Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Prepared by Agent"
              name="preparedByAgent"
              value={formData.preparedByAgent}
              InputProps={{
                readOnly: true,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Broker"
              name="preparedByBroker"
              value={formData.preparedByBroker}
              InputProps={{
                readOnly: true,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              name="agentPhone"
              value={formData.agentPhone}
              InputProps={{
                readOnly: true,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="agentEmail"
              value={formData.agentEmail}
              InputProps={{
                readOnly: true,
              }}
              required
            />
          </Grid>

          {/* Credit Application Details */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Credit Application Details
            </Typography>
          </Grid>
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
              label="At"
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Deposit Amount"
              name="depositAmount"
              value={formData.monthlyRentAmount}
              InputProps={{
                readOnly: true,
              }}
              required
            />
          </Grid>

          {/* Applicant One Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Applicant One Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="applicantOneName"
              value={formData.applicantOneName}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Social Security Number"
              name="applicantOneSSN"
              value={formData.applicantOneSSN}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Driver's License"
              name="applicantOneDriversLic"
              value={formData.applicantOneDriversLic}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State"
              name="applicantOneState"
              value={formData.applicantOneState}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              name="applicantOnePhone"
              value={formData.applicantOnePhone}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cell"
              name="applicantOneCell"
              value={formData.applicantOneCell}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="applicantOneEmail"
              value={formData.applicantOneEmail}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* Present Address */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Present Address
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="presentAddress"
              value={formData.presentAddress}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              name="presentCity"
              value={formData.presentCity}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Zip"
              name="presentZip"
              value={formData.presentZip}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Length of Residency"
              name="presentLengthOfResidency"
              value={formData.presentLengthOfResidency}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Monthly Rent"
              name="presentMonthlyRent"
              value={formData.presentMonthlyRent}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* Present Landlord Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Present Landlord Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Landlord/Agent"
              name="presentLandlordAgent"
              value={formData.presentLandlordAgent}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="DRE #"
              name="presentLandlordDRE"
              value={formData.presentLandlordDRE}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="presentLandlordAddress"
              value={formData.presentLandlordAddress}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              name="presentLandlordPhone"
              value={formData.presentLandlordPhone}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cell"
              name="presentLandlordCell"
              value={formData.presentLandlordCell}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="presentLandlordEmail"
              value={formData.presentLandlordEmail}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* Moving Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Moving Information
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Reason for Moving"
              name="reasonForMoving"
              value={formData.reasonForMoving}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Additional Occupants */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Additional Occupants
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Occupants"
              name="additionalOccupants"
              value={formData.additionalOccupants}
              onChange={handleInputChange}
              helperText="Enter 'None' if no additional occupants"
            />
          </Grid>

          {/* Rental History */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Rental History
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset">
              <Typography variant="subtitle1">Have you ever been party to an eviction?</Typography>
              <RadioGroup
                row
                name="hasEviction"
                value={formData.hasEviction}
                onChange={handleInputChange}
              >
                <FormControlLabel value={true} control={<Radio />} label="Yes" />
                <FormControlLabel value={false} control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset">
              <Typography variant="subtitle1">Have you filed bankruptcy?</Typography>
              <RadioGroup
                row
                name="hasBankruptcy"
                value={formData.hasBankruptcy}
                onChange={handleInputChange}
              >
                <FormControlLabel value={true} control={<Radio />} label="Yes" />
                <FormControlLabel value={false} control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Previous Address */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Previous Address
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="previousAddress"
              value={formData.previousAddress}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              name="previousCity"
              value={formData.previousCity}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Zip"
              name="previousZip"
              value={formData.previousZip}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Length of Residency"
              name="previousLengthOfResidency"
              value={formData.previousLengthOfResidency}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Monthly Rent"
              name="previousMonthlyRent"
              value={formData.previousMonthlyRent}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Previous Landlord Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Previous Landlord Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Landlord/Agent"
              name="previousLandlordAgent"
              value={formData.previousLandlordAgent}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="DRE #"
              name="previousLandlordDRE"
              value={formData.previousLandlordDRE}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="previousLandlordAddress"
              value={formData.previousLandlordAddress}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              name="previousLandlordPhone"
              value={formData.previousLandlordPhone}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cell"
              name="previousLandlordCell"
              value={formData.previousLandlordCell}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="previousLandlordEmail"
              value={formData.previousLandlordEmail}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Employment Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Employment Information
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Employer"
              name="employerOne"
              value={formData.employerOne}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="employerOneAddress"
              value={formData.employerOneAddress}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Phone"
              name="employerOnePhone"
              value={formData.employerOnePhone}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Cell"
              name="employerOneCell"
              value={formData.employerOneCell}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Email"
              name="employerOneEmail"
              value={formData.employerOneEmail}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Length of Employment"
              name="employerOneLengthOfEmployment"
              value={formData.employerOneLengthOfEmployment}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Position"
              name="employerOnePosition"
              value={formData.employerOnePosition}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Wages"
              name="employerOneWages"
              value={formData.employerOneWages}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Pay Period"
              name="employerOnePayPeriod"
              value={formData.employerOnePayPeriod}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Union"
              name="employerOneUnion"
              value={formData.employerOneUnion}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Previous Employment */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Previous Employment
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Previous Employer"
              name="previousEmployerOne"
              value={formData.previousEmployerOne}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="previousEmployerOneAddress"
              value={formData.previousEmployerOneAddress}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Phone"
              name="previousEmployerOnePhone"
              value={formData.previousEmployerOnePhone}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Cell"
              name="previousEmployerOneCell"
              value={formData.previousEmployerOneCell}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Email"
              name="previousEmployerOneEmail"
              value={formData.previousEmployerOneEmail}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Length of Employment"
              name="previousEmployerOneLengthOfEmployment"
              value={formData.previousEmployerOneLengthOfEmployment}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Position"
              name="previousEmployerOnePosition"
              value={formData.previousEmployerOnePosition}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Wages"
              name="previousEmployerOneWages"
              value={formData.previousEmployerOneWages}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Pay Period"
              name="previousEmployerOnePayPeriod"
              value={formData.previousEmployerOnePayPeriod}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Union"
              name="previousEmployerOneUnion"
              value={formData.previousEmployerOneUnion}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Additional Income */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Additional Income
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Amount"
              name="additionalIncomeAmount"
              value={formData.additionalIncomeAmount}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Source"
              name="additionalIncomeSource"
              value={formData.additionalIncomeSource}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Recipient"
              name="additionalIncomeRecipient"
              value={formData.additionalIncomeRecipient}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Automobiles */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Automobiles
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Vehicle 1
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Make"
              name="autoOneMake"
              value={formData.autoOneMake}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Year"
              name="autoOneYear"
              value={formData.autoOneYear}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Model"
              name="autoOneModel"
              value={formData.autoOneModel}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="License State"
              name="autoOneLicState"
              value={formData.autoOneLicState}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Lender"
              name="autoOneLender"
              value={formData.autoOneLender}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Vehicle 2
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Make"
              name="autoTwoMake"
              value={formData.autoTwoMake}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Year"
              name="autoTwoYear"
              value={formData.autoTwoYear}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Model"
              name="autoTwoModel"
              value={formData.autoTwoModel}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="License State"
              name="autoTwoLicState"
              value={formData.autoTwoLicState}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Lender"
              name="autoTwoLender"
              value={formData.autoTwoLender}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Bank Accounts */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Bank Accounts
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Bank 1
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bank/branch"
              name="bankOneBranch"
              value={formData.bankOneBranch}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Check acc. #"
              name="bankOneChecking"
              value={formData.bankOneChecking}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Savings Acc. #"
              name="bankOneSavings"
              value={formData.bankOneSavings}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Bank 2
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bank/branch"
              name="bankTwoBranch"
              value={formData.bankTwoBranch}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Check acc. #"
              name="bankTwoChecking"
              value={formData.bankTwoChecking}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Savings Acc. #"
              name="bankTwoSavings"
              value={formData.bankTwoSavings}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Credit References */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Credit References
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Reference 1
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="creditRefOneName"
              value={formData.creditRefOneName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="creditRefOneAddress"
              value={formData.creditRefOneAddress}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Account #"
              name="creditRefOneAccountNum"
              value={formData.creditRefOneAccountNum}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Balance due $"
              name="creditRefOneBalance"
              value={formData.creditRefOneBalance}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Phone"
              name="creditRefOnePhone"
              value={formData.creditRefOnePhone}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Reference 2
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="creditRefTwoName"
              value={formData.creditRefTwoName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="creditRefTwoAddress"
              value={formData.creditRefTwoAddress}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Account #"
              name="creditRefTwoAccountNum"
              value={formData.creditRefTwoAccountNum}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Balance due $"
              name="creditRefTwoBalance"
              value={formData.creditRefTwoBalance}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Phone"
              name="creditRefTwoPhone"
              value={formData.creditRefTwoPhone}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Personal Reference */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Personal Reference
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="personalRefName"
              value={formData.personalRefName}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="personalRefAddress"
              value={formData.personalRefAddress}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Phone"
              name="personalRefPhone"
              value={formData.personalRefPhone}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Cell"
              name="personalRefCell"
              value={formData.personalRefCell}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Email"
              name="personalRefEmail"
              value={formData.personalRefEmail}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* Nearest Relative */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Nearest Relative
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name/Relationship"
              name="nearestRelativeName"
              value={formData.nearestRelativeName}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="nearestRelativeAddress"
              value={formData.nearestRelativeAddress}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Phone"
              name="nearestRelativePhone"
              value={formData.nearestRelativePhone}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Cell"
              name="nearestRelativeCell"
              value={formData.nearestRelativeCell}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Email"
              name="nearestRelativeEmail"
              value={formData.nearestRelativeEmail}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* Emergency Contact */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Emergency Contact
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name/Relationship"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="emergencyContactAddress"
              value={formData.emergencyContactAddress}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Phone"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Cell"
              name="emergencyContactCell"
              value={formData.emergencyContactCell}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Email"
              name="emergencyContactEmail"
              value={formData.emergencyContactEmail}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* Acknowledgment */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Acknowledgment
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date"
              name="acknowledgmentDate"
              type="date"
              value={formData.acknowledgmentDate}
              onChange={handleInputChange}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  required
                />
              }
              label="I acknowledge that all information provided is true and accurate"
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Submit Application'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      {applicationGenerated && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Your application has been generated successfully!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Please download, sign, and submit the application along with the required documents.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApplicationGenerated}
            sx={{ mt: 2 }}
          >
            Proceed to Submission
          </Button>
        </Box>
      )}

      {/* Success Message */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Message */}
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