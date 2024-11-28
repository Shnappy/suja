const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Routes for room operations
router.post('/rooms', roomController.createRoom);
router.get('/rooms', roomController.getRooms);
router.delete('/rooms/:id', roomController.deleteRoomById);
router.delete('/rooms', roomController.deleteAllRooms);

module.exports = router;
