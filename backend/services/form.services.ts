import { QueryError, PoolConnection } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import { CustomPatientField } from '@finni-health/models';

import { PROVIDER_ID } from '../constants';
import { connection } from '../config/db';

const queryInsertCustomPatientFields = (
  customPatientFields: CustomPatientField[]
): Promise<CustomPatientField[]> => {
  return new Promise((resolve, reject) => {
    connection.getConnection((_, conn: PoolConnection) => {
      for (let i = 0; i < customPatientFields.length; i++) {
        const fieldId = uuidv4();
        const { label, fieldType } = customPatientFields[i];

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
        `,
          (err: QueryError) => {
            conn.release();

            if (err) return reject(err);
            return resolve([]);
          }
        );
      }
      conn.query(
        `
        SELECT
          id AS fieldId,
          label,
          field_type AS fieldType
        FROM custom_patient_fields
        WHERE provider_id="${PROVIDER_ID}" AND is_active=1;
        `,
        (err: QueryError, result: CustomPatientField[]) => {
          conn.release();

          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
  });
};

const querySelectCustomPatientFields = (): Promise<CustomPatientField[]> => {
  return new Promise((resolve, reject) => {
    connection.getConnection((_, conn: PoolConnection) => {
      conn.query(
        `
        SELECT
          id AS fieldId,
          label,
          field_type AS fieldType
        FROM custom_patient_fields
        WHERE providers.id="${PROVIDER_ID}" AND active=1;
        `,
        (err: QueryError, result: CustomPatientField[]) => {
          conn.release();

          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
  });
};

const queryUpdateCustomPatientFields = (
  customPatientFields: CustomPatientField[]
): Promise<CustomPatientField[]> => {
  return new Promise((resolve, reject) => {
    connection.getConnection((_, conn: PoolConnection) => {
      for (let i = 0; i < customPatientFields.length; i++) {
        const { fieldId, label } = customPatientFields[i];

        conn.query(
          `UPDATE custom_patient_fields SET label=${label} WHERE id="${fieldId}"`,
          (err: QueryError) => {
            conn.release();

            if (err) return reject(err);
          }
        );

        conn.query(
          `
          SELECT
            id AS fieldId,
            label,
            field_type AS fieldType
          FROM custom_patient_fields
          WHERE providers.id="${PROVIDER_ID}" AND active=1;
          `,
          (err: QueryError, result: CustomPatientField[]) => {
            conn.release();

            if (err) return reject(err);
            return resolve(result);
          }
        );
      }
      conn.query(
        `
        SELECT
          id AS fieldId,
          label,
          field_type AS fieldType
        FROM custom_patient_fields
        WHERE providers.id="${PROVIDER_ID}" AND active=1;
      `,
        (err: QueryError, result: CustomPatientField[]) => {
          conn.release();

          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
  });
};

const queryInsertCustomPatientFieldsData = (
  patientId: string,
  customPatientFields: CustomPatientField[]
): Promise<CustomPatientField[]> => {
  return new Promise((resolve, reject) => {
    connection.getConnection((_, conn: PoolConnection) => {
      for (let i = 0; i < customPatientFields.length; i++) {
        const dataId = uuidv4();
        const dataHistoryId = uuidv4();
        const { fieldId, value } = customPatientFields[i];

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
          `,
          (err: QueryError) => {
            conn.release();

            if (err) return reject(err);
          }
        );
      }
      conn.query(
        `
        SELECT
          fieldId,
          label,
          field_type AS fieldType,
          value
          FROM custom_patient_fields_data
        WHERE patient_id=${patientId} AND form_field.id IN (
        SELECT
          id AS fieldId
        FROM custom_patient_fields
        WHERE provider_id="${PROVIDER_ID}" AND active=1
        );
        `,
        (err: QueryError, result: CustomPatientField[]) => {
          conn.release();

          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
  });
};

const querySelectCustomPatientFieldsData = (
  patientId: string
): Promise<CustomPatientField[]> => {
  return new Promise((resolve, reject) => {
    connection.getConnection((_, conn: PoolConnection) => {
      conn.query(
        `
        SELECT
          fieldId,
          label,
          field_type AS fieldType,
          value
          FROM custom_patient_fields_data
        WHERE patient_id=${patientId} AND form_field.id IN (
        SELECT
          id AS fieldId
        FROM custom_patient_fields
        WHERE provider_id="${PROVIDER_ID}" AND active=1
        );
        `,
        (err: QueryError, result: CustomPatientField[]) => {
          conn.release();

          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
  });
};

export default {
  queryInsertCustomPatientFields,
  querySelectCustomPatientFields,
  queryUpdateCustomPatientFields,
  queryInsertCustomPatientFieldsData,
  querySelectCustomPatientFieldsData,
};
