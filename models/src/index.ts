interface User {
  firstName?: string;
  middleName?: string;
  lastName?: string;
}

export interface Provider extends User {
  providerId?: string;
}

export interface Patient extends User {
  patientId?: string;
  patientStatus?: any;
  dob?: string;
  primaryCity?: string;
  primaryState?: string;
  address?: Address[];
  customData?: CustomPatientField;
}

export interface Address {
  addressId?: string;
  isDefault?: 0 | 1;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface CustomPatientField {
  fieldId?: string;
  label?: string;
  fieldType?: any;
  value?: string | number;
}
