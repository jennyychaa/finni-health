import { QueryResults } from './services/db';

export function logErrorMessage(error: unknown) {
  if (error instanceof Error) {
    console.error('❌ There was an error fetching patient data', error.message);
  }
  console.error(String(error));
}

export function parseQueryResults(rows: QueryResults) {
  return rows ?? [];
}
