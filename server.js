const express = require('express');
const bodyParser = require('body-parser');
const dbClient = require('./utils/db');
const redisClient = require('./utils/redis');
const UsersController = require('./controllers/UsersController');
const FilesController = require('./controllers/FilesController');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

// Define routes
app.post('/users', UsersController.postNew);
app.get('/users/me', UsersController.getMe);

app.post('/files', FilesController.postUpload);
app.get('/files/:id', FilesController.getShow);
app.get('/files', FilesController.getIndex);
app.put('/files/:id/publish', FilesController.putPublish);
app.put('/files/:id/unpublish', FilesController.putUnpublish);
app.get('/files/:id/data', FilesController.getFile);

// Start the server
app.listen(port, async () => {
    await dbClient.connect();
    await redisClient.connect();
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
