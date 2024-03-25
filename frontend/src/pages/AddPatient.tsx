import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { PatientFormData } from '../models';
import usePatientsApi from '../apis/usePatientsApi';
import PatientInfoFields from '../components/PatientInfoFields';
import Layout from '../templates/Layout';

function AddPatient() {
  const {
    action: { savePatient },
  } = usePatientsApi();

  const [patientInfo, setPatientInfo] = useState<PatientFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    patientStatus: '',
    dob: '',
  });

  const updatePatient = (patient: PatientFormData) => {
    setPatientInfo(patient);
  };

  const createNewPatient = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    savePatient(patientInfo);
  };

  return (
    <Layout>
      <div className='border-b border-gray-900/10 pb-8'>
        <h1 className='text-xl font-semibold leading-7 text-gray-900'>
          Add New Patient
        </h1>
      </div>
      <form onSubmit={createNewPatient}>
        <PatientInfoFields
          patient={patientInfo}
          updatePatient={updatePatient}
        />
        <div className='mt-12 flex items-center gap-x-6'>
          <button
            className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            type='submit'>
            Save
          </button>
          <Link
            className='text-sm font-semibold leading-6 text-gray-900'
            to='/'>
            Cancel
          </Link>
        </div>
      </form>
    </Layout>
  );
}

export default AddPatient;
