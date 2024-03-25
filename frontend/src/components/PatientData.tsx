import _ from 'lodash';
import { ChangeEvent, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Patient } from '@finni-health/models';

import { getPatientAge } from '../utils/patient';
import { PatientStatus } from '../models';
import PatientDataTable from './PatientDataTable';

interface AgeFilter {
  min: number | string;
  max: number | string;
}

interface SearchCriterias {
  name?: string;
  status?: PatientStatus | string;
  ageRange?: AgeFilter;
  city?: string;
}

const PatientData = ({ patients }: { patients: Patient[] }) => {
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(patients);
  const [nameSearch, setNameSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<PatientStatus | string>('');
  const [ageFilter, setAgeFilter] = useState<AgeFilter>({
    min: '',
    max: '',
  });
  const [citySearch, setCitySearch] = useState<string>('');

  const getPatientsByCriteria = _.throttle(
    ({
      name = nameSearch,
      status = statusFilter,
      ageRange = ageFilter,
      city = citySearch,
    }: SearchCriterias) => {
      let patientResults = patients;

      if (name && name.length > 0) {
        const [firstVal, secondVal] = name.split(' ');

        if (secondVal) {
          patientResults = patientResults.filter(
            (patient) =>
              patient.firstName
                ?.toLowerCase()
                .includes(firstVal.toLowerCase()) &&
              patient.lastName?.toLowerCase().includes(secondVal.toLowerCase())
          );
        } else {
          patientResults = patientResults.filter(
            (patient) =>
              patient.firstName
                ?.toLowerCase()
                .includes(firstVal.toLowerCase()) ||
              patient.lastName?.toLowerCase().includes(firstVal.toLowerCase())
          );
        }
      }

      if (status && status.length > 0) {
        patientResults = patientResults.filter(
          (patient) => patient.patientStatus === status
        );
      }

      if (
        ageRange &&
        (typeof ageRange.min === 'number' || typeof ageRange.max === 'number')
      ) {
        const minAgeCriteria =
          ageRange.min === '' ? 0 : (ageRange.min as number);
        const maxAgeCriteria =
          ageRange.max === '' ? 120 : (ageRange.max as number);

        patientResults = patientResults.filter((patient) => {
          const patientAge = getPatientAge(patient?.dob ?? '');

          return patientAge >= minAgeCriteria && patientAge <= maxAgeCriteria;
        });
      }

      if (city && city.length > 0) {
        patientResults = patientResults.filter((patient) =>
          patient.primaryCity?.toLowerCase().includes(city.toLowerCase())
        );
      }

      return patientResults;
    },
    500
  );

  const searchByName = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setNameSearch(name);

    const results = getPatientsByCriteria({ name });
    setFilteredPatients(results ?? []);
  };

  const filterByStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;

    if (status === '') setStatusFilter('');
    else setStatusFilter(status as PatientStatus);

    const results = getPatientsByCriteria({
      status: status as PatientStatus,
    });
    setFilteredPatients(results ?? []);
  };

  const filterByMinAge = (e: ChangeEvent<HTMLInputElement>) => {
    const minAge = e.target.value;
    const updatedAgeFilter = {
      ...ageFilter,
      min: minAge === '' ? '' : Number(minAge),
    };
    setAgeFilter(updatedAgeFilter);

    const results = getPatientsByCriteria({ ageRange: updatedAgeFilter });
    setFilteredPatients(results ?? []);
  };

  const filterByMaxAge = (e: ChangeEvent<HTMLInputElement>) => {
    const maxAge = e.target.value;
    const updatedAgeFilter = {
      ...ageFilter,
      max: maxAge === '' ? '' : Number(maxAge),
    };
    setAgeFilter(updatedAgeFilter);

    const results = getPatientsByCriteria({ ageRange: updatedAgeFilter });
    setFilteredPatients(results ?? []);
  };

  const searchByCity = (e: ChangeEvent<HTMLInputElement>) => {
    const city = e.target.value;
    setCitySearch(city);

    const results = getPatientsByCriteria({ city });
    setFilteredPatients(results ?? []);
  };

  return (
    <>
      <div className='grid grid-cols-1 gap-x-3 gap-y-3 sm:grid-cols-6 mb-8'>
        <div className='sm:col-span-2'>
          <div className='flex items-center rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md'>
            <MagnifyingGlassIcon
              className='h-4 w-8 pl-2 text-gray-400'
              aria-hidden='true'
            />
            <input
              aria-label='Search by name'
              className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
              type='text'
              name='searchByName'
              id='searchByName'
              placeholder='Jane Smith'
              value={nameSearch}
              onChange={searchByName}
            />
          </div>
        </div>
        <div className='sm:col-span-1'>
          <select
            aria-label='Filter by status'
            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6'
            id='patientStatus'
            name='patientStatus'
            onChange={filterByStatus}>
            <option value=''>All Status</option>
            <option value={PatientStatus.Inquiry}>Inquiry</option>
            <option value={PatientStatus.Onboarding}>Onboarding</option>
            <option value={PatientStatus.Churned}>Churned</option>
            <option value={PatientStatus.Active}>Active</option>
            <option value={PatientStatus.Inactive}>Inactive</option>
          </select>
        </div>
        <div className='sm:col-span-1'>
          <input
            aria-label='Filter by age (min)'
            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            id='ageMin'
            name='ageMin'
            type='number'
            min='0'
            placeholder='Age (Min)'
            value={ageFilter.min}
            onChange={filterByMinAge}
          />
        </div>
        <div className='sm:col-span-1'>
          <input
            aria-label='Filter by age (max)'
            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            id='ageMax'
            name='ageMax'
            type='number'
            max='100'
            placeholder='Age (Max)'
            value={ageFilter.max}
            onChange={filterByMaxAge}
          />
        </div>
        <div className='sm:col-span-1'>
          <input
            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            id='city'
            name='city'
            type='text'
            placeholder='City'
            value={citySearch}
            onChange={searchByCity}
          />
        </div>
      </div>
      <PatientDataTable patients={filteredPatients} />
    </>
  );
};

export default PatientData;
