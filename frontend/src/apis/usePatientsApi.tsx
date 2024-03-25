import { useState } from 'react';
import { Patient } from '@finni-health/models';

import { PatientFormData } from '../models';

export interface PatientsApiHookReturnProps {
  data: {
    isPatientsLoading: boolean;
    isPatientsSaving: boolean;
    patients: Patient[] | null;
  };
  action: {
    getPatientsByProvider: () => Promise<void>;
    getPatientDetails: (patientId: string) => Promise<void>;
    savePatient: (patientInfo: PatientFormData) => Promise<void>;
  };
}

function usePatientsApi(): PatientsApiHookReturnProps {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isPatientsLoading, setIsPatientsLoading] = useState<boolean>(false);
  const [isPatientsSaving, setIsPatientsSaving] = useState<boolean>(false);

  const getPatientsByProvider = async () => {
    try {
      setIsPatientsLoading(true);

      const res = await fetch('http://127.0.0.1:3000/api/patients');
      const data = await res.json();

      if (res.ok) setPatients(data);

      setIsPatientsLoading(false);
    } catch (err) {
      setIsPatientsLoading(false);
      console.error(
        'Something happened while fetching all of the patient data...',
        err
      );
    }
  };

  const getPatientDetails = async (patientId: string) => {
    try {
      setIsPatientsLoading(true);

      const res = await fetch(
        `http://127.0.0.1:3000/api/patients/${patientId}`
      );
      const data = await res.json();

      if (res.ok) setPatients([...patients, data]);

      setIsPatientsLoading(false);
    } catch (err) {
      setIsPatientsLoading(false);
      console.error(
        "Something happened while fetching the patient's data...",
        err
      );
    }
  };

  const savePatient = async (patientInfo: PatientFormData) => {
    try {
      setIsPatientsSaving(true);

      const res = await fetch(`http://127.0.0.1:3000/api/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ ...patientInfo }),
      });
      const data = await res.json();

      if (res.ok) setPatients([...patients, data]);

      setIsPatientsSaving(false);
    } catch (err) {
      setIsPatientsSaving(false);
      console.error(
        "Something happened while saving the patient's data...",
        err
      );
    }
  };

  return {
    data: {
      isPatientsLoading,
      isPatientsSaving,
      patients,
    },
    action: {
      getPatientsByProvider,
      getPatientDetails,
      savePatient,
    },
  };
}

export default usePatientsApi;
