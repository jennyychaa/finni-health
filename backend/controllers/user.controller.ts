import { Request, Response } from 'express';
import { QueryError, PoolConnection } from 'mysql2';
import { PROVIDER_ID, Provider } from '@finni-health/models';

import { connection } from '../config/db';

/*
 * @TODO User Authentication
 * Mock the payload returned by an OAuth API once the user is authenticated.
 */
const getUserInfo = (_: Request, res: Response) => {
  connection.getConnection((_, conn: PoolConnection) => {
    conn.query(
      `
      SELECT
        first_name AS firstName,
        last_name AS lastName
      FROM providers INNER JOIN users ON providers.user_id = users.id
      WHERE providers.id="${PROVIDER_ID}"
      `,
      (err: QueryError, result: Provider[]) => {
        conn.release();

        if (err) {
          res.status(500).send({
            message: 'There was an error authenticating the user...',
            err,
          });
        } else {
          res.status(200).send({
            providerId: PROVIDER_ID,
            firstName: result[0].firstName,
            lastName: result[0].lastName,
          });
        }
      }
    );
  });
};

export default {
  getUserInfo,
};
