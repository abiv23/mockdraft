// ./src/components/Results.jsx
'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useDraftStore } from '../store/draftStore';
import draftOrder from '../data/draftOrder';
import teamPicks from '../data/teamPicks';
import nflTeams from '../data/nflTeams';
import TopNav from './TopNav';
import Footer from './Footer';

const Results = () => {
  const searchParams = useSearchParams();
  const team = searchParams.get('team');
  const { selectedPlayers } = useDraftStore();

  if (!team) {
    return <div className="p-5 bg-black min-h-screen text-white">Team not found.</div>;
  }

  const teamPickNumbers = teamPicks[team] || [];
  const { city, teamName } = nflTeams[team] || { city: '', teamName: team };
  const fullTeamName = `${city} ${teamName}`;

  const userPicks = teamPickNumbers
    .map((pickNumber) => {
      const round = Object.keys(draftOrder).find((r) => draftOrder[r][pickNumber]);
      return { pickNumber, player: selectedPlayers[pickNumber], round };
    })
    .filter(({ player }) => player);

  return (
    <div className="p-5 bg-black min-h-screen text-white">
      <TopNav />
      <h1 className="text-4xl font-bold mb-8 text-center">Your Draft Results for {fullTeamName}</h1>
      {userPicks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPicks.map(({ pickNumber, player, round }) => (
            <div
              key={pickNumber}
              className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center"
            >
              <h2 className="text-2xl font-semibold mb-2">
                Pick {pickNumber} - {round}
              </h2>
              <p className="text-xl mb-1">{player.name}</p>
              <p className="text-lg text-gray-300">Position: {player.position || 'N/A'}</p>
              <p className="text-lg text-gray-300">Rating: {player.rating}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg text-center text-gray-400">No picks selected for {fullTeamName}.</p>
      )}
      <Footer />
    </div>
  );
};

export default Results;