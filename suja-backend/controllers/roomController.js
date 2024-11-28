const Room = require('../models/Room');

// Create a new room
exports.createRoom = async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
};

// Get all rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

// Delete a room by ID
exports.deleteRoomById = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
};

// Delete all rooms
exports.deleteAllRooms = async (req, res) => {
  try {
    await Room.deleteMany();
    res.status(200).json({ message: 'All rooms deleted successfully' });
  } catch (error) {
    console.error('Error deleting rooms:', error);
    res.status(500).json({ error: 'Failed to delete rooms' });
  }
};
