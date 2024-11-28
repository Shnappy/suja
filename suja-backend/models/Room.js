const mongoose = require('mongoose');

// Room Schema
const RoomSchema = new mongoose.Schema({
  name: String,
  teams: [
    {
      name: String,
      score: Number,
    },
  ],
  totalRounds: Number,
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
