import { Request, Response } from 'express';

import formServices from '../services/form.services';

const addCustomPatientFields = (req: Request, res: Response) => {
  const customPatientFields = req.body;

  if (customPatientFields && customPatientFields.length > 0) {
    formServices
      .queryInsertCustomPatientFields(customPatientFields)
      .then((customPatientFields) => {
        res.status(200).send(customPatientFields);
      })
      .catch((err) => {
        res.status(500).send({
          message: 'There was an error adding custom patient fields...',
          err,
        });
      });
  } else {
    res.status(400).send('Invalid data was sent. Please check your data.');
  }
};

const getCustomPatientFields = (_: Request, res: Response) => {
  formServices
    .querySelectCustomPatientFields()
    .then((customPatientFields) => {
      res.status(200).send(customPatientFields);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          'There was an error fetching all of the custom patient fields...',
        err,
      });
    });
};

const updateCustomPatientFields = (req: Request, res: Response) => {
  const customPatientFields = req.body;

  if (customPatientFields && customPatientFields > 0) {
    formServices
      .queryUpdateCustomPatientFields(customPatientFields)
      .then((customPatientFields) => {
        res.status(200).send(customPatientFields);
      })
      .catch((err) => {
        res.status(500).send({
          message: 'There was an error updating custom patient fields...',
          err,
        });
      });
  } else {
    res.status(400).send('Invalid data was sent. Please check your data.');
  }
};

const getCustomPatientData = (req: Request, res: Response) => {
  const patientId = req.params.patientId;

  formServices
    .querySelectCustomPatientFieldsData(patientId)
    .then((customPatientFieldsData) => {
      res.status(200).send(customPatientFieldsData);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          'There was an error fetching all the data for custom patient fields...',
        err,
      });
    });
};

const saveCustomPatientData = (req: Request, res: Response) => {
  const patientId = req.params.patientId;
  const customPatientFields = req.body;

  if (customPatientFields && customPatientFields.length > 0) {
    formServices
      .queryInsertCustomPatientFieldsData(patientId, customPatientFields)
      .then((customPatientFieldsData) => {
        res.status(200).send(customPatientFieldsData);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            'There was an error saving all the data for custom patient fields...',
          err,
        });
      });
  } else {
    res.status(400).send('Invalid data was sent. Please check your data.');
  }
};

export default {
  addCustomPatientFields,
  getCustomPatientFields,
  updateCustomPatientFields,
  getCustomPatientData,
  saveCustomPatientData,
};
