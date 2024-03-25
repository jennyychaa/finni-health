import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomPatientField } from '@finni-health/models';
import { PlusIcon } from '@heroicons/react/20/solid';

import { CustomPatientFields } from '../models';
import useFormApi from '../apis/useFormApi';
import NewCustomFormField from '../components/NewCustomFormField';
import Layout from '../templates/Layout';

function EditPatientForm() {
  const {
    data: { isFormSaving },
    action: { saveCustomFields },
  } = useFormApi();

  // const [customFields, setCustomFields] = useState<CustomPatientFields>({});
  const [newCustomFields, setNewCustomFields] = useState<CustomPatientFields>(
    {}
  );

  // const customFieldsArr = Object.values(customFields);
  const newCustomFieldsArr = Object.entries(newCustomFields);

  const addNewFormField = () => {
    setNewCustomFields({
      ...newCustomFields,
      [`${newCustomFieldsArr.length + 1}`]: {},
    });
  };

  const updateNewFormField = (id: string, field: CustomPatientField) => {
    setNewCustomFields((prevNewCustomFields) => ({
      ...prevNewCustomFields,
      [id]: field,
    }));
  };

  const onSavePatientForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newCustomFieldsArr.length > 0) {
      saveCustomFields(newCustomFields);
    }
  };

  return (
    <Layout>
      <div className='lg:flex lg:items-center lg:justify-between border-b border-gray-900/10 pb-8'>
        <div className='flex-1'>
          <h1 className='text-xl font-semibold leading-7 text-gray-900'>
            Edit Patient Form
          </h1>
        </div>
        <div className='mt-5 flex gap-2 lg:ml-4 lg:mt-0 sm:mt-4'>
          <button
            className='inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300 disabled:text-gray-400'
            disabled={newCustomFieldsArr.length >= 5}
            onClick={addNewFormField}>
            <PlusIcon className='-ml-0.5 mr-1.5 h-5 w-5' aria-hidden='true' />
            Add New Field
          </button>
        </div>
      </div>
      <form onSubmit={onSavePatientForm}>
        {newCustomFieldsArr.map(([id], key) => (
          <NewCustomFormField
            key={key}
            id={id}
            updateFormField={updateNewFormField}
          />
        ))}
        {/* @TODO Render Custom Form Fields */}
        <div className='mt-12 flex items-center gap-x-6'>
          <button
            className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300 disabled:text-gray-400'
            type='submit'
            disabled={newCustomFieldsArr.length === 0 || isFormSaving}>
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

export default EditPatientForm;
