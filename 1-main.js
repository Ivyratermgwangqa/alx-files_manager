const express = require('express');
const dbClient = require('./utils/db');
const redisClient = require('./utils/redis');
const router = require('./routes/index'); // Assuming you have a routes directory with index.js

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/', router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Connected to MongoDB: ${dbClient.isAlive()}`);
  console.log(`Connected to Redis: ${redisClient.isAlive()}`);
});

(async () => {
  console.log(redisClient.isAlive());
  console.log(await redisClient.get('myKey'));
  await redisClient.set('myKey', 12, 5);
  console.log(await redisClient.get('myKey'));

  setTimeout(async () => {
    console.log(await redisClient.get('myKey'));
  }, 1000 * 10);

  if (dbClient.isAlive()) {
    console.log(`Number of users: ${await dbClient.nbUsers()}`);
    console.log(`Number of files: ${await dbClient.nbFiles()}`);
  } else {
    console.log('MongoDB connection failed');
  }
})();
