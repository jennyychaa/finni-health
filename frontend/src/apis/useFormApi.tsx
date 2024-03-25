import { useState } from 'react';

import { CustomPatientFields } from '../models';

export interface FormApiHookReturnProps {
  data: {
    isFormLoading: boolean;
    isFormSaving: boolean;
    customFields: CustomPatientFields;
  };
  action: {
    getCustomFieldsByProvider: () => Promise<void>;
    // getCustomFieldsByPatient: (patientId: string) => Promise<void>;
    saveCustomFields: (customFields: CustomPatientFields) => Promise<void>;
  };
}

function useFormApi(): FormApiHookReturnProps {
  const [customFields, setCustomFields] = useState<CustomPatientFields>({});
  const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
  const [isFormSaving, setIsFormSaving] = useState<boolean>(false);

  const getCustomFieldsByProvider = async () => {
    try {
      setIsFormLoading(true);

      const res = await fetch('http://127.0.0.1:3000/api/form/provider');
      const data = await res.json();

      if (res.ok) {
        console.log(data);
      }

      setIsFormLoading(false);
    } catch (err) {
      setIsFormLoading(false);
      console.error('Something happened while fetching the user data...', err);
    }
  };

  // const getCustomFieldsByPatient = async (patientId: string) => {};

  const saveCustomFields = async (customFields: CustomPatientFields) => {
    try {
      setIsFormSaving(true);

      const res = await fetch('http://127.0.0.1:3000/api/form/provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(Object.values(customFields)),
      });
      const data = await res.json();

      if (res.ok) {
        console.log(data);
      }

      setIsFormSaving(false);
    } catch (err) {
      setIsFormSaving(false);
      console.error('Something happened while fetching the user data...', err);
    }
  };

  return {
    data: {
      isFormLoading,
      isFormSaving,
      customFields,
    },
    action: {
      getCustomFieldsByProvider,
      // getCustomFieldsByPatient,
      saveCustomFields,
    },
  };
}

export default useFormApi;
