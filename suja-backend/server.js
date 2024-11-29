const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/standup_game', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Models
const RoomSchema = new mongoose.Schema({
  name: String,
  teams: [{
    name: String,
    score: Number,
  }],
  totalRounds: Number,
});
const Room = mongoose.model('Room', RoomSchema);
let teams = [];
let rounds = [];
let currentRound = { teams: [] };
// Routes

// Socket.IO Handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('addTeam', async ({ teamName }, callback = () => {}) => {
    try {
      // Example: Add the team to an in-memory structure or a database
      const team = { name: teamName, score: 0 };
      // Assuming teams is an array that stores all teams
      teams.push(team); 
      
      // Emit to all clients the updated team list
      io.emit('scoreUpdate', teams);

      if (callback) callback({ success: true });
    } catch (error) {
      console.error('Error adding team:', error);
      if (callback) callback({ success: false, message: 'Failed to add team' });
    }
  });

  socket.on('voteTeam', async ({ teamId, points }) => {
    try {
      const team = teams.find((team) => team.name === teamId);
      if (team) {
        team.score += points;
        // Emit the updated state to all clients
        io.emit('scoreUpdate', teams);
        console.log(`Team ${team.name} updated to ${team.score}`);
      } else {
        console.error('Team not found');
      }
    } catch (error) {
      console.error('Error updating team score:', error);
    }
  });
  
// Emit the current teams to new users when they join
socket.on('joinGame', (callback = () => {}) => {
  try {
    callback({ success: true, teams });
  } catch (error) {
    console.error('Error sending current teams:', error);
    callback({ success: false, message: 'Failed to join game' });
  }
});

  // Handle adding a new round
  socket.on('addRound', (callback = () => {}) => {
    console.log('Handling New Round')
    try {
      if (teams.length > 0) {
        rounds.push({ teams: teams.map((team) => ({ name: team.name, score: team.score })) });
      }
      teams = teams.map((team) => ({ name: team.name, score: 0 }));
      io.emit('roundAdded', { rounds, currentRound: { teams } });
      callback({ success: true });
    } catch (error) {
      console.error('Error adding new round:', error);
      callback({ success: false, message: 'Failed to add round' });
    }
  });

  // Handle resetting the game
  socket.on('resetGame', (callback = () => {}) => {
    try {
      rounds = [];
      teams = [];
      console.log(teams);
      io.emit('gameReset', teams);
      callback({ success: true });
    } catch (error) {
      console.error('Error resetting game:', error);
      callback({ success: false, message: 'Failed to reset game' });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});


const PORT = process.env.PORT || 5000;

// Listening on all interfaces (0.0.0.0) instead of localhost
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});