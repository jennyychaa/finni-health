import _ from 'lodash';
import React, { ChangeEvent, useState } from 'react';
import { CustomPatientField } from '@finni-health/models';

import { FieldType } from '../models';

interface NewCustomFormFieldProps {
  id: string;
  updateFormField: (id: string, field: CustomPatientField) => void;
}

const NewCustomFormField = ({
  id,
  updateFormField,
}: NewCustomFormFieldProps) => {
  const [labelInput, setLabelInput] = useState<string>('');
  const [typeInput, setTypeInput] = useState<FieldType>(FieldType.Text);

  const updateCustomFormField = _.throttle(
    ({
      label = labelInput,
      fieldType = typeInput,
    }: Pick<CustomPatientField, 'label' | 'fieldType'>) => {
      updateFormField(id, { label, fieldType });
    },
    500
  );

  const onChangeLabel = (e: ChangeEvent<HTMLInputElement>) => {
    setLabelInput(e.target.value);
    updateCustomFormField({ label: e.target.value });
  };

  const onChangeType = (e: ChangeEvent<HTMLSelectElement>) => {
    setTypeInput(e.target.value as FieldType);
    updateCustomFormField({ fieldType: e.target.value as FieldType });
  };

  return (
    <div className='border-b border-gray-900/10 pb-12'>
      <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
        <div className='col-span-full'>
          <label
            htmlFor='label'
            className='block text-sm font-medium leading-6 text-gray-900'>
            Custom Field Label <sup>*</sup>
          </label>
          <div className='mt-2'>
            <input
              className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              type='text'
              name='label'
              id='label'
              required
              value={labelInput}
              onChange={onChangeLabel}
            />
          </div>
        </div>
        <div className='sm:col-span-2'>
          <label
            htmlFor='fieldType'
            className='block text-sm font-medium leading-6 text-gray-900'>
            Custom Field Type
          </label>
          <div className='mt-2'>
            <select
              className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6'
              id='fieldType'
              name='fieldType'
              onChange={onChangeType}>
              <option value={FieldType.Text}>Text</option>
              <option value={FieldType.TextArea}>Textarea</option>
              <option value={FieldType.Number}>Number</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCustomFormField;
