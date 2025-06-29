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

// Test function to fill each field with its field name for debugging
export const testFillFormFields = (form: PDFFormWithFields) => {
  const fieldNames = form.getFields().map(field => field.getName());
  
  console.log('=== TEST FILLING FIELDS WITH FIELD NAMES ===');
  
  for (const fieldName of fieldNames) {
    try {
      // Try to get the field as a text field
      try {
        const textField = form.getTextField(fieldName);
        if (textField) {
          textField.setText(fieldName);
          console.log(`Set ${fieldName} to: ${fieldName}`);
        }
      } catch (error) {
        // Field is not a text field, try checkbox
        try {
          const checkBox = form.getCheckBox(fieldName);
          if (checkBox) {
            checkBox.check(true);
            console.log(`Set ${fieldName} checkbox to: true`);
          }
        } catch (error) {
          console.log(`Could not set ${fieldName} - unknown field type`);
        }
      }
    } catch (fieldError) {
      console.warn(`Could not fill field: ${fieldName}`, fieldError);
    }
  }
  
  console.log('=== TEST FILLING COMPLETE ===');
};

// Function to fill form fields using generic Textbox field names
export const fillFormFieldsRevised = (form: PDFFormWithFields, formData: RentalApplicationFormData) => {
  const fieldMapping: Record<string, string> = {
    // Agent/Broker Section
    'Textbox1': formData.preparedByAgent || '',
    'Textbox2': formData.preparedByBroker || '',
    'Textbox3': formData.agentPhone || '',
    'Textbox4': formData.agentEmail || '',

    // Application Details
    'Textbox5': formData.applicationDate || '',
    'Textbox6': formData.propertyAddress || '', // 'at' field, use property address
    'Textbox7': formData.monthlyRentAmount || '',
    'Textbox8': formData.creditReportFee || '', // Received from Applicant(s) $
    'Textbox9': formData.propertyAddress || '',

    // Landlord's application screening criteria
    'Textbox10': '', // Not in formData, leave blank
    'Textbox11': '',
    'Textbox12': '',
    'Textbox13': '',

    // Applicant(s)
    'Textbox14': formData.applicantOneName || '',
    'Textbox15': formData.applicantOneDOB || '',
    'Textbox16': formData.applicantOneSSN || '',
    'Textbox17': formData.applicantOneDriversLic || '',
    'Textbox18': formData.applicantOneState || '',
    'Textbox19': formData.applicantOnePhone || '',
    'Textbox20': formData.applicantOneCell || '',
    'Textbox21': formData.applicantOneEmail || '',

    // Additional Occupant(s)
    'Textbox22': formData.additionalOccupants || '', // Only one occupant supported in form
    'Textbox23': '', // Not in formData, leave blank

    // Rental History
    'Textbox28': formData.presentAddress || '',
    'Textbox29': formData.presentCity || '',
    'Textbox30': formData.presentZip || '',
    'Textbox31': formData.presentLengthOfResidency || '',
    'Textbox32': formData.presentMonthlyRent || '',
    'Textbox33': formData.presentLandlordAgent || '',
    'Textbox34': formData.presentLandlordDRE || '',
    'Textbox35': formData.presentLandlordAddress || '',
    'Textbox36': formData.presentLandlordPhone || '',
    'Textbox37': formData.presentLandlordCell || '',
    'Textbox38': formData.presentLandlordEmail || '',
    'Textbox39': formData.reasonForMoving || '',
    'Textbox40': formData.movingDate || '',

    // Previous Address
    'Textbox41': formData.previousAddress || '',
    'Textbox42': formData.previousCity || '',
    'Textbox43': formData.previousZip || '',
    'Textbox44': formData.previousLengthOfResidency || '',
    'Textbox45': formData.previousMonthlyRent || '',
    'Textbox46': formData.previousLandlordAgent || '',
    'Textbox47': formData.previousLandlordDRE || '',
    'Textbox48': formData.previousLandlordAddress || '',
    'Textbox49': '', // Not in formData, leave blank
    'Textbox50': formData.previousLandlordPhone || '',
    'Textbox51': formData.previousLandlordCell || '',
    'Textbox52': formData.previousLandlordEmail || '',

    // Employment Details
    'Textbox53': formData.employerOne || '',
    'Textbox54': formData.employerOneAddress || '',
    'Textbox55': formData.employerOnePhone || '',
    'Textbox56': formData.employerOneCell || '',
    'Textbox57': formData.employerOneEmail || '',
    'Textbox58': formData.employerOneLengthOfEmployment || '',
    'Textbox59': formData.employerOnePosition || '',
    'Textbox60': formData.employerOneWages || '',
    'Textbox61': formData.employerOnePayPeriod || '',
    'Textbox62': formData.employerOneUnion || '',

    // Previous Employer
    'Textbox63': formData.previousEmployerOne || '',
    'Textbox64': formData.previousEmployerOneAddress || '',
    'Textbox65': formData.previousEmployerOnePhone || '',
    'Textbox66': formData.previousEmployerOneCell || '',
    'Textbox67': formData.previousEmployerOneEmail || '',

    // Additional Income
    'Textbox68': formData.additionalIncomeAmount || '',
    'Textbox69': formData.additionalIncomeSource || '',
    'Textbox70': formData.additionalIncomeRecipient || '',

    // General Credit Information (Automobiles)
    'Textbox71': formData.autoOneMake || '',
    'Textbox72': formData.autoOneYear || '',
    'Textbox73': formData.autoOneModel || '',
    'Textbox74': formData.autoOneLicState || '',
    'Textbox75': formData.autoOneLender || '',
    'Textbox76': formData.autoTwoMake || '',
    'Textbox77': formData.autoTwoYear || '',
    'Textbox78': formData.autoTwoModel || '',
    'Textbox79': formData.autoTwoLicState || '',
    'Textbox80': formData.autoTwoLender || '',

    // Bank Accounts
    'Textbox81': formData.bankOneBranch || '',
    'Textbox82': formData.bankOneChecking || '',
    'Textbox83': formData.bankOneSavings || '',
    'Textbox84': formData.bankTwoBranch || '',
    'Textbox85': formData.bankTwoChecking || '',
    'Textbox86': formData.bankTwoSavings || '',

    // Credit References
    'Textbox87': formData.creditRefOneAddress || '',
    'Textbox88': formData.creditRefOneAccountNum || '',
    'Textbox89': formData.creditRefOneBalance || '',
    'Textbox90': formData.creditRefOnePhone || '',
    'Textbox91': formData.creditRefTwoAddress || '',
    'Textbox92': formData.creditRefTwoAccountNum || '',
    'Textbox93': formData.creditRefTwoBalance || '',
    'Textbox94': formData.creditRefTwoPhone || '',

    // References and Emergency Contacts
    'Textbox95': formData.personalRefName || '',
    'Textbox96': formData.personalRefAddress || '',
    'Textbox97': formData.personalRefPhone || '',
    'Textbox98': formData.personalRefCell || '',
    'Textbox99': formData.personalRefEmail || '',
    'Textbox100': formData.nearestRelativeName || '',
    'Textbox101': formData.nearestRelativeAddress || '',
    'Textbox102': formData.nearestRelativePhone || '',
    'Textbox103': formData.nearestRelativeCell || '',
    'Textbox104': formData.nearestRelativeEmail || '',
    'Textbox105': formData.emergencyContactName || '',
    'Textbox106': formData.emergencyContactAddress || '',
    'Textbox107': formData.emergencyContactPhone || '',
    'Textbox108': formData.emergencyContactCell || '',
    'Textbox109': formData.emergencyContactEmail || '',
  };

  const fieldNames = form.getFields().map(field => field.getName());
  for (const fieldName of fieldNames) {
    try {
      const value = fieldMapping[fieldName];
      if (value !== undefined) {
        try {
          const textField = form.getTextField(fieldName);
          if (textField) {
            textField.setText(value);
          }
        } catch {
          // Not a text field, try checkbox
          try {
            const checkBox = form.getCheckBox(fieldName);
            if (checkBox) {
              // Explicitly handle eviction and bankruptcy checkboxes
              if (fieldName === 'Check Box24' || fieldName === 'Check Box25') {
                const yesBox = form.getCheckBox('Check Box24');
                const noBox = form.getCheckBox('Check Box25');
                if (yesBox && noBox) {
                  if (formData.hasEviction === 'yes') {
                    yesBox.check(true);
                    noBox.check(false);
                  } else {
                    yesBox.check(false);
                    noBox.check(true);
                  }
                }
              } else if (fieldName === 'Check Box26' || fieldName === 'Check Box27') {
                const yesBox = form.getCheckBox('Check Box26');
                const noBox = form.getCheckBox('Check Box27');
                if (yesBox && noBox) {
                  if (formData.hasBankruptcy === 'yes') {
                    yesBox.check(true);
                    noBox.check(false);
                  } else {
                    yesBox.check(false);
                    noBox.check(true);
                  }
                }
              }
            }
          } catch {}
        }
      } else {
        // Handle eviction/bankruptcy checkboxes even if not in mapping
        try {
          if (fieldName === 'Check Box24' || fieldName === 'Check Box25') {
            const yesBox = form.getCheckBox('Check Box24');
            const noBox = form.getCheckBox('Check Box25');
            if (yesBox && noBox) {
              if (formData.hasEviction === 'yes') {
                yesBox.check(true);
                noBox.check(false);
              } else {
                yesBox.check(false);
                noBox.check(true);
              }
            }
          } else if (fieldName === 'Check Box26' || fieldName === 'Check Box27') {
            const yesBox = form.getCheckBox('Check Box26');
            const noBox = form.getCheckBox('Check Box27');
            if (yesBox && noBox) {
              if (formData.hasBankruptcy === 'yes') {
                yesBox.check(true);
                noBox.check(false);
              } else {
                yesBox.check(false);
                noBox.check(true);
              }
            }
          }
        } catch {}
      }
    } catch (err) {
      console.warn(`Could not fill field: ${fieldName}`, err);
    }
  }
}; 