'use client'

import React from 'react';
import { useDraft } from '../context/DraftContext';

const DraftBoard: React.FC = () => {
  const { players, draftedPlayers, draftPlayer, teams, selectedTeam, selectTeam } = useDraft();

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-semibold mb-4">Draft Simulator</h2>
      
      {/* Team Selection */}
      <div className="mb-4">
        <label className="text-lg font-medium">Select Team:</label>
        <select
          onChange={(e) => selectTeam(teams.find((t) => t.name === e.target.value) || null)}
          className="ml-2 p-2 border rounded"
          value={selectedTeam?.name || ''}
        >
          <option value="">Choose a team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.name}>
              {team.name} (Needs: {team.needs.join(', ')})
            </option>
          ))}
        </select>
      </div>

      {/* Available Players */}
      <h3 className="text-xl font-semibold">Available Players</h3>
      <ul className="list-disc pl-5 mt-2">
        {players.map((player) => (
          <li key={player.id} className="mb-2">
            {player.name} - {player.position} (Rating: {player.rating}, PFF: {player.pffGrade})
            <button
              onClick={() => draftPlayer(player)}
              disabled={!selectedTeam}
              className={`ml-4 p-2 rounded ${selectedTeam ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              Draft
            </button>
          </li>
        ))}
      </ul>

      {/* Drafted Players */}
      <h3 className="text-xl font-semibold mt-4">Drafted Players for {selectedTeam?.name || 'No Team Selected'}</h3>
      <ul className="list-disc pl-5">
        {draftedPlayers.map((player) => (
          <li key={player.id}>{player.name} - {player.position}</li>
        ))}
      </ul>
    </div>
  );
};

export default DraftBoard;