// src/components/FullDraft.jsx
'use client';

import React, { useEffect, useRef } from 'react';

const FullDraft = ({ allPicks, selectedPlayers, team, currentPick, currentRound, showOnTheClock, currentDraftPick, currentPickRef }) => {
  const pickRefs = useRef({});

  useEffect(() => {
    if (currentDraftPick && pickRefs.current[currentDraftPick]) {
      pickRefs.current[currentDraftPick].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentDraftPick]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-white">Current Draft</h2>
      <div className="flex flex-col gap-2">
        {allPicks.map((pick, index) => {
          const selectedPlayer = selectedPlayers[pick.pickNumber];
          const isUserPick = pick.team === team;
          const isOnTheClock = showOnTheClock && isUserPick && pick.pickNumber === currentPick;

          return (
            <div
              key={index}
              ref={el => pickRefs.current[pick.pickNumber] = el}
              data-pick={pick.pickNumber}
              className={`p-2 rounded-lg ${isUserPick ? 'bg-blue-600' : 'bg-gray-700'} text-white`}
            >
              {isOnTheClock && (
                <p className="text-yellow-300 mb-1">You’re on the Clock!</p>
              )}
              <p>Pick #{pick.pickNumber} - {selectedPlayer ? selectedPlayer.name : 'Not Drafted'} ({selectedPlayer ? selectedPlayer.position : 'N/A'})</p>
              <p>Team: {pick.team} | Round: {pick.round}</p>
              {isUserPick && <p className="text-white">Needs: QB, RB, T, CB</p>} {/* Customize needs based on team data */}
            </div>
          );
        })}
        {!allPicks.some(pick => pick.team === team) && (
          <p className="text-white">No picks available for {team}.</p>
        )}
      </div>
    </div>
  );
};

export default FullDraft;