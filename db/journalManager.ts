import DBManager from "@/db/dbManager";
import {type SQLiteDatabase} from "expo-sqlite";
import { Journal, JournalCreteData } from "@/models/Journal";

export class JournalManager {
  manager: DBManager;
  constructor(db: SQLiteDatabase) {
    this.manager = new DBManager(db, 'journals');
  }

  async create(data: JournalCreteData): Promise<Journal> {
    const result = await this.manager.db.runAsync(`INSERT INTO ${this.manager.tableName} (name, closed) VALUES ('${data.name}', ${data.closed})`);
    return await this.read(result.lastInsertRowId);
  }

  async read(id: number): Promise<Journal> {
    return (await this.manager.read(id)) as unknown as Journal;
  }

  async list(): Promise<Journal[]> {
    return await this.manager.list() as unknown[] as Journal[];
  }

}