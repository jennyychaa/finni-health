import { Request, Response } from 'express';
import { QueryError, PoolConnection } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import { PROVIDER_ID, CustomPatientField } from '@finni-health/models';

import { connection } from '../config/db';

const queryCustomPatientFields = `
  SELECT
    id AS fieldId,
    label,
    field_type AS fieldType
  FROM custom_patient_fields
  WHERE providers.id="${PROVIDER_ID}" AND active=1;
`;

const queryCustomPatientFieldsData = (patientId: string) => `
  SELECT
  fieldId,
  label,
  field_type AS fieldType,
  value
  FROM custom_patient_fields_data
  WHERE patient_id=${patientId} AND form_field.id IN (
  SELECT
    id AS fieldId
  FROM custom_patient_fields_data
  WHERE provider_id="${PROVIDER_ID}" AND active=1
  );
`;

const addCustomPatientFields = (req: Request, res: Response) => {
  const customFields = req.body;

  if (customFields && customFields > 0) {
    connection.getConnection((_, conn: PoolConnection) => {
      for (let i = 0; i < customFields.length; i++) {
        const { label, fieldType } = customFields[i];
        const fieldId = uuidv4();

        conn.query(
          `
          INSERT INTO custom_patient_fields (
            id,
            is_active,
            label,
            field_type,
            provider_id
          ) VALUES (
            ${fieldId},
            1,
            ${label},
            ${fieldType},
            ${PROVIDER_ID}
          );
          ${queryCustomPatientFields}
          `,
          (err: QueryError, result: CustomPatientField[]) => {
            conn.release();

            if (err) {
              res.status(500).send({
                message: 'There was an error adding custom patient fields...',
                err,
              });
            } else {
              res.status(200).send(result);
            }
          }
        );
      }
    });
  }
};

const getCustomPatientFields = (_: Request, res: Response) => {
  connection.getConnection((_, conn: PoolConnection) => {
    conn.query(
      queryCustomPatientFields,
      (err: QueryError, result: CustomPatientField[]) => {
        conn.release();

        if (err) {
          res.status(500).send({
            message:
              'There was an error fetching all of the custom patient fields...',
            err,
          });
        } else {
          res.status(200).send(result);
        }
      }
    );
  });
};

const getCustomPatientData = (req: Request, res: Response) => {
  const patientId = req.params.patientId;

  connection.getConnection((_, conn: PoolConnection) => {
    conn.query(
      queryCustomPatientFieldsData(patientId),
      (err: QueryError, result: CustomPatientField[]) => {
        conn.release();
        if (err) {
          res.status(500).send({
            message:
              'There was an error fetching all the data for custom patient fields...',
            err,
          });
        } else {
          res.status(200).send(result);
        }
      }
    );
  });
};

const saveCustomPatientData = (req: Request, res: Response) => {
  const patientId = req.params.patientId;
  const customFields = req.body;

  const dataId = uuidv4();
  const dataHistoryId = uuidv4();

  if (customFields && customFields.length > 0) {
    connection.getConnection((_, conn: PoolConnection) => {
      for (let i = 0; i < customFields.length; i++) {
        const { fieldId, value } = customFields[i];

        conn.query(
          `
          INSERT INTO custom_patient_fields_data_history (
            id,
            value,
            form_field_id,
            patient_id,
            created_at
          ) VALUES (
            ${dataHistoryId},
            ${value},
            ${fieldId},
            ${patientId},
            CURRENT_TIMESTAMP;
          INSERT INTO custom_patient_fields_data (
            id,
            value,
            form_field_id,
            patient_id,
            created_at
          ) VALUES (
            ${dataId},
            ${value},
            ${fieldId},
            ${patientId},
            CURRENT_TIMESTAMP
          ) ON DUPLICATE KEY UPDATE value="${value}", created_at=CURRENT_TIMESTAMP;
          ${queryCustomPatientFieldsData(patientId)};
          `,
          (err: QueryError, result: CustomPatientField[]) => {
            conn.release();
            if (err) {
              res.status(500).send({
                message:
                  'There was an error fetching all the data for custom patient fields...',
                err,
              });
            } else {
              res.status(200).send(result);
            }
          }
        );
      }
    });
  }
};

const updateCustomPatientFields = (req: Request, res: Response) => {
  const customFields = req.body;

  connection.getConnection((_, conn: PoolConnection) => {
    if (customFields && customFields > 0) {
      for (let i = 0; i < customFields.length; i++) {
        const { fieldId, label } = customFields[i];

        conn.query(
          `
          UPDATE custom_patient_fields SET label=${label} WHERE id="${fieldId}";
          ${queryCustomPatientFields}
          `,
          (err: QueryError, result: CustomPatientField[]) => {
            conn.release();

            if (err) {
              res.status(500).send({
                message: 'There was an error updating custom patient fields...',
                err,
              });
            } else {
              res.status(200).send(result);
            }
          }
        );
      }
    }
  });
};

export default {
  addCustomPatientFields,
  updateCustomPatientFields,
  getCustomPatientFields,
  getCustomPatientData,
  saveCustomPatientData,
};
