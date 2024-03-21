import { Router } from 'express';

import formRouter from './form.route';
import patientsRouter from './patients.route';
import userRouter from './user.route';

const routes = Router();

routes.use('/form', formRouter);
routes.use('/me', userRouter);
routes.use('/patients', patientsRouter);

export default routes;
