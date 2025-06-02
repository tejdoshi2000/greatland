import { PDFForm, PDFTextField, PDFCheckBox } from 'pdf-lib';

export interface PDFFormWithFields extends PDFForm {
  getFields(): Array<{
    getName(): string;
  }>;
  getTextField(name: string): PDFTextField;
  getCheckBox(name: string): PDFCheckBox;
}

export interface RentalApplicationFormData {
  // Agent/Broker Information
  preparedByAgent: string;
  preparedByBroker: string;
  agentPhone: string;
  agentEmail: string;

  // Application Details
  applicationDate: string;
  applicationDateFormatted: string;  // Format: "DD/MM"
  applicationYear: string;           // Format: "YY"
  propertyAddress: string;
  monthlyRentAmount: string;
  creditReportFee: string;
  depositAmount: string;

  // Applicant One Information
  applicantOneName: string;
  applicantOneDOB: string;
  applicantOneSSN: string;
  applicantOneDriversLic: string;
  applicantOneState: string;
  applicantOnePhone: string;
  applicantOneCell: string;
  applicantOneEmail: string;

  // Applicant Two Information
  applicantTwoName: string;
  applicantTwoDOB: string;
  applicantTwoSSN: string;
  applicantTwoDriversLic: string;
  applicantTwoState: string;
  applicantTwoPhone: string;
  applicantTwoCell: string;
  applicantTwoEmail: string;

  // Additional Occupants
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

  // Employment Information
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

  // Previous Employment
  previousEmployerOne: string;
  previousEmployerOneAddress: string;
  previousEmployerOnePhone: string;
  previousEmployerOneCell: string;
  previousEmployerOneEmail: string;
  previousEmployerOneLengthOfEmployment: string;
  previousEmployerOnePosition: string;
  previousEmployerOneWages: string;
  previousEmployerOnePayPeriod: string;
  previousEmployerOneUnion: string;

  // Employment Information - Applicant Two
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

  // Additional Income
  additionalIncomeAmount: string;
  additionalIncomeSource: string;
  additionalIncomeRecipient: string;

  // Automobiles
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

  // Bank Accounts
  bankOneBranch: string;
  bankOneChecking: string;
  bankOneSavings: string;
  bankTwoBranch: string;
  bankTwoChecking: string;
  bankTwoSavings: string;

  // Credit References
  creditRefOneName: string;
  creditRefOneAddress: string;
  creditRefOneAccountNum: string;
  creditRefOneBalance: string;
  creditRefOnePhone: string;
  creditRefTwoName: string;
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

  // Signatures and Dates
  signatureDate: string;
  acknowledgmentDate: string;
  agreeToTerms: boolean;
} 