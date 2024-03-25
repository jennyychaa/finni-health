import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { PatientFormData } from '../models';
import { getFormattedPatientDob, getPatientAge } from '../utils/patient';
import usePatientsApi from '../apis/usePatientsApi';
import Loader from '../components/Loader';
import PatientInfoFields from '../components/PatientInfoFields';
import Layout from '../templates/Layout';

function EditPatient() {
  const { patientId } = useParams();
  const {
    data: { isPatientsLoading, patients },
    action: { getPatientDetails },
  } = usePatientsApi();

  const currPatient = patients?.[0];
  const dob = currPatient?.dob ?? '';
  const fullName = `${currPatient?.firstName} ${currPatient?.middleName} ${currPatient?.lastName}`;

  const [patientInfo, setPatientInfo] = useState<PatientFormData>({
    firstName: currPatient?.firstName ?? '',
    middleName: currPatient?.middleName ?? '',
    lastName: currPatient?.lastName ?? '',
    patientStatus: currPatient?.patientStatus,
    dob: currPatient?.patientStatus ?? '',
  });

  const updatePatient = (patient: PatientFormData) => {
    setPatientInfo(patient);
  };

  useEffect(() => {
    if (patientId) {
      getPatientDetails(patientId);
    }
  }, []);

  return (
    <Layout>
      {isPatientsLoading ? (
        <Loader />
      ) : (
        <>
          <div className='px-4 sm:px-0'>
            <h1 className='text-xl font-semibold leading-7 text-gray-900'>
              {`${fullName}`}
            </h1>
            <p className='mt-1 max-w-2xl text-md leading-6 text-gray-500'>
              {`${getPatientAge(dob)} years old • ${getFormattedPatientDob(
                dob
              )}`}
            </p>
          </div>
          <form>
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
        </>
      )}
    </Layout>
  );
}

export default EditPatient;
