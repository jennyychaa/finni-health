export enum PatientStatus {
  Active = 'ACTIVE',
  Churned = 'CHURNED',
  Inactive = 'INACTIVE',
  Inquiry = 'INQUIRY',
  Onboarding = 'ONBOARDING',
}

export enum FieldType {
  Number = 'number',
  Text = 'text',
  TextArea = 'textarea',
}

interface User {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
}

export type Provider = User;

export interface Patient extends User {
  age?: number;
  dob: string;
  patientStatus?: PatientStatus;
  address?: Address[];
  primaryCity: string;
  primaryState: string;
  customData?: CustomPatientField;
}

export interface Address {
  id: string;
  isDefault?: 0 | 1;
  address1?: string;
  address2?: string;
  city: string;
  state: string;
  zip?: string;
}

export interface CustomPatientField {
  fieldId: string;
  label: string;
  fieldType: FieldType;
  value?: string | number;
}
