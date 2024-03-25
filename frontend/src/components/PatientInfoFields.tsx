import { ChangeEvent } from 'react';

import { PatientFormData, PatientStatus } from '../models';

interface PatientInfoFieldsProps {
  editMode?: boolean;
  patient?: PatientFormData;
  updatePatient: (patient: PatientFormData) => void;
}

function PatientInfoFields({
  editMode = false,
  patient,
  updatePatient,
}: PatientInfoFieldsProps) {
  const handleOnChangeFirstName = (e: ChangeEvent<HTMLInputElement>) => {
    updatePatient({
      ...patient,
      firstName: e.target.value,
    });
  };

  const handleOnChangeMiddleName = (e: ChangeEvent<HTMLInputElement>) => {
    updatePatient({
      ...patient,
      middleName: e.target.value,
    });
  };

  const handleOnChangeLastName = (e: ChangeEvent<HTMLInputElement>) => {
    updatePatient({
      ...patient,
      lastName: e.target.value,
    });
  };

  const handleOnChangeDob = (e: ChangeEvent<HTMLInputElement>) => {
    updatePatient({
      ...patient,
      dob: e.target.value,
    });
  };

  const handleOnChangeStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    updatePatient({
      ...patient,
      patientStatus: e.target.value,
    });
  };

  return (
    <div className='border-b border-gray-900/10 pb-12'>
      <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
        {!editMode && (
          <>
            <div className='sm:col-span-2'>
              <label
                className='block text-sm font-medium leading-6 text-gray-900'
                htmlFor='firstName'>
                First Name <sup>*</sup>
              </label>
              <div className='mt-2'>
                <input
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  id='firstName'
                  name='firstName'
                  autoComplete='firstName'
                  type='text'
                  required
                  value={patient?.firstName}
                  onChange={handleOnChangeFirstName}
                />
              </div>
            </div>
            <div className='sm:col-span-2'>
              <label
                htmlFor='middleName'
                className='block text-sm font-medium leading-6 text-gray-900'>
                Middle Name
              </label>
              <div className='mt-2'>
                <input
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  type='text'
                  name='middleName'
                  id='middleName'
                  autoComplete='middleName'
                  value={patient?.middleName}
                  onChange={handleOnChangeMiddleName}
                />
              </div>
            </div>
            <div className='sm:col-span-2'>
              <label
                htmlFor='lastName'
                className='block text-sm font-medium leading-6 text-gray-900'>
                Last Name <sup>*</sup>
              </label>
              <div className='mt-2'>
                <input
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  type='text'
                  name='lastName'
                  id='lastName'
                  autoComplete='lastName'
                  required
                  value={patient?.lastName}
                  onChange={handleOnChangeLastName}
                />
              </div>
            </div>
            <div className='col-span-full'>
              <label
                htmlFor='dob'
                className='block text-sm font-medium leading-6 text-gray-900'>
                Birth Date <sup>*</sup>
              </label>
              <div className='mt-2'>
                <input
                  className='block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  type='date'
                  name='dob'
                  id='dob'
                  required
                  onChange={handleOnChangeDob}
                />
              </div>
            </div>
          </>
        )}
        <div className='col-span-2'>
          <label
            htmlFor='patientStatus'
            className='block text-sm font-medium leading-6 text-gray-900'>
            Status
          </label>
          <div className='mt-2'>
            <select
              className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              id='patientStatus'
              name='patientStatus'
              autoComplete='patientStatus'
              defaultValue={patient?.patientStatus}
              onChange={handleOnChangeStatus}>
              <option value={PatientStatus.Inquiry}>Inquiry</option>
              <option value={PatientStatus.Onboarding}>Onboarding</option>
              <option value={PatientStatus.Churned}>Churned</option>
              <option value={PatientStatus.Active}>Active</option>
              <option value={PatientStatus.Inactive}>Inactive</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientInfoFields;
