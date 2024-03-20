import { createPool } from 'mysql2';

export const connection = createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'finni-health',
  connectTimeout: 60000,
  multipleStatements: true,
});
