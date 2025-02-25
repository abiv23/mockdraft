// src/components/DraftPool.jsx
'use client';

import React from 'react';

const DraftPool = ({ availablePlayers, filterPosition, setFilterPosition, handleDraftPlayer, currentPick }) => {
  return (
    <div className="w-2/3 bg-gray-900 p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-white">Draft Pool</h2>
      <div className="mb-4">
        <select
          value={filterPosition}
          onChange={(e) => setFilterPosition(e.target.value)}
          className="p-2 rounded-lg bg-gray-800 text-white"
        >
          <option value="All">All</option>
          <option value="pCB">CB</option>
          <option value="QB">QB</option>
          <option value="RB">RB</option>
          <option value="WR">WR</option>
          <option value="TE">TE</option>
          <option value="OL">OL</option>
          <option value="DL">DL</option>
          <option value="LB">LB</option>
          <option value="S">S</option>
          <option value="K">K</option>
          <option value="P">P</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-4">
        {availablePlayers.map((player, index) => (
          <div
            key={index}
            className="p-4 bg-gray-800 rounded-lg shadow-md flex-1 min-w-[200px] max-w-[300px]"
          >
            <p className="text-white">Pick #: {rankedPlayers.indexOf(player) + 1}</p>
            <p className="text-white">Player: {player.name}</p>
            <p className="text-white">Position: {player.position}</p>
            <p className="text-white">Rating: {player.rating}</p>
            <p className="text-white">College: {player.college}</p>
            <p className="text-white">Year: {player.year}</p>
            <button
              className="mt-2 w-full p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors duration-200"
              onClick={() => handleDraftPlayer(player, currentPick)}
              disabled={!currentPick}
            >
              Draft
            </button>
          </div>
        ))}
        {availablePlayers.length === 0 && (
          <p className="text-white">No players available for drafting.</p>
        )}
      </div>
    </div>
  );
};

// Note: Ensure rankedPlayers is imported or passed as a prop if needed
export default DraftPool;