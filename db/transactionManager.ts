import DBManager from "@/db/dbManager";
import {type SQLiteDatabase} from "expo-sqlite";
import {Transaction, TransactionCreateData} from "@/models/Transaction";

export class TransactionManager{
  manager: DBManager;
  constructor(db: SQLiteDatabase) {
    this.manager = new DBManager(db, 'transactions');
  }

  async create(data: TransactionCreateData): Promise<Transaction | null> {
    const result = await this.manager.db.runAsync(`INSERT INTO ${this.manager.tableName} (journal_id, amount, description, create_date) VALUES (${data.journal_id}, ${data.amount}, '${data.description}', datetime('now'))`);
    return this.read(result.lastInsertRowId);
  }

  async read(id: number): Promise<Transaction | null> {
    const result = await this.manager.read(id);
    return result ? result as unknown as Transaction: null;
  }

  async list(): Promise<Transaction[]> {
    const result = await this.manager.list();
    return result as unknown as Transaction[];
  }

  async list_by_journal(journal_id: number): Promise<Transaction[]> {
    return await this.manager.db.getAllAsync<Transaction>(`SELECT * FROM ${this.manager.tableName} WHERE journal_id = ${journal_id}`);
  }

  async update(id: any, data: TransactionCreateData): Promise<Transaction | null> {
    const result = await this.manager.db.runAsync(`UPDATE ${this.manager.tableName} SET journal_id = ${data.journal_id}, amount = ${data.amount}, description = '${data.description}' WHERE id = ${id}`);
    return this.read(result.lastInsertRowId);
  }

  async delete(id: number) {
    console.log(`DELETE FROM ${this.manager.tableName} WHERE id = ${id}`);
    await this.manager.delete(id);
  }
}