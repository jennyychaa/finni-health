import { Address, CustomPatientField, Patient } from '@finni-health/models';

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

export type PatientFormData = Omit<
  Patient,
  'patientId' | 'address' | 'primaryCity' | 'primaryState' | 'customData'
>;

export interface PatientForm {
  editMode?: boolean;
  address?: Address[];
  patient?: Patient;
  onSubmit?: () => void;
}

export interface CustomPatientFields {
  [key: string]: CustomPatientField;
}
