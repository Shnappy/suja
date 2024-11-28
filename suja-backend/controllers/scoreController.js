// controllers/scoreController.js
const Score = require('../models/Score');
const Team = require('../models/Team');

// Allocate a score to a team in a specific round
exports.allocateScore = async (req, res) => {
   const { teamId, juryId, points, round } = req.body;
   try {
      // Save score to the Score collection
      const score = new Score({ teamId, juryId, points, round });
      await score.save();

      // Update team's total score
      const team = await Team.findById(teamId);
      if (!team) return res.status(404).json({ message: 'Team not found' });
      team.totalScore += points;
      await team.save();

      res.status(201).json(score);
   } catch (error) {
      res.status(400).json({ message: error.message });
   }
};

// Get all scores for a specific team and round
exports.getScoresByTeamAndRound = async (req, res) => {
   const { teamId, round } = req.query;
   try {
      const scores = await Score.find({ teamId, round });
      res.json(scores);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// In your score allocation logic, after saving the score to MongoDB
const newScore = await score.save();

// Emit an event to notify clients of the updated score
io.emit('scoreUpdated', {
  teamId: newScore.teamId,
  juryId: newScore.juryId,
  points: newScore.points,
  round: newScore.round,
});

io.emit('roundStarted', { round: newRound });