import { QueryError, PoolConnection } from 'mysql2';
import { Provider } from '@finni-health/models';

import { PROVIDER_ID } from '../constants';
import { connection } from '../config/db';

const querySelectUserData = (): Promise<
  Pick<Provider, 'firstName' | 'lastName'>[]
> => {
  return new Promise((resolve, reject) => {
    connection.getConnection((_, conn: PoolConnection) => {
      conn.query(
        `
      SELECT
        first_name AS firstName,
        last_name AS lastName
      FROM users INNER JOIN providers ON users.id = providers.user_id
      WHERE providers.id="${PROVIDER_ID}"
      `,
        (
          err: QueryError,
          results: Pick<Provider, 'firstName' | 'lastName'>[]
        ) => {
          conn.release();

          if (err) return reject(err);
          return resolve(results);
        }
      );
    });
  });
};

export default { querySelectUserData };
