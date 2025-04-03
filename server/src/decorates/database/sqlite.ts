import BetterSqlite3 from 'better-sqlite3';
import { logger } from '../../utils/index.ts';

const defaultOptions: BetterSqlite3.Options = {
  verbose: (a, b, ...args) => {
    logger.info(a, (b as any)?.toString(), ...args);
  },
};

export class SQLiteDB {
  db?: BetterSqlite3.Database;
  getDatabase() {
    if (this.db) this.db.close();
    this.db = BetterSqlite3('database.db', defaultOptions);
    return this.db;
  }
  getAllSchema() {}
}

export const getDatabase = () => {
  return BetterSqlite3('database.db', defaultOptions);
};
