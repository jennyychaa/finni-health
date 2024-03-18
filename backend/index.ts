import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuid } from 'uuid';

import { logErrorMessage, parseQueryResults } from './helper';
import query from './services/db';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get('/', (_, res: Response) => {
  res.json({
    message: '✅ Success',
  });
});

app.get(
  '/provider',
  async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.query.providerId;

    try {
      const accountQuery = await query(`
        SELECT
          first_name,
          last_name
        FROM providers INNER JOIN users ON providers.user_id = users.id
        WHERE providers.id="${providerId}"
      `);
      const account = parseQueryResults(accountQuery);
      const patientsQuery = await query(`
        SELECT
          patients.id,
          users.first_name,
          users.last_name,
          patients.patient_status,
          patients.dob,
          address.city
        FROM providers
        INNER JOIN patients ON patients.provider_id = providers.id
        INNER JOIN users ON patients.user_id = users.id
        INNER JOIN address ON address.patient_id = patients.id
        WHERE providers.id="${providerId}" AND address.is_primary=1
      `);
      const patients = parseQueryResults(patientsQuery);

      res.json({
        providerId,
        account,
        patients,
      });
    } catch (err) {
      logErrorMessage(err);
      next(err);
    }
  }
);

app.listen(port, () => {
  console.log(`The Patient Management Dashboard app listening on port ${port}`);
});
