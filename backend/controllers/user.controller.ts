import { Request, Response } from 'express';

import { PROVIDER_ID } from '../constants';
import userServices from '../services/user.services';

/*
 * @TODO User Authentication
 * Mock the payload returned by an OAuth API once the user is authenticated.
 */
const getUserInfo = (_: Request, res: Response) => {
  userServices
    .querySelectUserData()
    .then((providers) => {
      res.status(200).send({
        providerId: PROVIDER_ID,
        firstName: providers[0].firstName,
        lastName: providers[0].lastName,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'There was an error authenticating the user...',
        err,
      });
    });
};

export default {
  getUserInfo,
};
