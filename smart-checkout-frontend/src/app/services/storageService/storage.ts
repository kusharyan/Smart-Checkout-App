import { Injectable } from '@angular/core';
import { SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class Storage {
  sqlite: SQLiteConnection | undefined;
  db: SQLiteDBConnection | undefined;
  private dbName: string = 'smart_checkout_db';

  constructor() {}

  async initDb() {
    try{
      const dbName = this.dbName;
      await this.sqlite?.checkConnectionsConsistency();
      const isConnected = await this.sqlite?.isConnection(dbName, false);
      console.log('Connection already exists:', isConnected);
      if (!isConnected?.result) {
        this.db = await this.sqlite?.retrieveConnection(
          dbName,
          true
        )
        console.log('Retrieved existing connection:');
      } else {
        this.db = await this.sqlite?.createConnection(
          dbName,
          false,
          'no-encryption',
          1,
          true
        );
        console.log(`${this.dbName} - SQLite DB Connection Created Successfully`);
      }
      await this.db?.open();
    } catch(error) {
      console.error('Error initializing database:', error); 
    }
  }

  async createDatabaseTable() {
    try{ 
      
    } catch(error) {
      console.error('Error creating database table:', error); 
    }
  }
}
