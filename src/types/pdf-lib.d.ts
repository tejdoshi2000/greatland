declare module 'pdf-lib' {
  export class PDFDocument {
    static load(bytes: ArrayBuffer): Promise<PDFDocument>;
    getForm(): PDFForm;
    save(): Promise<Uint8Array>;
  }

  export class PDFForm {
    getTextField(name: string): PDFTextField;
    getCheckBox(name: string): PDFCheckBox;
  }

  export class PDFTextField {
    setText(text: string): void;
  }

  export class PDFCheckBox {
    check(checked: boolean): void;
  }
} 