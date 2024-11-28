import React, { useEffect, useState } from 'react';

function JuryVotingPanel({ gameRoomId, socket }) {
  const [currentTeam, setCurrentTeam] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.on('currentTeam', (team) => {
        setCurrentTeam(team);
      });

      socket.on('scoreUpdate', (updatedTeams) => {
        if (currentTeam) {
          const updatedTeam = updatedTeams.find((team) => team && team.name === currentTeam.name);
          if (updatedTeam) {
            setCurrentTeam(updatedTeam);
          }
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('currentTeam');
        socket.off('scoreUpdate');
      }
    };
  }, [socket, currentTeam]);

  const handleVote = (points) => {
    if (currentTeam && gameRoomId) {
      socket.emit('voteTeam', { teamId: currentTeam.name, points });
    }
  };

  return (
    <div>
      {currentTeam ? (
        <div>
          <h3>Evaluating Team: {currentTeam.name}</h3>
          <button onClick={() => handleVote(1)}>+1 Point</button>
          <button onClick={() => handleVote(-1)}>-1 Point</button>
        </div>
      ) : (
        <h3>Waiting for the next team...</h3>
      )}
    </div>
  );
}

export default JuryVotingPanel;
