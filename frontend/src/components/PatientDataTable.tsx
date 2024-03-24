import { Link } from 'react-router-dom';
import { Cog8ToothIcon } from '@heroicons/react/20/solid';
import { Patient } from '@finni-health/models';

import { getPatientAge } from '../utils/patient';

interface PatientDataTableProps {
  patients: Patient[];
}

const PatientDataTable = ({ patients }: PatientDataTableProps) => {
  return (
    <table className='table-auto w-full'>
      <thead>
        <tr>
          <th className='border-b p-4 text-left hidden md:block'>No</th>
          <th className='border-b p-4 text-left'>Patient Name</th>
          <th className='border-b p-4 text-left'>Status</th>
          <th className='border-b p-4 text-left'>Age</th>
          <th className='border-b p-4 text-left'>Location</th>
          <th className='border-b p-4 text-left' aria-label='Operations'>
            <Cog8ToothIcon
              className='-ml-0.5 mr-1.5 h-5 w-5'
              aria-hidden='true'
            />
          </th>
        </tr>
      </thead>
      <tbody>
        {patients.map(
          (
            {
              patientId,
              firstName,
              lastName,
              dob,
              patientStatus,
              primaryCity,
              primaryState,
            },
            key
          ) => (
            <tr key={patientId}>
              <td className='border-b p-4 text-sm hidden md:block'>
                {key + 1}
              </td>
              <td className='border-b p-4 text-sm'>{`${firstName} ${lastName}`}</td>
              <td className='border-b p-4 text-sm'>{patientStatus}</td>
              <td className='border-b p-4 text-sm'>
                {getPatientAge(dob ?? '')}
              </td>
              <td className='border-b p-4 text-sm'>{`${primaryCity}, ${primaryState}`}</td>
              <td className='border-b p-4 text-sm'>
                <Link
                  className='font-semibold text-indigo-600 hover:underline'
                  to={`/patient/${patientId}`}>
                  View
                </Link>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

export default PatientDataTable;
