import { Router } from 'express';

import userController from '../controllers/user.controller';

const userRouter = Router();

userRouter.get('/', userController.getUserInfo);

export default userRouter;
