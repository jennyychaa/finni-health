import { QueryError, PoolConnection } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import { Address, Patient } from '@finni-health/models';

import { PROVIDER_ID } from '../constants';
import { connection } from '../config/db';

enum PatientStatus {
  Active = 'ACTIVE',
  Churned = 'CHURNED',
  Inactive = 'INACTIVE',
  Inquiry = 'INQUIRY',
  Onboarding = 'ONBOARDING',
}

interface PatientDataResults {
  patient: Patient;
  address: Address[];
}

const queryInsertPatientData = ({
  firstName,
  middleName,
  lastName,
  dob,
  patientStatus,
  address,
}: Omit<Patient, 'customData'>): Promise<PatientDataResults> => {
  const userId = uuidv4();
  const patientId = uuidv4();
  const addressId = uuidv4();

  return new Promise((resolve, reject) => {
    connection.getConnection((_, conn: PoolConnection) => {
      conn.query(
        `
        INSERT INTO users (
          id,
          first_name,
          middle_name,
          last_name,
          type
        ) VALUES (
          ${userId},
          ${firstName},
          ${middleName},
          ${lastName},
          "PATIENT"
        );
        INSERT INTO patients (
          id,
          patient_status,
          dob,
          user_id,
          provider_id
        ) VALUES (
          ${patientId},
          ${patientStatus},
          DATE(${dob}),
          ${userId},
          ${PROVIDER_ID}
        );
        INSERT INTO address (
          id,
          is_default,
          address1,
          address2,
          city,
          state,
          zip5,
          patient_id
        ) VALUES (
          ${addressId},
          ${address?.[0].isDefault},
          ${address?.[0].address1},
          ${address?.[0].address2},
          ${address?.[0].city},
          ${address?.[0].state},
          ${address?.[0].zip},
          ${patientId},
        )
      `,
        (err: QueryError) => {
          conn.release();

          if (err) return reject(err);
        }
      );

      conn.query(
        `
        SELECT
          id AS patientId,
          first_name AS firstName,
          middle_name AS middleName,
          last_name AS lastName,
          patient_status AS patientStatus,
          dob
        FROM patients
        INNER JOIN users ON users.id = patients.user_id
        WHERE patients.id="${patientId}";
        SELECT
          id AS addressId,
          is_default AS isDefault,
          address1,
          address2,
          city,
          state,
          zip5
        FROM address
        WHERE patient_id="${patientId}"
      `,
        (err: QueryError, [patient, address]: [Patient[], Address[]]) => {
          conn.release();

          if (err) return reject(err);
          return resolve({
            patient: patient[0],
            address: address,
          });
        }
      );
    });
  });
};

const querySelectPatientData = (
  patientId: string
): Promise<PatientDataResults> => {
  return new Promise((resolve, reject) => {
    connection.getConnection((_, conn: PoolConnection) => {
      conn.query(
        `
        SELECT
          first_name AS firstName,
          middle_name AS middleName,
          last_name AS lastName,
          patient_status AS patientStatus,
          dob
        FROM patients
        INNER JOIN users ON users.id = patients.user_id
        WHERE patients.id="${patientId}";
        SELECT
          id AS addressId,
          is_default AS isDefault,
          address1,
          address2,
          city,
          state,
          zip5
        FROM address
        WHERE patient_id="${patientId}"
        `,
        (err: QueryError, [patient, address]: [Patient[], Address[]]) => {
          conn.release();

          if (err) return reject(err);
          return resolve({
            patient: patient[0],
            address,
          });
        }
      );
    });
  });
};

const queryUpdatePatientData = (
  patientId: string,
  patientStatus?: PatientStatus,
  address?: Address[]
): Promise<PatientDataResults> => {
  return new Promise((resolve, reject) => {
    connection.getConnection((_, conn: PoolConnection) => {
      if (patientStatus) {
        conn.query(
          `
          UPDATE patients
          SET patient_status="${patientStatus}"
          WHERE id="${patientId}"
          `,
          (err: QueryError) => {
            conn.release();

            if (err) return reject(err);
          }
        );
      }

      if (address && address.length > 0) {
        for (let i = 0; i < address.length; i++) {
          const { addressId, address1, address2, city, state, zip } =
            address[i];

          conn.query(
            `
          UPDATE address
          SET
            address1="${address1}",
            address2="${address2}",
            city="${city}",
            state="${state}",
            zip5="${zip}",
          WHERE id="${addressId}"
          `,
            (err: QueryError) => {
              conn.release();

              if (err) return reject(err);
            }
          );
        }
      }

      conn.query(
        `
        SELECT
          id AS patientId,
          first_name AS firstName,
          middle_name AS middleName,
          last_name AS lastName,
          patient_status AS patientStatus,
          dob
        FROM patients
        INNER JOIN users ON users.id = patients.user_id
        WHERE patients.id="${patientId}";
        SELECT
          id AS addressId,
          is_default AS isDefault,
          address1,
          address2,
          city,
          state,
          zip5
        FROM address
        WHERE patient_id="${patientId}"
        `,
        (err: QueryError, [patient, address]: [Patient[], Address[]]) => {
          conn.release();

          if (err) return reject(err);
          return resolve({
            patient: patient[0],
            address,
          });
        }
      );
    });
  });
};

const querySelectPatientsByProvider = (): Promise<Patient[]> => {
  return new Promise((resolve, reject) => {
    connection.getConnection((_, conn: PoolConnection) => {
      conn.query(
        `
        SELECT
          patients.id AS patientId,
          first_name AS firstName,
          last_name AS lastName,
          patient_status AS patientStatus,
          dob,
          city as primaryCity,
          state as primaryState
        FROM patients
        INNER JOIN providers ON providers.id = patients.provider_id
        INNER JOIN users ON users.id = patients.user_id
        INNER JOIN address ON address.patient_id = patients.id
        WHERE patients.provider_id="${PROVIDER_ID}" AND address.is_default=1
        LIMIT 50 OFFSET 0
        `,
        (err: QueryError, result: Patient[]) => {
          conn.release();

          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
  });
};

export default {
  queryInsertPatientData,
  querySelectPatientData,
  queryUpdatePatientData,
  querySelectPatientsByProvider,
};
