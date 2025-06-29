import { PDFDocument } from 'pdf-lib';
import { PDFFormWithFields } from './types';

export const analyzePdfFields = async (pdfBytes: Uint8Array) => {
  try {
    // Convert Uint8Array to ArrayBuffer
    const arrayBuffer = new ArrayBuffer(pdfBytes.byteLength);
    new Uint8Array(arrayBuffer).set(pdfBytes);
    
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const form = pdfDoc.getForm() as PDFFormWithFields;
    const fields = form.getFields();
    
    console.log('=== PDF TEMPLATE FIELD ANALYSIS ===');
    console.log(`Total fields found: ${fields.length}`);
    console.log('\nFields in order:');
    
    fields.forEach((field: { getName(): string }, index: number) => {
      const fieldName = field.getName();
      console.log(`${index + 1}. ${fieldName}`);
    });
    
    console.log('\n=== FIELD TYPE ANALYSIS ===');
    fields.forEach((field: { getName(): string }, index: number) => {
      const fieldName = field.getName();
      try {
        const textField = form.getTextField(fieldName);
        if (textField) {
          console.log(`${index + 1}. ${fieldName} - TEXT FIELD`);
        }
      } catch (error) {
        try {
          const checkBox = form.getCheckBox(fieldName);
          if (checkBox) {
            console.log(`${index + 1}. ${fieldName} - CHECKBOX`);
          }
        } catch (error) {
          console.log(`${index + 1}. ${fieldName} - UNKNOWN TYPE`);
        }
      }
    });
    
    console.log('\n=== END ANALYSIS ===');
    
    return fields.map((field: { getName(): string }) => ({
      name: field.getName(),
    }));
  } catch (error) {
    console.error('Error analyzing PDF fields:', error);
    return [];
  }
}; 