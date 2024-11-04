import {type SQLiteDatabase, SQLiteRunResult, deleteDatabaseAsync} from "expo-sqlite";

export async function initDB(db: SQLiteDatabase){
  await db.execAsync('CREATE TABLE IF NOT EXISTS journals (id INTEGER PRIMARY KEY NOT NULL, name TEXT, closed BOOLEAN)')
  await db.execAsync('CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY NOT NULL, journal_id INTEGER, amount REAL, description TEXT, create_date TEXT, FOREIGN KEY(journal_id) REFERENCES journals(id))')
  // await db.closeAsync()
  // deleteDatabaseAsync('personalAccountingApp.db')
}

export default class DBManager {
  public db: SQLiteDatabase;
  public tableName: string;

  constructor(db: SQLiteDatabase, tableName: string) {
      this.db = db;
      this.tableName = tableName;
  }

  async read(id: number): Promise<SQLiteRunResult | null> {
    let query = `SELECT * FROM ${this.tableName} WHERE id = ${id}`;
    return this.db.getFirstSync(query);
  }

  async list(): Promise<unknown[]> {
    return this.db.getAllAsync(`SELECT * FROM ${this.tableName}`);
  }

  async delete(id: number) {
    await this.db.execAsync(`DELETE FROM ${this.tableName} WHERE id = ${id}`);
  }
}