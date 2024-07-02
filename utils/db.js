const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const dbName = process.env.DB_DATABASE || 'files_manager';
    
    const url = `mongodb://${host}:${port}`;
    
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.dbName = dbName;
    this.connected = false;
    this.db = null;
  }

  async connect() {
    if (!this.connected) {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      this.connected = true;
    }
  }

  async isAlive() {
    if (!this.connected) {
      await this.connect();
    }
    return this.connected;
  }

  async nbUsers() {
    await this.connect();
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    await this.connect();
    return this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
