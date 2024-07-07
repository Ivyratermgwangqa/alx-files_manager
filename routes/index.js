const express = require('express');
const router = express.Router();
const dbClient = require('../utils/db');
const UsersController = require('../controllers/UsersController');
const FilesController = require('../controllers/FilesController');
const AuthController = require('../controllers/AuthController');

// User routes
router.post('/users', UsersController.postNew);
router.get('/users/me', UsersController.getMe);

// File routes
router.post('/files', FilesController.postUpload);
router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);
router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnpublish);
router.get('/files/:id/data', FilesController.getFile);

// Status routes
router.get('/status', (req, res) => {
    res.status(200).json({ redis: true, db: true });
});

router.get('/stats', async (req, res) => {
    const usersCount = await dbClient.nbUsers();
    const filesCount = await dbClient.nbFiles();
    res.status(200).json({ users: usersCount, files: filesCount });
});

// Authentication routes
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);

module.exports = router;
