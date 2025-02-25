// src/components/YourPicks.jsx
'use client';

import React from 'react';
import nflTeams from '../data/nflTeams'

const YourPicks = ({ filteredTeamPickNumbers, allPicks, selectedPlayers, team }) => {
  const { teamName } = team ? nflTeams[team] || { city: '', teamName: team } : { city: '', teamName: 'No Team' };

  return (
    <div className="p-4 bg-gray-800 rounded-b-lg shadow-inner">
      <h2 className="text-2xl font-bold mb-4 text-white">Your Picks</h2>
      {filteredTeamPickNumbers.length === 0 ? (
        <p className="text-white">No picks available for {teamName}.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredTeamPickNumbers.map(pickNumber => {
            const pick = allPicks.find(p => p.pickNumber === pickNumber);
            const selectedPlayer = selectedPlayers[pickNumber];
            return (
              <div
                key={pickNumber}
                className="p-2 bg-gray-700 rounded-lg text-white"
              >
                <p>Round: {pick?.round || 'N/A'}</p>
                <p>Pick #: {pickNumber}</p>
                <p>Player: {selectedPlayer ? selectedPlayer.name : 'Not Drafted'}</p>
                <p>Position: {selectedPlayer ? selectedPlayer.position : 'N/A'}</p>
                <p>Team: {pick?.team || teamName}</p>
                <p>Rating: {selectedPlayer ? selectedPlayer.rating : 0}</p>
                <p>College: {selectedPlayer ? selectedPlayer.college : 'N/A'}</p>
                <p>Year: {selectedPlayer ? selectedPlayer.year : 'N/A'}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default YourPicks;