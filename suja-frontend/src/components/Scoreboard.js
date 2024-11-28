import React from 'react';

function Scoreboard({ teams }) {
  return (
    <div>
      <h3>Scoreboard</h3>
      <ul>
        {teams.map((team) => (
          <li key={team.name}>
            {team.name}: {team.score} points
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Scoreboard;
