import mysql from 'mysql2/promise';

import config from '../config';

export type QueryResults =
  | mysql.OkPacket
  | mysql.ResultSetHeader
  | mysql.ResultSetHeader[]
  | mysql.RowDataPacket[]
  | mysql.RowDataPacket[][]
  | mysql.OkPacket[]
  | mysql.ProcedureCallPacket;

async function query(sql: string, params?: any) {
  const connection = await mysql.createConnection(config.db);
  const [results] = await connection.execute(sql, params);

  return results;
}

export default query;
