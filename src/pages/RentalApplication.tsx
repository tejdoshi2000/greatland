import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';

interface ApplicationData {
  // Agent/Broker Information
  preparedByAgent: string;
  preparedByBroker: string;
  agentPhone: string;
  agentEmail: string;

  // Documents
  paystubs: File[];

  // Credit Application Details
  applicationDate: string;
  propertyAddress: string;
  monthlyRentAmount: string;
  creditReportFee: string;
  depositAmount: string;
  
  // Applicant Information
  applicantOneName: string;
  applicantOneDOB: string;
  applicantOneSSN: string;
  applicantOneDriversLic: string;
  applicantOneState: string;
  applicantOnePhone: string;
  applicantOneCell: string;
  applicantOneEmail: string;
  
  applicantTwoName: string;
  applicantTwoDOB: string;
  applicantTwoSSN: string;
  applicantTwoDriversLic: string;
  applicantTwoState: string;
  applicantTwoPhone: string;
  applicantTwoCell: string;
  applicantTwoEmail: string;
  
  additionalOccupants: string;
  
  // Rental History
  hasEviction: boolean;
  hasBankruptcy: boolean;
  
  // Present Address
  presentAddress: string;
  presentCity: string;
  presentZip: string;
  presentLengthOfResidency: string;
  presentMonthlyRent: string;
  presentLandlordAgent: string;
  presentLandlordDRE: string;
  presentLandlordAddress: string;
  presentLandlordPhone: string;
  presentLandlordCell: string;
  presentLandlordEmail: string;
  reasonForMoving: string;
  movingDate: string;
  
  // Previous Address
  previousAddress: string;
  previousCity: string;
  previousZip: string;
  previousLengthOfResidency: string;
  previousMonthlyRent: string;
  previousLandlordAgent: string;
  previousLandlordDRE: string;
  previousLandlordAddress: string;
  previousLandlordPhone: string;
  previousLandlordCell: string;
  previousLandlordEmail: string;
  
  // Employment - Applicant One
  employerOne: string;
  employerOneAddress: string;
  employerOnePhone: string;
  employerOneCell: string;
  employerOneEmail: string;
  employerOneLengthOfEmployment: string;
  employerOnePosition: string;
  employerOneWages: string;
  employerOnePayPeriod: string;
  employerOneUnion: string;
  
  previousEmployerOne: string;
  previousEmployerOneAddress: string;
  previousEmployerOnePhone: string;
  previousEmployerOneCell: string;
  previousEmployerOneEmail: string;
  
  // Employment - Applicant Two
  employerTwo: string;
  employerTwoAddress: string;
  employerTwoPhone: string;
  employerTwoCell: string;
  employerTwoEmail: string;
  employerTwoLengthOfEmployment: string;
  employerTwoPosition: string;
  employerTwoWages: string;
  employerTwoPayPeriod: string;
  employerTwoUnion: string;
  
  previousEmployerTwo: string;
  previousEmployerTwoAddress: string;
  previousEmployerTwoPhone: string;
  previousEmployerTwoCell: string;
  previousEmployerTwoEmail: string;
  
  // Additional Income
  additionalIncomeAmount: string;
  additionalIncomeSource: string;
  additionalIncomeRecipient: string;
  
  // General Credit Information
  autoOneMake: string;
  autoOneYear: string;
  autoOneModel: string;
  autoOneLicState: string;
  autoOneLender: string;
  
  autoTwoMake: string;
  autoTwoYear: string;
  autoTwoModel: string;
  autoTwoLicState: string;
  autoTwoLender: string;
  
  bankOneBranch: string;
  bankOneChecking: string;
  bankOneSavings: string;
  
  bankTwoBranch: string;
  bankTwoChecking: string;
  bankTwoSavings: string;
  
  // Credit References
  creditRefOneAddress: string;
  creditRefOneAccountNum: string;
  creditRefOneBalance: string;
  creditRefOnePhone: string;
  
  creditRefTwoAddress: string;
  creditRefTwoAccountNum: string;
  creditRefTwoBalance: string;
  creditRefTwoPhone: string;
  
  // Personal References
  personalRefName: string;
  personalRefAddress: string;
  personalRefPhone: string;
  personalRefCell: string;
  personalRefEmail: string;
  
  // Emergency Contacts
  nearestRelativeName: string;
  nearestRelativeRelation: string;
  nearestRelativeAddress: string;
  nearestRelativePhone: string;
  nearestRelativeCell: string;
  nearestRelativeEmail: string;
  
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactAddress: string;
  emergencyContactPhone: string;
  emergencyContactCell: string;
  emergencyContactEmail: string;
  
  // Agreement
  agreeToTerms: boolean;
  signatureDate: string;
  applicantOneSignature: string;
  applicantTwoSignature: string;
}

const steps = [
  'Agent & Property Info',
  'Applicant Information',
  'Rental History',
  'Employment',
  'Credit Information',
  'References & Contacts',
  'Review & Submit'
];

const RentalApplication: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [formData, setFormData] = useState<ApplicationData>({
    // Agent/Broker Information
    preparedByAgent: '',
    preparedByBroker: '',
    agentPhone: '',
    agentEmail: '',

    // Documents
    paystubs: [],

    // Credit Application Details
    applicationDate: '',
    propertyAddress: '',
    monthlyRentAmount: '',
    creditReportFee: '',
    depositAmount: '',
    
    // Applicant Information
    applicantOneName: '',
    applicantOneDOB: '',
    applicantOneSSN: '',
    applicantOneDriversLic: '',
    applicantOneState: '',
    applicantOnePhone: '',
    applicantOneCell: '',
    applicantOneEmail: '',
    
    applicantTwoName: '',
    applicantTwoDOB: '',
    applicantTwoSSN: '',
    applicantTwoDriversLic: '',
    applicantTwoState: '',
    applicantTwoPhone: '',
    applicantTwoCell: '',
    applicantTwoEmail: '',
    
    additionalOccupants: '',
    
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
    previousAddress: '',
    previousCity: '',
    previousZip: '',
    previousLengthOfResidency: '',
    previousMonthlyRent: '',
    previousLandlordAgent: '',
    previousLandlordDRE: '',
    previousLandlordAddress: '',
    previousLandlordPhone: '',
    previousLandlordCell: '',
    previousLandlordEmail: '',
    
    // Employment - Applicant One
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
    
    previousEmployerOne: '',
    previousEmployerOneAddress: '',
    previousEmployerOnePhone: '',
    previousEmployerOneCell: '',
    previousEmployerOneEmail: '',
    
    // Employment - Applicant Two
    employerTwo: '',
    employerTwoAddress: '',
    employerTwoPhone: '',
    employerTwoCell: '',
    employerTwoEmail: '',
    employerTwoLengthOfEmployment: '',
    employerTwoPosition: '',
    employerTwoWages: '',
    employerTwoPayPeriod: '',
    employerTwoUnion: '',
    
    previousEmployerTwo: '',
    previousEmployerTwoAddress: '',
    previousEmployerTwoPhone: '',
    previousEmployerTwoCell: '',
    previousEmployerTwoEmail: '',
    
    // Additional Income
    additionalIncomeAmount: '',
    additionalIncomeSource: '',
    additionalIncomeRecipient: '',
    
    // General Credit Information
    autoOneMake: '',
    autoOneYear: '',
    autoOneModel: '',
    autoOneLicState: '',
    autoOneLender: '',
    
    autoTwoMake: '',
    autoTwoYear: '',
    autoTwoModel: '',
    autoTwoLicState: '',
    autoTwoLender: '',
    
    bankOneBranch: '',
    bankOneChecking: '',
    bankOneSavings: '',
    
    bankTwoBranch: '',
    bankTwoChecking: '',
    bankTwoSavings: '',
    
    // Credit References
    creditRefOneAddress: '',
    creditRefOneAccountNum: '',
    creditRefOneBalance: '',
    creditRefOnePhone: '',
    
    creditRefTwoAddress: '',
    creditRefTwoAccountNum: '',
    creditRefTwoBalance: '',
    creditRefTwoPhone: '',
    
    // Personal References
    personalRefName: '',
    personalRefAddress: '',
    personalRefPhone: '',
    personalRefCell: '',
    personalRefEmail: '',
    
    // Emergency Contacts
    nearestRelativeName: '',
    nearestRelativeRelation: '',
    nearestRelativeAddress: '',
    nearestRelativePhone: '',
    nearestRelativeCell: '',
    nearestRelativeEmail: '',
    
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactAddress: '',
    emergencyContactPhone: '',
    emergencyContactCell: '',
    emergencyContactEmail: '',
    
    // Agreement
    agreeToTerms: false,
    signatureDate: '',
    applicantOneSignature: '',
    applicantTwoSignature: ''
  });

  const navigate = useNavigate();

  const handleChange = (field: keyof ApplicationData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.type === 'checkbox' 
      ? (event.target as HTMLInputElement).checked 
      : event.target.value;
    setFormData({ ...formData, [field]: value });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setFormData({ ...formData, paystubs: files });
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // Load the PDF template
      const pdfBytes = await fetch('/RPI 553, Application to Rent (1).pdf').then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const form = pdfDoc.getForm();

      // Fill out the PDF form fields
      // Agent/Broker Information
      form.getTextField('preparedByAgent').setText(formData.preparedByAgent);
      form.getTextField('preparedByBroker').setText(formData.preparedByBroker);
      form.getTextField('agentPhone').setText(formData.agentPhone);
      form.getTextField('agentEmail').setText(formData.agentEmail);

      // Credit Application Details
      form.getTextField('applicationDate').setText(formData.applicationDate);
      form.getTextField('propertyAddress').setText(formData.propertyAddress);
      form.getTextField('monthlyRentAmount').setText(formData.monthlyRentAmount);
      form.getTextField('creditReportFee').setText(formData.creditReportFee);
      form.getTextField('depositAmount').setText(formData.depositAmount);

      // Applicant One Information
      form.getTextField('applicantOneName').setText(formData.applicantOneName);
      form.getTextField('applicantOneDOB').setText(formData.applicantOneDOB);
      form.getTextField('applicantOneSSN').setText(formData.applicantOneSSN);
      form.getTextField('applicantOneDriversLic').setText(formData.applicantOneDriversLic);
      form.getTextField('applicantOneState').setText(formData.applicantOneState);
      form.getTextField('applicantOnePhone').setText(formData.applicantOnePhone);
      form.getTextField('applicantOneCell').setText(formData.applicantOneCell);
      form.getTextField('applicantOneEmail').setText(formData.applicantOneEmail);

      // Applicant Two Information
      form.getTextField('applicantTwoName').setText(formData.applicantTwoName);
      form.getTextField('applicantTwoDOB').setText(formData.applicantTwoDOB);
      form.getTextField('applicantTwoSSN').setText(formData.applicantTwoSSN);
      form.getTextField('applicantTwoDriversLic').setText(formData.applicantTwoDriversLic);
      form.getTextField('applicantTwoState').setText(formData.applicantTwoState);
      form.getTextField('applicantTwoPhone').setText(formData.applicantTwoPhone);
      form.getTextField('applicantTwoCell').setText(formData.applicantTwoCell);
      form.getTextField('applicantTwoEmail').setText(formData.applicantTwoEmail);

      // Additional Occupants
      form.getTextField('additionalOccupants').setText(formData.additionalOccupants);

      // Rental History
      form.getCheckBox('hasEviction').check(formData.hasEviction);
      form.getCheckBox('hasBankruptcy').check(formData.hasBankruptcy);

      // Present Address
      form.getTextField('presentAddress').setText(formData.presentAddress);
      form.getTextField('presentCity').setText(formData.presentCity);
      form.getTextField('presentZip').setText(formData.presentZip);
      form.getTextField('presentLengthOfResidency').setText(formData.presentLengthOfResidency);
      form.getTextField('presentMonthlyRent').setText(formData.presentMonthlyRent);
      form.getTextField('presentLandlordAgent').setText(formData.presentLandlordAgent);
      form.getTextField('presentLandlordDRE').setText(formData.presentLandlordDRE);
      form.getTextField('presentLandlordAddress').setText(formData.presentLandlordAddress);
      form.getTextField('presentLandlordPhone').setText(formData.presentLandlordPhone);
      form.getTextField('presentLandlordCell').setText(formData.presentLandlordCell);
      form.getTextField('presentLandlordEmail').setText(formData.presentLandlordEmail);
      form.getTextField('reasonForMoving').setText(formData.reasonForMoving);
      form.getTextField('movingDate').setText(formData.movingDate);

      // Previous Address
      form.getTextField('previousAddress').setText(formData.previousAddress);
      form.getTextField('previousCity').setText(formData.previousCity);
      form.getTextField('previousZip').setText(formData.previousZip);
      form.getTextField('previousLengthOfResidency').setText(formData.previousLengthOfResidency);
      form.getTextField('previousMonthlyRent').setText(formData.previousMonthlyRent);
      form.getTextField('previousLandlordAgent').setText(formData.previousLandlordAgent);
      form.getTextField('previousLandlordDRE').setText(formData.previousLandlordDRE);
      form.getTextField('previousLandlordAddress').setText(formData.previousLandlordAddress);
      form.getTextField('previousLandlordPhone').setText(formData.previousLandlordPhone);
      form.getTextField('previousLandlordCell').setText(formData.previousLandlordCell);
      form.getTextField('previousLandlordEmail').setText(formData.previousLandlordEmail);

      // Employment - Applicant One
      form.getTextField('employerOne').setText(formData.employerOne);
      form.getTextField('employerOneAddress').setText(formData.employerOneAddress);
      form.getTextField('employerOnePhone').setText(formData.employerOnePhone);
      form.getTextField('employerOneCell').setText(formData.employerOneCell);
      form.getTextField('employerOneEmail').setText(formData.employerOneEmail);
      form.getTextField('employerOneLengthOfEmployment').setText(formData.employerOneLengthOfEmployment);
      form.getTextField('employerOnePosition').setText(formData.employerOnePosition);
      form.getTextField('employerOneWages').setText(formData.employerOneWages);
      form.getTextField('employerOnePayPeriod').setText(formData.employerOnePayPeriod);
      form.getTextField('employerOneUnion').setText(formData.employerOneUnion);

      form.getTextField('previousEmployerOne').setText(formData.previousEmployerOne);
      form.getTextField('previousEmployerOneAddress').setText(formData.previousEmployerOneAddress);
      form.getTextField('previousEmployerOnePhone').setText(formData.previousEmployerOnePhone);
      form.getTextField('previousEmployerOneCell').setText(formData.previousEmployerOneCell);
      form.getTextField('previousEmployerOneEmail').setText(formData.previousEmployerOneEmail);

      // Employment - Applicant Two
      form.getTextField('employerTwo').setText(formData.employerTwo);
      form.getTextField('employerTwoAddress').setText(formData.employerTwoAddress);
      form.getTextField('employerTwoPhone').setText(formData.employerTwoPhone);
      form.getTextField('employerTwoCell').setText(formData.employerTwoCell);
      form.getTextField('employerTwoEmail').setText(formData.employerTwoEmail);
      form.getTextField('employerTwoLengthOfEmployment').setText(formData.employerTwoLengthOfEmployment);
      form.getTextField('employerTwoPosition').setText(formData.employerTwoPosition);
      form.getTextField('employerTwoWages').setText(formData.employerTwoWages);
      form.getTextField('employerTwoPayPeriod').setText(formData.employerTwoPayPeriod);
      form.getTextField('employerTwoUnion').setText(formData.employerTwoUnion);

      // Additional Income
      form.getTextField('additionalIncomeAmount').setText(formData.additionalIncomeAmount);
      form.getTextField('additionalIncomeSource').setText(formData.additionalIncomeSource);
      form.getTextField('additionalIncomeRecipient').setText(formData.additionalIncomeRecipient);

      // General Credit Information - Automobiles
      form.getTextField('autoOneMake').setText(formData.autoOneMake);
      form.getTextField('autoOneYear').setText(formData.autoOneYear);
      form.getTextField('autoOneModel').setText(formData.autoOneModel);
      form.getTextField('autoOneLicState').setText(formData.autoOneLicState);

      form.getTextField('autoTwoMake').setText(formData.autoTwoMake);
      form.getTextField('autoTwoYear').setText(formData.autoTwoYear);
      form.getTextField('autoTwoModel').setText(formData.autoTwoModel);
      form.getTextField('autoTwoLicState').setText(formData.autoTwoLicState);

      // Bank Accounts
      form.getTextField('bankOneBranch').setText(formData.bankOneBranch);
      form.getTextField('bankOneChecking').setText(formData.bankOneChecking);
      form.getTextField('bankOneSavings').setText(formData.bankOneSavings);

      form.getTextField('bankTwoBranch').setText(formData.bankTwoBranch);
      form.getTextField('bankTwoChecking').setText(formData.bankTwoChecking);
      form.getTextField('bankTwoSavings').setText(formData.bankTwoSavings);

      // Credit References
      form.getTextField('creditRefOneAddress').setText(formData.creditRefOneAddress);
      form.getTextField('creditRefOneAccountNum').setText(formData.creditRefOneAccountNum);
      form.getTextField('creditRefOneBalance').setText(formData.creditRefOneBalance);
      form.getTextField('creditRefOnePhone').setText(formData.creditRefOnePhone);

      form.getTextField('creditRefTwoAddress').setText(formData.creditRefTwoAddress);
      form.getTextField('creditRefTwoAccountNum').setText(formData.creditRefTwoAccountNum);
      form.getTextField('creditRefTwoBalance').setText(formData.creditRefTwoBalance);
      form.getTextField('creditRefTwoPhone').setText(formData.creditRefTwoPhone);

      // Personal Reference
      form.getTextField('personalRefName').setText(formData.personalRefName);
      form.getTextField('personalRefAddress').setText(formData.personalRefAddress);
      form.getTextField('personalRefPhone').setText(formData.personalRefPhone);
      form.getTextField('personalRefCell').setText(formData.personalRefCell);
      form.getTextField('personalRefEmail').setText(formData.personalRefEmail);

      // Emergency Contacts
      form.getTextField('nearestRelativeName').setText(formData.nearestRelativeName);
      form.getTextField('nearestRelativeRelation').setText(formData.nearestRelativeRelation);
      form.getTextField('nearestRelativeAddress').setText(formData.nearestRelativeAddress);
      form.getTextField('nearestRelativePhone').setText(formData.nearestRelativePhone);
      form.getTextField('nearestRelativeCell').setText(formData.nearestRelativeCell);
      form.getTextField('nearestRelativeEmail').setText(formData.nearestRelativeEmail);

      form.getTextField('emergencyContactName').setText(formData.emergencyContactName);
      form.getTextField('emergencyContactRelation').setText(formData.emergencyContactRelation);
      form.getTextField('emergencyContactAddress').setText(formData.emergencyContactAddress);
      form.getTextField('emergencyContactPhone').setText(formData.emergencyContactPhone);
      form.getTextField('emergencyContactCell').setText(formData.emergencyContactCell);
      form.getTextField('emergencyContactEmail').setText(formData.emergencyContactEmail);

      // Agreement
      form.getCheckBox('agreeToTerms').check(formData.agreeToTerms);
      form.getTextField('signatureDate').setText(formData.signatureDate);

      // Save and download the filled PDF
      const filledPdfBytes = await pdfDoc.save();
      const blob = new Blob([filledPdfBytes], { type: 'application/pdf' });
      
      // Download the filled PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Rental_Application_Form.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSnackbar({
        open: true,
        message: 'Application form generated successfully! Please sign and upload the completed form.',
        severity: 'success',
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setSnackbar({
        open: true,
        message: 'Failed to generate application form. Please try again.',
        severity: 'error',
      });
    }
  };

  const renderBasicInformation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Agent/Broker Information</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Prepared by Agent"
          value={formData.preparedByAgent}
          onChange={handleChange('preparedByAgent')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Broker"
          value={formData.preparedByBroker}
          onChange={handleChange('preparedByBroker')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Agent Phone"
          value={formData.agentPhone}
          onChange={handleChange('agentPhone')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Agent Email"
          value={formData.agentEmail}
          onChange={handleChange('agentEmail')}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Application Details</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="date"
          label="Application Date"
          value={formData.applicationDate}
          onChange={handleChange('applicationDate')}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Property Address"
          value={formData.propertyAddress}
          onChange={handleChange('propertyAddress')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Monthly Rent Amount"
          value={formData.monthlyRentAmount}
          onChange={handleChange('monthlyRentAmount')}
          type="number"
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Credit Report Fee"
          value={formData.creditReportFee}
          onChange={handleChange('creditReportFee')}
          type="number"
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Deposit Amount"
          value={formData.depositAmount}
          onChange={handleChange('depositAmount')}
          type="number"
        />
      </Grid>
    </Grid>
  );

  const renderApplicantInformation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Applicant One</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Full Name"
          value={formData.applicantOneName}
          onChange={handleChange('applicantOneName')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="date"
          label="Date of Birth"
          value={formData.applicantOneDOB}
          onChange={handleChange('applicantOneDOB')}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Social Security Number"
          value={formData.applicantOneSSN}
          onChange={handleChange('applicantOneSSN')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Driver's License Number"
          value={formData.applicantOneDriversLic}
          onChange={handleChange('applicantOneDriversLic')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="State"
          value={formData.applicantOneState}
          onChange={handleChange('applicantOneState')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Phone"
          value={formData.applicantOnePhone}
          onChange={handleChange('applicantOnePhone')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Cell"
          value={formData.applicantOneCell}
          onChange={handleChange('applicantOneCell')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.applicantOneEmail}
          onChange={handleChange('applicantOneEmail')}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Applicant Two (if applicable)</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Full Name"
          value={formData.applicantTwoName}
          onChange={handleChange('applicantTwoName')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="date"
          label="Date of Birth"
          value={formData.applicantTwoDOB}
          onChange={handleChange('applicantTwoDOB')}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Social Security Number"
          value={formData.applicantTwoSSN}
          onChange={handleChange('applicantTwoSSN')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Driver's License Number"
          value={formData.applicantTwoDriversLic}
          onChange={handleChange('applicantTwoDriversLic')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="State"
          value={formData.applicantTwoState}
          onChange={handleChange('applicantTwoState')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Phone"
          value={formData.applicantTwoPhone}
          onChange={handleChange('applicantTwoPhone')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Cell"
          value={formData.applicantTwoCell}
          onChange={handleChange('applicantTwoCell')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.applicantTwoEmail}
          onChange={handleChange('applicantTwoEmail')}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Additional Occupants</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Names of Additional Occupants"
          value={formData.additionalOccupants}
          onChange={handleChange('additionalOccupants')}
          helperText="List names of all additional occupants"
        />
      </Grid>
    </Grid>
  );

  const renderRentalHistory = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Rental History Questions</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.hasEviction}
              onChange={handleChange('hasEviction')}
            />
          }
          label="Have you ever been party to an eviction?"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.hasBankruptcy}
              onChange={handleChange('hasBankruptcy')}
            />
          }
          label="Have you filed bankruptcy?"
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Present Address</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          value={formData.presentAddress}
          onChange={handleChange('presentAddress')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="City"
          value={formData.presentCity}
          onChange={handleChange('presentCity')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="ZIP"
          value={formData.presentZip}
          onChange={handleChange('presentZip')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Length of Residency"
          value={formData.presentLengthOfResidency}
          onChange={handleChange('presentLengthOfResidency')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Monthly Rent"
          type="number"
          value={formData.presentMonthlyRent}
          onChange={handleChange('presentMonthlyRent')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Landlord/Agent Name"
          value={formData.presentLandlordAgent}
          onChange={handleChange('presentLandlordAgent')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="DRE #"
          value={formData.presentLandlordDRE}
          onChange={handleChange('presentLandlordDRE')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Landlord Address"
          value={formData.presentLandlordAddress}
          onChange={handleChange('presentLandlordAddress')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Landlord Phone"
          value={formData.presentLandlordPhone}
          onChange={handleChange('presentLandlordPhone')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Landlord Cell"
          value={formData.presentLandlordCell}
          onChange={handleChange('presentLandlordCell')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Landlord Email"
          type="email"
          value={formData.presentLandlordEmail}
          onChange={handleChange('presentLandlordEmail')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Reason for Moving"
          value={formData.reasonForMoving}
          onChange={handleChange('reasonForMoving')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="date"
          label="Moving Date"
          value={formData.movingDate}
          onChange={handleChange('movingDate')}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Previous Address</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          value={formData.previousAddress}
          onChange={handleChange('previousAddress')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="City"
          value={formData.previousCity}
          onChange={handleChange('previousCity')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="ZIP"
          value={formData.previousZip}
          onChange={handleChange('previousZip')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Length of Residency"
          value={formData.previousLengthOfResidency}
          onChange={handleChange('previousLengthOfResidency')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Monthly Rent"
          type="number"
          value={formData.previousMonthlyRent}
          onChange={handleChange('previousMonthlyRent')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Landlord/Agent Name"
          value={formData.previousLandlordAgent}
          onChange={handleChange('previousLandlordAgent')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="DRE #"
          value={formData.previousLandlordDRE}
          onChange={handleChange('previousLandlordDRE')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Landlord Address"
          value={formData.previousLandlordAddress}
          onChange={handleChange('previousLandlordAddress')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Landlord Phone"
          value={formData.previousLandlordPhone}
          onChange={handleChange('previousLandlordPhone')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Landlord Cell"
          value={formData.previousLandlordCell}
          onChange={handleChange('previousLandlordCell')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Landlord Email"
          type="email"
          value={formData.previousLandlordEmail}
          onChange={handleChange('previousLandlordEmail')}
        />
      </Grid>
    </Grid>
  );

  const renderEmployment = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Employment - Applicant One</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Current Employer"
          value={formData.employerOne}
          onChange={handleChange('employerOne')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          value={formData.employerOneAddress}
          onChange={handleChange('employerOneAddress')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Phone"
          value={formData.employerOnePhone}
          onChange={handleChange('employerOnePhone')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Cell"
          value={formData.employerOneCell}
          onChange={handleChange('employerOneCell')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.employerOneEmail}
          onChange={handleChange('employerOneEmail')}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Length of Employment"
          value={formData.employerOneLengthOfEmployment}
          onChange={handleChange('employerOneLengthOfEmployment')}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Position"
          value={formData.employerOnePosition}
          onChange={handleChange('employerOnePosition')}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Wages"
          value={formData.employerOneWages}
          onChange={handleChange('employerOneWages')}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Union"
          value={formData.employerOneUnion}
          onChange={handleChange('employerOneUnion')}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>Previous Employer</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Previous Employer"
          value={formData.previousEmployerOne}
          onChange={handleChange('previousEmployerOne')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          value={formData.previousEmployerOneAddress}
          onChange={handleChange('previousEmployerOneAddress')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Phone"
          value={formData.previousEmployerOnePhone}
          onChange={handleChange('previousEmployerOnePhone')}
        />
      </Grid>

      {/* Applicant Two Employment Section */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Employment - Applicant Two</Typography>
      </Grid>
      {/* Add similar fields for Applicant Two's employment */}
    </Grid>
  );

  const renderCreditInformation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Automobiles</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>Automobile One</Typography>
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Make"
          value={formData.autoOneMake}
          onChange={handleChange('autoOneMake')}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Year"
          value={formData.autoOneYear}
          onChange={handleChange('autoOneYear')}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Model"
          value={formData.autoOneModel}
          onChange={handleChange('autoOneModel')}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="License #/State"
          value={formData.autoOneLicState}
          onChange={handleChange('autoOneLicState')}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>Automobile Two</Typography>
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Make"
          value={formData.autoTwoMake}
          onChange={handleChange('autoTwoMake')}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Year"
          value={formData.autoTwoYear}
          onChange={handleChange('autoTwoYear')}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Model"
          value={formData.autoTwoModel}
          onChange={handleChange('autoTwoModel')}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="License #/State"
          value={formData.autoTwoLicState}
          onChange={handleChange('autoTwoLicState')}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Bank Accounts</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>Bank One</Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Bank/Branch"
          value={formData.bankOneBranch}
          onChange={handleChange('bankOneBranch')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Checking Account #"
          value={formData.bankOneChecking}
          onChange={handleChange('bankOneChecking')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Savings Account #"
          value={formData.bankOneSavings}
          onChange={handleChange('bankOneSavings')}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>Bank Two</Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Bank/Branch"
          value={formData.bankTwoBranch}
          onChange={handleChange('bankTwoBranch')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Checking Account #"
          value={formData.bankTwoChecking}
          onChange={handleChange('bankTwoChecking')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Savings Account #"
          value={formData.bankTwoSavings}
          onChange={handleChange('bankTwoSavings')}
        />
      </Grid>
    </Grid>
  );

  const renderReferences = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Credit References</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>Credit Reference One</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          value={formData.creditRefOneAddress}
          onChange={handleChange('creditRefOneAddress')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Account Number"
          value={formData.creditRefOneAccountNum}
          onChange={handleChange('creditRefOneAccountNum')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Balance Due"
          value={formData.creditRefOneBalance}
          onChange={handleChange('creditRefOneBalance')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Phone"
          value={formData.creditRefOnePhone}
          onChange={handleChange('creditRefOnePhone')}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>Credit Reference Two</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          value={formData.creditRefTwoAddress}
          onChange={handleChange('creditRefTwoAddress')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Account Number"
          value={formData.creditRefTwoAccountNum}
          onChange={handleChange('creditRefTwoAccountNum')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Balance Due"
          value={formData.creditRefTwoBalance}
          onChange={handleChange('creditRefTwoBalance')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Phone"
          value={formData.creditRefTwoPhone}
          onChange={handleChange('creditRefTwoPhone')}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Personal Reference</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Name"
          value={formData.personalRefName}
          onChange={handleChange('personalRefName')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          value={formData.personalRefAddress}
          onChange={handleChange('personalRefAddress')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Phone"
          value={formData.personalRefPhone}
          onChange={handleChange('personalRefPhone')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Cell"
          value={formData.personalRefCell}
          onChange={handleChange('personalRefCell')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.personalRefEmail}
          onChange={handleChange('personalRefEmail')}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Emergency Contacts</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>Nearest Relative</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Name"
          value={formData.nearestRelativeName}
          onChange={handleChange('nearestRelativeName')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Relationship"
          value={formData.nearestRelativeRelation}
          onChange={handleChange('nearestRelativeRelation')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          value={formData.nearestRelativeAddress}
          onChange={handleChange('nearestRelativeAddress')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Phone"
          value={formData.nearestRelativePhone}
          onChange={handleChange('nearestRelativePhone')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Cell"
          value={formData.nearestRelativeCell}
          onChange={handleChange('nearestRelativeCell')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.nearestRelativeEmail}
          onChange={handleChange('nearestRelativeEmail')}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>Emergency Contact</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Name"
          value={formData.emergencyContactName}
          onChange={handleChange('emergencyContactName')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Relationship"
          value={formData.emergencyContactRelation}
          onChange={handleChange('emergencyContactRelation')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          value={formData.emergencyContactAddress}
          onChange={handleChange('emergencyContactAddress')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Phone"
          value={formData.emergencyContactPhone}
          onChange={handleChange('emergencyContactPhone')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Cell"
          value={formData.emergencyContactCell}
          onChange={handleChange('emergencyContactCell')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.emergencyContactEmail}
          onChange={handleChange('emergencyContactEmail')}
        />
      </Grid>
    </Grid>
  );

  const renderReviewAndSubmit = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Review and Submit</Typography>
        <Typography variant="body1" paragraph>
          Please review all the information you have provided. By submitting this application:
        </Typography>
        <Typography variant="body2" paragraph>
          1. You declare that all information given in this application is true and correct.
        </Typography>
        <Typography variant="body2" paragraph>
          2. You authorize your credit reporting agency to obtain and verify a complete consumer report.
        </Typography>
        <Typography variant="body2" paragraph>
          3. You understand this information is not privileged.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.agreeToTerms}
              onChange={handleChange('agreeToTerms')}
            />
          }
          label="I agree to the terms and conditions"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          type="date"
          label="Date"
          value={formData.signatureDate}
          onChange={handleChange('signatureDate')}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
    </Grid>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderBasicInformation();
      case 1:
        return renderApplicantInformation();
      case 2:
        return renderRentalHistory();
      case 3:
        return renderEmployment();
      case 4:
        return renderCreditInformation();
      case 5:
        return renderReferences();
      case 6:
        return renderReviewAndSubmit();
      default:
        return <div>Step {step}</div>;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Rental Application
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ py: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
          {activeStep > 0 && (
            <Button onClick={handleBack}>
              Back
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleNext}
          >
            {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RentalApplication; 