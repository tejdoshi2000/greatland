import { PDFForm, PDFTextField, PDFCheckBox } from 'pdf-lib';
import { PDFFormWithFields, RentalApplicationFormData } from './types';

// Helper function to split date into components
export const splitDate = (dateString: string) => {
  if (!dateString) return { month: '', day: '', year: '' };
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return { month, day, year };
};

// Function to fill form fields
export const fillFormFields = (form: PDFFormWithFields, formData: RentalApplicationFormData) => {
  // Get all field names from the form
  const fieldNames = form.getFields().map(field => field.getName());
  
  // Debug: Log all field names
  console.log('All PDF form fields:', fieldNames);
  
  // Prepare date values
  const { month, day, year } = splitDate(formData.applicationDate);
  const dateMMDD = `${month}/${day}`;
  const yearShort = year.slice(2);

  for (const fieldName of fieldNames) {
    try {
      console.log('Processing field:', fieldName);
      
      // Get the text field
      const textField = form.getTextField(fieldName);
      if (textField) {
        // Date, Year, At, Property Address
        if (fieldName === 'DATE') {
          textField.setText(dateMMDD);
        } else if (fieldName === '20') {
          textField.setText(yearShort);
        } else if (fieldName === 'at' || fieldName === 'Property Address') {
          textField.setText(formData.propertyAddress);
        }
        // Rental History
        else if (fieldName === 'Eviction No') {
          form.getCheckBox(fieldName).check(formData.hasEviction === false);
        } else if (fieldName === 'Bankruptcy No') {
          form.getCheckBox(fieldName).check(formData.hasBankruptcy === false);
        }
        // Applicant 2 Employment (set to blank)
        else if (
          fieldName.startsWith('employerTwo') ||
          fieldName.startsWith('previousEmployerTwo')
        ) {
          textField.setText('');
        }
        // Automobile Info
        else if (fieldName === 'Lic #State') {
          textField.setText(formData.autoOneLicState || '');
        } else if (fieldName === 'Lic #State_2') {
          textField.setText(formData.autoTwoLicState || '');
        }
        // Personal Reference
        else if (fieldName === 'Personal Reference Name') {
          textField.setText(formData.personalRefName || '');
        } else if (fieldName === 'Personal Reference Address') {
          textField.setText(formData.personalRefAddress || '');
        } else if (fieldName === 'Personal Reference Phone') {
          textField.setText(formData.personalRefPhone || '');
        } else if (fieldName === 'Personal Reference Cell') {
          textField.setText(formData.personalRefCell || '');
        } else if (fieldName === 'Personal Reference Email') {
          textField.setText(formData.personalRefEmail || '');
        }
        // Nearest Relative
        else if (fieldName === 'Nearest Relative Name') {
          textField.setText(formData.nearestRelativeName || '');
        } else if (fieldName === 'Nearest Relative Relation') {
          textField.setText(formData.nearestRelativeRelation || '');
        } else if (fieldName === 'Nearest Relative Address') {
          textField.setText(formData.nearestRelativeAddress || '');
        } else if (fieldName === 'Nearest Relative Phone') {
          textField.setText(formData.nearestRelativePhone || '');
        } else if (fieldName === 'Nearest Relative Cell') {
          textField.setText(formData.nearestRelativeCell || '');
        } else if (fieldName === 'Nearest Relative Email') {
          textField.setText(formData.nearestRelativeEmail || '');
        }
        // Emergency Contact
        else if (fieldName === 'Emergency Contact Name') {
          textField.setText(formData.emergencyContactName || '');
        } else if (fieldName === 'Emergency Contact Relation') {
          textField.setText(formData.emergencyContactRelation || '');
        } else if (fieldName === 'Emergency Contact Address') {
          textField.setText(formData.emergencyContactAddress || '');
        } else if (fieldName === 'Emergency Contact Phone') {
          textField.setText(formData.emergencyContactPhone || '');
        } else if (fieldName === 'Emergency Contact Cell') {
          textField.setText(formData.emergencyContactCell || '');
        } else if (fieldName === 'Emergency Contact Email') {
          textField.setText(formData.emergencyContactEmail || '');
        }
        // Acknowledgment section (set to empty)
        else if (
          fieldName.toLowerCase().includes('acknowledgment') ||
          fieldName.toLowerCase().includes('acknowledgement') ||
          fieldName.toLowerCase().includes('signature') ||
          fieldName.toLowerCase().includes('sign') ||
          fieldName.toLowerCase().includes('date') && fieldName !== 'DATE' && fieldName !== '20'
        ) {
          textField.setText('');
        }
        // Default: try to fill by matching field name
        else {
          const value = formData[fieldName as keyof RentalApplicationFormData];
          if (typeof value === 'string') {
            textField.setText(value);
          } else if (typeof value === 'boolean') {
            textField.setText(value ? 'Yes' : 'No');
          }
        }
      }
      
      // Map field names to data
      if (fieldName === 'Prepared by Agent') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.preparedByAgent || '');
        }
      } else if (fieldName === 'Broker') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.preparedByBroker || '');
        }
      } else if (fieldName === 'Phone') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.agentPhone || '');
        }
      } else if (fieldName === 'Email') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.agentEmail || '');
        }
      } else if (fieldName === 'THIS CREDIT APPLICATION is for payment of monthly rent in the amount of') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.monthlyRentAmount || '');
        }
      } else if (fieldName === 'Applicant One') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.applicantOneName || '');
        }
      } else if (fieldName === 'Date of Birth') {
        const { month, day, year } = splitDate(formData.applicantOneDOB);
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(month);
        }
      } else if (fieldName === 'undefined_2') {
        const { month, day, year } = splitDate(formData.applicantOneDOB);
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(day);
        }
      } else if (fieldName === 'undefined_3') {
        const { month, day, year } = splitDate(formData.applicantOneDOB);
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(year);
        }
      } else if (fieldName === 'Social Sec') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.applicantOneSSN || '');
        }
      } else if (fieldName === 'Drivers Lic') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.applicantOneDriversLic || '');
        }
      } else if (fieldName === 'State') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.applicantOneState || '');
        }
      } else if (fieldName === 'Phone_2') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.applicantOnePhone || '');
        }
      } else if (fieldName === 'Cell') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.applicantOneCell || '');
        }
      } else if (fieldName === 'Email_2') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.applicantOneEmail || '');
        }
      } else if (fieldName === 'Present Address') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.presentAddress || '');
        }
      } else if (fieldName === 'City') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.presentCity || '');
        }
      } else if (fieldName === 'Zip') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.presentZip || '');
        }
      } else if (fieldName === 'Length of Residency') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.presentLengthOfResidency || '');
        }
      } else if (fieldName === 'Monthly Rent') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.presentMonthlyRent || '');
        }
      } else if (fieldName === 'LandlordAgent') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.presentLandlordAgent || '');
        }
      } else if (fieldName === 'DRE') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.presentLandlordDRE || '');
        }
      } else if (fieldName === 'Address') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.presentLandlordAddress || '');
        }
      } else if (fieldName === 'Phone_4') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.presentLandlordPhone || '');
        }
      } else if (fieldName === 'Cell_3') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.presentLandlordCell || '');
        }
      } else if (fieldName === 'Email_4') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.presentLandlordEmail || '');
        }
      } else if (fieldName === 'Reason for Moving') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.reasonForMoving || '');
        }
      } else if (fieldName === 'Moving Date') {
        const { month, day, year } = splitDate(formData.movingDate);
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(month);
        }
      } else if (fieldName === 'undefined_6') {
        const { month, day, year } = splitDate(formData.movingDate);
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(day);
        }
      } else if (fieldName === 'undefined_7') {
        const { month, day, year } = splitDate(formData.movingDate);
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(year);
        }
      } else if (fieldName === 'Additional Occupants Name') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.additionalOccupants || '');
        }
      } else if (fieldName === 'Name') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.additionalOccupants || '');
        }
      } else if (fieldName === 'Check Box8') {
        const checkBox = form.getCheckBox(fieldName) as PDFCheckBox;
        if (checkBox) {
          checkBox.check(formData.hasEviction);
        }
      } else if (fieldName === 'Check Box9') {
        const checkBox = form.getCheckBox(fieldName) as PDFCheckBox;
        if (checkBox) {
          checkBox.check(formData.hasBankruptcy);
        }
      } else if (fieldName === 'Previous Address') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.previousAddress || '');
        }
      } else if (fieldName === 'City_2') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.previousCity || '');
        }
      } else if (fieldName === 'Zip_2') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.previousZip || '');
        }
      } else if (fieldName === 'Length of Residency_2') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.previousLengthOfResidency || '');
        }
      } else if (fieldName === 'Monthly Rent_2') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.previousMonthlyRent || '');
        }
      } else if (fieldName === 'LandlordAgent_2') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.previousLandlordAgent || '');
        }
      } else if (fieldName === 'DRE_2') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.previousLandlordDRE || '');
        }
      } else if (fieldName === 'Address_2') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.previousLandlordAddress || '');
        }
      } else if (fieldName === 'Phone_5') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.previousLandlordPhone || '');
        }
      } else if (fieldName === 'Cell_4') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.previousLandlordCell || '');
        }
      } else if (fieldName === 'Email_5') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.previousLandlordEmail || '');
        }
      } else if (fieldName === 'Previous Employer') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.previousEmployerOne || '');
        }
      } else if (fieldName === 'Address_4') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.previousEmployerOneAddress || '');
        }
      } else if (fieldName === 'Phone_7') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.previousEmployerOnePhone || '');
        }
      } else if (fieldName === 'Cell_6') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.previousEmployerOneCell || '');
        }
      } else if (fieldName === 'Email_7') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.previousEmployerOneEmail || '');
        }
      } else if (fieldName === 'Employer') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.employerOne || '');
        }
      } else if (fieldName === 'Address_3') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.employerOneAddress || '');
        }
      } else if (fieldName === 'Phone_6') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.employerOnePhone || '');
        }
      } else if (fieldName === 'Cell_5') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.employerOneCell || '');
        }
      } else if (fieldName === 'Email_6') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.employerOneEmail || '');
        }
      } else if (fieldName === 'Length of Employment') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.employerOneLengthOfEmployment || '');
        }
      } else if (fieldName === 'Position') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.employerOnePosition || '');
        }
      } else if (fieldName === 'Wages') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.employerOneWages || '');
        }
      } else if (fieldName === 'Pay Period') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.employerOnePayPeriod || '');
        }
      } else if (fieldName === 'Union') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.employerOneUnion || '');
        }
      } else if (fieldName === 'Additional Income Amount') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.additionalIncomeAmount || '');
        }
      } else if (fieldName === 'Source') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.additionalIncomeSource || '');
        }
      } else if (fieldName === 'Recipient') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.additionalIncomeRecipient || '');
        }
      } else if (fieldName === 'Automobile One Make') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.autoOneMake || '');
        }
      } else if (fieldName === 'Year') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.autoOneYear || '');
        }
      } else if (fieldName === 'Model') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.autoOneModel || '');
        }
      } else if (fieldName === 'Lender') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.autoOneLender || '');
        }
      } else if (fieldName === 'Automobile Two Make') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.autoTwoMake || '');
        }
      } else if (fieldName === 'Year_2') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.autoTwoYear || '');
        }
      } else if (fieldName === 'Model_2') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.autoTwoModel || '');
        }
      } else if (fieldName === 'Lender_2') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.autoTwoLender || '');
        }
      } else if (fieldName === 'Bankbranch') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.bankOneBranch || '');
        }
      } else if (fieldName === 'Check acc') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.bankOneChecking || '');
        }
      } else if (fieldName === 'Savings Acc') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.bankOneSavings || '');
        }
      } else if (fieldName === 'Bankbranch_2') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.bankTwoBranch || '');
        }
      } else if (fieldName === 'Check acc_2') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.bankTwoChecking || '');
        }
      } else if (fieldName === 'Savings Acc_2') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.bankTwoSavings || '');
        }
      } else if (fieldName === '1') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.creditRefOneName || '');
        }
      } else if (fieldName === 'Credit References Address') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.creditRefOneAddress || '');
        }
      } else if (fieldName === 'Account') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.creditRefOneAccountNum || '');
        }
      } else if (fieldName === 'Balance due') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.creditRefOneBalance || '');
        }
      } else if (fieldName === 'Credit References Phone') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.creditRefOnePhone || '');
        }
      } else if (fieldName === '2') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.creditRefTwoName || '');
        }
      } else if (fieldName === 'Credit References Address_2') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.creditRefTwoAddress || '');
        }
      } else if (fieldName === 'Account_2') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.creditRefTwoAccountNum || '');
        }
      } else if (fieldName === 'Balance due_2') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.creditRefTwoBalance || '');
        }
      } else if (fieldName === 'Credit References Phone_2') {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(formData.creditRefTwoPhone || '');
        }
      }
    } catch (fieldError) {
      console.warn(`Could not fill field: ${fieldName}`, fieldError);
    }
  }
}; 