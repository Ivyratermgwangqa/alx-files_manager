const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    this.uri = `mongodb://${host}:${port}`;
    this.client = new MongoClient(this.uri, { useUnifiedTopology: true });
    this.db = null; // Initialize db as null

    this.connect(); // Call connect method in constructor
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(); // Set the database instance
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      this.db = null; // Set db to null on connection error
    }
  }

  isAlive() {
    return this.client && this.client.isConnected();
  }

  async nbUsers() {
    try {
      return this.db ? await this.db.collection('users').countDocuments() : 0;
    } catch (error) {
      console.error('Error counting users:', error);
      return 0;
    }
  }

  async nbFiles() {
    try {
      return this.db ? await this.db.collection('files').countDocuments() : 0;
    } catch (error) {
      console.error('Error counting files:', error);
      return 0;
    }
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
