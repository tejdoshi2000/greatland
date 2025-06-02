import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

interface RentalApplicationPDFProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    currentAddress: string;
    currentLandlord: string;
    currentLandlordPhone: string;
    employer: string;
    position: string;
    monthlyIncome: string;
    employmentDuration: string;
    emergencyContact: string;
    emergencyContactPhone: string;
    pets: string;
    additionalOccupants: string;
    moveInDate: string;
    leaseTerm: string;
  };
  propertyName: string;
  propertyAddress: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '40%',
    fontSize: 12,
    fontWeight: 'bold',
  },
  value: {
    width: '60%',
    fontSize: 12,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginVertical: 10,
  },
});

export const RentalApplicationPDF: React.FC<RentalApplicationPDFProps> = ({
  formData,
  propertyName,
  propertyAddress,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Rental Application</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Property Name:</Text>
            <Text style={styles.value}>{propertyName}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Property Address:</Text>
            <Text style={styles.value}>{propertyAddress}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.subtitle}>Personal Information</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.value}>{`${formData.firstName} ${formData.lastName}`}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{formData.email}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{formData.phone}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.subtitle}>Current Residence</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Current Address:</Text>
            <Text style={styles.value}>{formData.currentAddress}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Current Landlord:</Text>
            <Text style={styles.value}>{formData.currentLandlord}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Landlord Phone:</Text>
            <Text style={styles.value}>{formData.currentLandlordPhone}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.subtitle}>Employment Information</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Employer:</Text>
            <Text style={styles.value}>{formData.employer}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Position:</Text>
            <Text style={styles.value}>{formData.position}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Monthly Income:</Text>
            <Text style={styles.value}>{`$${formData.monthlyIncome}`}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Employment Duration:</Text>
            <Text style={styles.value}>{formData.employmentDuration}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.subtitle}>Additional Information</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Emergency Contact:</Text>
            <Text style={styles.value}>{formData.emergencyContact}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Emergency Contact Phone:</Text>
            <Text style={styles.value}>{formData.emergencyContactPhone}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Pets:</Text>
            <Text style={styles.value}>{formData.pets || 'None'}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Additional Occupants:</Text>
            <Text style={styles.value}>{formData.additionalOccupants || 'None'}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.subtitle}>Lease Information</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Move-in Date:</Text>
            <Text style={styles.value}>{formData.moveInDate}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Lease Term:</Text>
            <Text style={styles.value}>{formData.leaseTerm}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.text}>
            I certify that all information provided in this application is true and complete. I authorize the verification of any information provided.
          </Text>
          
          <View style={{ marginTop: 30 }}>
            <View style={styles.row}>
              <Text style={styles.label}>Applicant Signature:</Text>
              <Text style={styles.value}>___________________________</Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>___________________________</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}; 