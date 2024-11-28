// controllers/teamController.js
const Team = require('../models/Team');

// Create a new team
exports.createTeam = async (req, res) => {
   try {
      const team = new Team(req.body);
      await team.save();
      res.status(201).json(team);
   } catch (error) {
      res.status(400).json({ message: error.message });
   }
};

// Get all teams
exports.getTeams = async (req, res) => {
   try {
      const teams = await Team.find();
      res.json(teams);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// Get a single team by ID
exports.getTeamById = async (req, res) => {
   try {
      const team = await Team.findById(req.params.id);
      if (!team) return res.status(404).json({ message: 'Team not found' });
      res.json(team);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// Update a team's total score
exports.updateTeamScore = async (req, res) => {
   try {
      const team = await Team.findByIdAndUpdate(
         req.params.id,
         { totalScore: req.body.totalScore },
         { new: true }
      );
      if (!team) return res.status(404).json({ message: 'Team not found' });
      res.json(team);
   } catch (error) {
      res.status(400).json({ message: error.message });
   }
};
