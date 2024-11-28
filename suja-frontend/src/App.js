import React, { useState } from 'react';
import MainPage from './components/MainPage';
import socket from './socket';

function App() {
  const [teams, setTeams] = useState([]);
  const gameId = 'main-game'; // Using a single game ID for the main page

  const handleVote = (teamName, points) => {
    socket.emit('voteTeam', { teamId: teamName, points });
  };

  const handleReset = () => {
    socket.emit('resetGame', (response) => {
      if (response.success) {
        setTeams([]);
      } else {
        console.error('Failed to reset game:', response.message);
      }
    });
  };

  const handleAddRound = () => {
    console.log('Add New Round button clicked');
    socket.emit('addRound', (response) => {
      if (response.success) {
        console.log('Round added successfully');
      } else {
        console.error('Failed to add round:', response.message);
      }
    });
  };
  

  const handleAddTeam = () => {
    const teamName = prompt('Enter the new team name:');
    console.log('Add New Team button clicked');
    if (teamName) {
      console.log('Team name entered:', teamName);
      socket.emit('addTeam', { teamName }, (response) => {
        if (response.success) {
          // Do NOT update teams locally, let the server handle it
          console.log('New team added:', teamName);
        } else {
          console.error('Failed to add team:', response.message);
        }
      });
    }
  };
  
  

  return (
    <div className="App">
      <MainPage
        gameId={gameId}
        teams={teams}
        setTeams={setTeams}
        socket={socket}
        handleVote={handleVote}
        handleReset={handleReset}
        handleAddRound={handleAddRound}
        handleAddTeam={handleAddTeam}
      />
    </div>
  );
}

export default App;
