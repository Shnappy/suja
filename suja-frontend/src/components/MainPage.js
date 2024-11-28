import React, { useEffect, useState } from 'react';
import styles from '../TeamList.module.css';

function MainPage({ teams = [], setTeams, socket, handleVote, handleReset, handleAddRound, handleAddTeam }) {
  const [rounds, setRounds] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.emit('joinGame', (response) => {
        if (response.success) {
          console.log('Successfully joined the game');
          setTeams(response.teams || []);  // Set teams from the server response, or an empty array if undefined
          setRounds(response.rounds || []); // Set rounds from the server response, or an empty array if undefined
        } else {
          console.error('Failed to join the game:', response.message);
        }
      });

      socket.on('scoreUpdate', (updatedTeams) => {
        setTeams(updatedTeams || []); // Ensure teams are always an array
      });

      socket.on('roundAdded', ({ rounds, currentRound }) => {
        setRounds(rounds || []); // Ensure rounds are always an array
        setTeams(currentRound.teams || []); // Ensure currentRound.teams is always an array
      });

      socket.on('gameReset', (resetTeams) => {
        console.log('Game has been reset');
        setTeams(resetTeams || []); // Clear teams on reset
        setRounds([]); // Clear rounds on game reset
      });
    }
  }, [socket, setTeams, setRounds]);

  return (
    <div className={styles} >
      <h1>Standup Judging Game</h1>
      <button className={styles.btn2}  onClick={handleReset}>Давай по-новой!</button>
      <button className={styles.btn1}  onClick={handleAddRound}>РАУНД</button>
      <button className={styles.btn1}  onClick={handleAddTeam}>Добавить Команду</button>
      <div>
        <h1>Команды:</h1>
        <ul>
          {teams.map((team) => (
            <li key={team.name} className={styles.teamItem}>
              {team.name} - Очки: {team.score}
              <button className={styles.btn1} onClick={() => handleVote(team.name, 1)}>Спелый</button>
              <button className={styles.btn2} onClick={() => handleVote(team.name, -1)}>Гнилой</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h1>Раунды:</h1>
        <ul>
          {rounds.map((round, index) => (
            <li key={index}>
              <strong>Раунд {index + 1}:</strong>
              <ul>
                {round.teams.map((team) => (
                  <li key={team.name}>{team.name} - Очки: {team.score}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MainPage;
