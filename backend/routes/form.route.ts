import { Router } from 'express';

import formController from '../controllers/form.controller';

const formRouter = Router();

formRouter.get('/provider', formController.getCustomPatientFields);
formRouter.post('/provider', formController.addCustomPatientFields);
formRouter.put('/provider', formController.updateCustomPatientFields);
formRouter.get('/patients/:patientId', formController.getCustomPatientData);
formRouter.post('/patients/:patientId', formController.saveCustomPatientData);

export default formRouter;
