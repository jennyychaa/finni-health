import { Request, Response } from 'express';

import patientsServices from '../services/patients.services';

const addPatient = (req: Request, res: Response) => {
  const patientData = req.body;

  patientsServices
    .queryInsertPatientData(patientData)
    .then(({ patient, address }) => {
      res.status(200).send({
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
    .then(({ patient, address }) => {
      res.status(200).send({
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
    .then(({ patient, address }) => {
      res.status(200).send({
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
