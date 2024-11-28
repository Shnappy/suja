import React, { useEffect } from 'react';

function GameRoom({ gameRoomId, userRole, teams, setTeams, currentTeam, setCurrentTeam, socket, handleVote, handleNextTeam }) {
  useEffect(() => {
    if (socket) {
      socket.emit('joinRoom', gameRoomId, (response) => {
        if (response.success) {
          console.log(`Successfully joined room: ${gameRoomId}`);
        } else {
          console.error('Failed to join room:', response.message);
        }
      });

      socket.on('scoreUpdate', (updatedTeams) => {
        setTeams(updatedTeams);
        const updatedCurrentTeam = updatedTeams.find((team) => team.name === currentTeam?.name);
        if (updatedCurrentTeam) {
          setCurrentTeam(updatedCurrentTeam);
        }
      });

      socket.on('disconnect', () => {
        console.warn('Disconnected from server, attempting to reconnect...');
        socket.emit('joinRoom', gameRoomId, (response) => {
          if (response.success) {
            console.log(`Rejoined room: ${gameRoomId}`);
          } else {
            console.error('Failed to rejoin room:', response.message);
          }
        });
      });
    }

    return () => {
      if (socket) {
        socket.emit('leaveRoom', gameRoomId, () => {
          console.log(`Left room: ${gameRoomId}`);
        });
        socket.off('scoreUpdate');
        socket.off('disconnect');
      }
    };
  }, [socket, gameRoomId, currentTeam?.name, setCurrentTeam, setTeams]);

  return (
    <div>
      <h2>Game Room: {gameRoomId}</h2>
      <h3>Role: {userRole}</h3>
      {currentTeam && (
        <div>
          <h3>Evaluating Team: {currentTeam.name}</h3>
          <button onClick={() => handleVote(1)}>+1 Point</button>
          <button onClick={() => handleVote(-1)}>-1 Point</button>
        </div>
      )}
      {userRole === 'GameMaster' && (
        <button onClick={handleNextTeam}>Next Team</button>
      )}
      <div>
        <h3>Teams:</h3>
        <ul>
          {teams.map((team) => (
            <li key={team.name}>
              {team.name} - Score: {team.score}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GameRoom;
