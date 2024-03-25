import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PencilIcon, PlusIcon } from '@heroicons/react/20/solid';

import usePatientsApi from '../apis/usePatientsApi';
import useUserApi from '../apis/useUserApi';
import Loader from '../components/Loader';
import Layout from '../templates/Layout';
import WideLayout from '../templates/WideLayout';
import PatientDataTable from '../components/PatientData';

function Dashboard() {
  const {
    data: { isPatientsLoading, patients },
    action: { getPatientsByProvider },
  } = usePatientsApi();
  const {
    data: { isLoadingUser, user },
    action: { getUserInfo },
  } = useUserApi();

  useEffect(() => {
    getUserInfo();
    getPatientsByProvider();
  }, []);

  if (isLoadingUser) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return (
    <WideLayout>
      <div className='lg:flex lg:items-center lg:justify-between mb-16'>
        <div className='flex-1'>
          <h1 className='text-2xl font-bold leading-7 text-gray-900'>
            Patient Dashboard
          </h1>
          <h2 className='mt-2 text-lg text-gray-500'>
            {user?.firstName ? `Welcome ${user?.firstName}!` : 'Hello there!'}
          </h2>
        </div>
        <div className='mt-5 flex gap-2 lg:ml-4 lg:mt-0 sm:mt-4'>
          <Link
            to='/patient/form'
            className='inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'>
            <PencilIcon
              className='-ml-0.5 mr-1.5 h-5 w-5 text-gray-400'
              aria-hidden='true'
            />
            Edit Patient Form
          </Link>
          <Link
            to='/patient/add'
            type='button'
            className='inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
            <PlusIcon className='-ml-0.5 mr-1.5 h-5 w-5' aria-hidden='true' />
            Add Patient
          </Link>
        </div>
      </div>
      {isPatientsLoading ? (
        <Loader />
      ) : patients ? (
        <PatientDataTable patients={patients} />
      ) : (
        <p>There are no patients associated with your pratice yet.</p>
      )}
    </WideLayout>
  );
}

export default Dashboard;
