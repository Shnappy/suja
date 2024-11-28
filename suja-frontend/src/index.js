import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import styles from './TeamList.module.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Could not find the root container in the DOM");
}

function TeamList({ teams, handleVote }) {
  return (
    <div>
      <h3>Teams:</h3>
      <ul>
        {teams.map((team) => (
          <li key={team.name} className={styles.teamItem}>
            {team.name} - Score: {team.score}
            <button onClick={() => handleVote(team.name, 1)}>+1 Point</button>
            <button onClick={() => handleVote(team.name, -1)}>-1 Point</button>
            <button onClick={() => handleVote(team.name, -1)}>-1 Point</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamList;
