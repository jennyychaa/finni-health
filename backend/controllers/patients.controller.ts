import { Request, Response } from 'express';
import { QueryError, PoolConnection } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import { Address, Patient, PROVIDER_ID } from '@finni-health/models';

import { connection } from '../config/db';

const queryPatientData = (patientId: string) => `
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
`;

const addPatient = (req: Request, res: Response) => {
  const { firstName, middleName, lastName, dob, patientStatus, address } =
    req.body;

  const userId = uuidv4();
  const patientId = uuidv4();
  const addressId = uuidv4();

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
        DATEFROMPARTS(${dob.year}, ${dob.month}, ${dob.day}),
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
        ${address.isDefault},
        ${address.address1},
        ${address.address2},
        ${address.city},
        ${address.state},
        ${address.zip5},
        ${patientId},
      );
      ${queryPatientData(patientId)}
      `,
      (err: QueryError, [patient, address]: [Patient[], Address[]]) => {
        conn.release();
        if (err) {
          res.status(500).send({
            message: 'There was an error adding the patient data...',
            err,
          });
        } else {
          res.status(200).send({
            patientId,
            ...patient[0],
            address,
          });
        }
      }
    );
  });
};

const editPatientDetails = (req: Request, res: Response) => {
  const patientId = req.params.patientId;
  const { patientStatus, address } = req.body;

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

          if (err) {
            res.status(500).send({
              message: "There was an error updating the patient's status...",
              err,
            });
          }
        }
      );
    }

    if (address && address.length > 0) {
      for (let i = 0; i < address.length; i++) {
        const {
          addressId,
          address1,
          address2,
          city,
          state,
          zip5,
          addressType,
        } = address[i];

        conn.query(
          `
        UPDATE address
        SET
          address1="${address1}",
          address2="${address2}",
          city="${city}",
          state="${state}",
          zip5="${zip5}",
          type="${addressType}"
        WHERE id="${addressId}"
        `,
          (err: QueryError) => {
            conn.release();

            if (err) {
              res.status(500).send({
                message: "There was an error updating patient's address...",
                err,
              });
            }
          }
        );
      }
    }

    conn.query(
      queryPatientData(patientId),
      (err: QueryError, [patient, address]: [Patient[], Address[]]) => {
        conn.release();

        if (err) {
          res.status(500).send({
            message: 'There was an error fetching the patient data...',
            err,
          });
        } else {
          res.status(200).send({
            patientId,
            ...patient[0],
            address,
          });
        }
      }
    );
  });
};

const getPatientsByProvider = (_: Request, res: Response) => {
  connection.getConnection((_, conn: PoolConnection) => {
    conn.query(
      `
      SELECT
        patients.id AS patientId,
        first_name AS firstName,
        last_name AS lastName,
        patient_status AS status,
        dob,
        city as primaryCity,
        state as primaryState
      FROM providers
      INNER JOIN patients ON patients.provider_id = providers.id
      INNER JOIN users ON patients.user_id = users.id
      INNER JOIN address ON address.patient_id = patients.id
      WHERE providers.id="${PROVIDER_ID}" AND address.is_primary=1
      LIMIT 50 OFFSET 0;
      `,
      (err: QueryError, result: Patient[]) => {
        conn.release();

        if (err) {
          res.status(500).send({
            message: 'There was an error fetching all the patient data...',
            err,
          });
        } else {
          res.status(200).send(result);
        }
      }
    );
  });
};

const getPatientDetails = (req: Request, res: Response) => {
  const patientId = req.params.patientId;

  connection.getConnection((_, conn: PoolConnection) => {
    conn.query(
      queryPatientData(patientId),
      (err: QueryError, [patient, address]: [Patient[], Address[]]) => {
        conn.release();

        if (err) {
          res.status(500).send({
            message: 'There was an error fetching the patient data...',
            err,
          });
        } else {
          res.status(200).send({
            patientId,
            ...patient[0],
            address,
          });
        }
      }
    );
  });
};

export default {
  addPatient,
  editPatientDetails,
  getPatientDetails,
  getPatientsByProvider,
};
