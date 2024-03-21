import express, { Response } from 'express';
import cors from 'cors';

import routes from './routes';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get('/', (_, res: Response) => {
  res.json({
    message: 'OK!',
  });
});

app.use('/api', routes);

app.listen(port, () => {
  console.log(`The Patient Management Dashboard app listening on port ${port}`);
});
