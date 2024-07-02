const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    this.client = new MongoClient(`mongodb://${host}:${port}`, { useUnifiedTopology: true });
    this.client.connect((err) => {
      if (err) {
        console.error('MongoDB connection error:', err);
        this.db = null;
      } else {
        this.db = this.client.db(database);
        console.log('MongoDB connected');
      }
    });
  }

  isAlive() {
    return this.client && this.client.topology.isConnected();
  }

  async nbUsers() {
    return this.db ? this.db.collection('users').countDocuments() : 0;
  }

  async nbFiles() {
    return this.db ? this.db.collection('files').countDocuments() : 0;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
