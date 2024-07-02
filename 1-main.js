import express from 'express';
import dbClient from './utils/db';
import redisClient from './utils/redis';
import router from './routes/index'; // Assuming you have an index.js in routes directory

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

  console.log(`Number of users: ${await dbClient.nbUsers()}`);
  console.log(`Number of files: ${await dbClient.nbFiles()}`);
})();
