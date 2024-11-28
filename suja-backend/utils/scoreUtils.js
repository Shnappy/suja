// utils/scoreUtils.js
const updateScoreAndEmit = async (io, teamId, juryId, points, round, gameId) => {
    // Logic to update the score in the database
    // Emit updated score to the room
    io.to(gameId).emit('scoreUpdated', { teamId, juryId, points, round, gameId });
 };
 
 // Use in your route
 app.post('/api/scores', (req, res) => {
    updateScoreAndEmit(io, teamId, juryId, points, round, gameId);
 });