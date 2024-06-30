const { ObjectId } = require('mongodb');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class FilesController {
    static async postUpload(req, res) {
        const token = req.headers['x-token'];
        const userId = await redisClient.get(`auth_${token}`);
        
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        const { name, type, parentId = 0, isPublic = false, data } = req.body;
        
        if (!name) {
            return res.status(400).json({ error: 'Missing name' });
        }
        
        if (!type || !['folder', 'file', 'image'].includes(type)) {
            return res.status(400).json({ error: 'Missing type or invalid type' });
        }
        
        if (!data && type !== 'folder') {
            return res.status(400).json({ error: 'Missing data' });
        }
        
        const user = await dbClient.db.collection('users').findOne({ _id: ObjectId(userId) });
        
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        const file = {
            userId: ObjectId(userId),
            name,
            type,
            parentId: parentId === 0 ? 0 : ObjectId(parentId),
            isPublic,
            data,
            createdAt: new Date(),
        };
        
        await dbClient.db.collection('files').insertOne(file);
        
        return res.status(201).json({
            id: file._id,
            userId: file.userId,
            name: file.name,
            type: file.type,
            isPublic: file.isPublic,
            parentId: file.parentId,
        });
    }
}

module.exports = FilesController;
