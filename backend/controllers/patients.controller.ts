import { Request, Response } from 'express';
import { QueryError, PoolConnection } from 'mysql2';
import { Address, Patient } from '@finni-health/models';

import { connection } from '../config/db';
import patientsServices from '../services/patients.services';

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
  const patientData = req.body;

  patientsServices
    .queryInsertPatientData(patientData)
    .then(({ patientId, patient, address }) => {
      res.status(200).send({
        patientId,
        ...patient,
        address,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'There was an error adding the patient data...',
        err,
      });
    });
};

const editPatientDetails = (req: Request, res: Response) => {
  const patientId = req.params.patientId;
  const { patientStatus, address } = req.body;

  patientsServices
    .queryUpdatePatientData(patientId, patientStatus, address)
    .then(({ patientId, patient, address }) => {
      res.status(200).send({
        patientId,
        ...patient,
        address,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "There was an error updating the patient's data...",
        err,
      });
    });
};

const getPatientDetails = (req: Request, res: Response) => {
  const patientId = req.params.patientId;

  patientsServices
    .querySelectPatientData(patientId)
    .then(({ patientId, patient, address }) => {
      res.status(200).send({
        patientId,
        ...patient,
        address,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'There was an error fetching the patient data...',
        err,
      });
    });
};

const getPatientsByProvider = (_: Request, res: Response) => {
  patientsServices
    .querySelectPatientsByProvider()
    .then((patients) => {
      res.status(200).send(patients);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          'There was an error fetching all the patient data by this provider...',
        err,
      });
    });
};

export default {
  addPatient,
  editPatientDetails,
  getPatientDetails,
  getPatientsByProvider,
};
