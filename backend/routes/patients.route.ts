import { Router } from 'express';

import patientController from '../controllers/patients.controller';

const patientRouter = Router();

patientRouter.get('/', patientController.getPatientsByProvider);
patientRouter.post('/', patientController.addPatient);
patientRouter.get('/:patientId', patientController.getPatientDetails);
patientRouter.put('/:patientId', patientController.editPatientDetails);

export default patientRouter;
