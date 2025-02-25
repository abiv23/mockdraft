// src/components/DraftBoard.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import teamPicks from '../data/teamPicks';
import nflTeams from '../data/nflTeams';
import draftOrder from '../data/draftOrder';
import rankedPlayers from '../data/rankedPlayers';
import DraftPool from './DraftPool';
import FullDraft from './FullDraft';
import YourPicks from './YourPicks';

const DraftBoard = () => {
  const searchParams = useSearchParams();
  const team = searchParams.get('team');
  const rounds = parseInt(searchParams.get('rounds') || 7, 10); // Default to 7 rounds

  // Get all picks from draftOrder, filtered by rounds (no automatic player assignment)
  const allPicks = [];
  for (let i = 1; i <= rounds; i++) {
    const round = `Round ${i}`;
    if (draftOrder[round]) {
      Object.entries(draftOrder[round]).forEach(([pickNumber, teamName]) => {
        allPicks.push({ pickNumber, round, team: teamName });
      });
    }
  }

  // Sort all picks by pick number (numeric)
  allPicks.sort((a, b) => parseInt(a.pickNumber) - parseInt(b.pickNumber));

  // Get the team's picks from teamPicks
  const teamPickNumbers = team ? teamPicks[team] || [] : [];
  // Filter picks to only include those within the selected number of rounds
  const filteredTeamPickNumbers = teamPickNumbers.filter(pick => {
    const round = Object.keys(draftOrder).find(round => 
      draftOrder[round][pick] === team
    );
    return round && parseInt(round.split(' ')[1]) <= rounds;
  });

  // State for selected players (initially empty for all picks, auto-filled for picks before first user pick)
  const [selectedPlayers, setSelectedPlayers] = useState(() => {
    const initialSelections = {};
    const firstUserPick = filteredTeamPickNumbers[0]; // Start with the first user pick

    for (let i = 1; i <= rounds * 32; i++) { // Assume 32 teams per round, up to total picks
      const pickNumber = i.toString();
      const pick = allPicks.find(p => p.pickNumber === pickNumber);
      if (pick && pick.team !== team && (!firstUserPick || parseInt(pickNumber) < parseInt(firstUserPick))) {
        // Auto-draft for non-user picks before the first user pick
        const available = rankedPlayers.filter(p => 
          !Object.values(initialSelections).some(sp => sp?.name === p.name)
        );
        const highestRated = available.reduce((highest, current) => 
          current.rating > highest.rating ? current : highest, 
          { rating: -Infinity }
        );
        initialSelections[pickNumber] = highestRated.rating !== -Infinity ? highestRated : null;
      } else {
        // Leave user picks and picks after first user pick as null (manual drafting)
        initialSelections[pickNumber] = null;
      }
    }
    return initialSelections;
  });

  // State for current user pick (stored as pick number)
  const [currentUserPick, setCurrentUserPick] = useState(
    filteredTeamPickNumbers.find(pick => !selectedPlayers[pick]) || filteredTeamPickNumbers[0] || null
  );

  // State for selected tab in the left rail (default to "Full Draft")
  const [activeTab, setActiveTab] = useState('Full Draft');

  // State for filter position in Draft Pool
  const [filterPosition, setFilterPosition] = useState('All');

  // Get available players (all players from rankedPlayers, excluding those drafted, sorted by rating highest to lowest)
  const takenPlayerNames = Object.values(selectedPlayers)
    .filter(player => player !== null)
    .map(player => player.name);

  const availablePlayers = rankedPlayers
    .filter(player => {
      const matchesPosition = filterPosition === 'All' || player.position === filterPosition;
      return !takenPlayerNames.includes(player.name) && matchesPosition;
    })
    .sort((a, b) => b.rating - a.rating); // Sort by rating highest to lowest

  // Get team details for display
  const { city, teamName } = team ? nflTeams[team] || { city: '', teamName: team } : { city: '', teamName: 'No Team' };

  // Handle drafting a player for a specific pick (manual for user’s picks)
  const handleDraftPlayer = (player, pickNumber) => {
    if (filteredTeamPickNumbers.includes(pickNumber)) { // Only allow manual drafting for user’s picks
      setSelectedPlayers(prev => {
        const newSelections = {
          ...prev,
          [pickNumber]: player,
        };
        return newSelections;
      });

      // Update current user pick to the next undrafted user pick
      const nextUserPick = filteredTeamPickNumbers.find(pick => 
        parseInt(pick) > parseInt(pickNumber) && !selectedPlayers[pick]
      );
      setCurrentUserPick(nextUserPick || null);

      // Trigger auto-draft for non-user picks before the new currentUserPick, ensuring preceding picks are complete
      autoDraftNonUserPicks(nextUserPick || null);
    } else {
      console.warn('Cannot manually draft for another team’s pick.');
    }
  };

  // Auto-draft for non-user picks ahead of the current user pick, ensuring preceding picks are complete
  const autoDraftNonUserPicks = (newCurrentPick) => {
    if (!newCurrentPick) return; // No auto-draft if no user picks remain

    const currentPickNumber = parseInt(newCurrentPick);
    for (let i = 1; i < currentPickNumber; i++) {
      const pickNumber = i.toString();
      const pick = allPicks.find(p => p.pickNumber === pickNumber);
      if (pick && pick.team !== team && !selectedPlayers[pickNumber]) {
        // Check if all preceding picks are completed
        const allPrecedingComplete = allPicks
          .filter(p => parseInt(p.pickNumber) < parseInt(pickNumber))
          .every(p => selectedPlayers[p.pickNumber] !== null);
        if (!allPrecedingComplete) {
          console.warn(`Skipping auto-draft for Pick ${pickNumber} - preceding picks are not complete.`);
          continue; // Skip this pick if preceding picks aren’t complete
        }

        // Auto-draft for non-user picks before the current user pick, ensuring available players are updated
        const available = rankedPlayers.filter(p => 
          !Object.values(selectedPlayers).some(sp => sp?.name === p.name)
        );
        if (available.length === 0) {
          console.warn(`No available players for Pick ${pickNumber}.`);
          continue;
        }
        const highestRated = available.reduce((highest, current) => 
          current.rating > highest.rating ? current : highest, 
          { rating: -Infinity }
        );
        if (highestRated.rating !== -Infinity) {
          setSelectedPlayers(prev => ({
            ...prev,
            [pickNumber]: highestRated,
          }));
        }
      }
    }
  };

  // Initial auto-draft for picks before the first user pick, ensuring preceding picks are complete
  useEffect(() => {
    autoDraftNonUserPicks(currentUserPick);
  }, [currentUserPick, selectedPlayers, team, rounds, allPicks, rankedPlayers, filteredTeamPickNumbers]);

  // Track the current pick (user or auto-draft) for scrolling
  const currentPickRef = useRef(null);
  const [currentDraftPick, setCurrentDraftPick] = useState(
    allPicks.find(pick => !selectedPlayers[pick.pickNumber])?.pickNumber || null
  );

  useEffect(() => {
    // Update currentDraftPick whenever selectedPlayers changes
    const nextUndraftedPick = allPicks.find(pick => !selectedPlayers[pick.pickNumber])?.pickNumber;
    setCurrentDraftPick(nextUndraftedPick);

    // Scroll the current pick into view in FullDraft
    if (currentPickRef.current && nextUndraftedPick) {
      const element = document.querySelector(`[data-pick="${nextUndraftedPick}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedPlayers, allPicks]);

  // Simulate current pick (for "On the Clock" functionality, only for user's team)
  const currentPick = currentUserPick; // Use the tracked current user pick
  const currentRound = currentPick ? 
    Object.keys(draftOrder).find(round => draftOrder[round][currentPick] === team) : null;

  // Only show "You’re on the Clock!" if it’s the user’s pick
  const showOnTheClock = currentPick && currentRound && team === allPicks.find(p => p.pickNumber === currentPick)?.team;

  return (
    <div className="p-5 bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">Draft Board for {city} {teamName}</h1>
      <div className="flex flex-row gap-4">
        {/* Left Panel: Tabbed Draft and Picks (Scrollable Context) */}
        <div className="w-1/3 bg-gray-900 rounded-lg shadow-md overflow-y-auto h-[calc(100vh-200px)]">
          <div className="p-4 sticky top-0 bg-gray-900 z-10">
            {/* Tab Navigation */}
            <div className="flex mb-4">
              <button
                className={`flex-1 p-2 rounded-t-lg ${activeTab === 'Full Draft' ? 'bg-gray-800 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} transition-colors duration-200`}
                onClick={() => setActiveTab('Full Draft')}
              >
                Full Draft
              </button>
              <button
                className={`flex-1 p-2 rounded-t-lg ${activeTab === 'Your Picks' ? 'bg-gray-800 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} transition-colors duration-200`}
                onClick={() => setActiveTab('Your Picks')}
              >
                Your Picks
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'Full Draft' ? (
            <FullDraft 
              allPicks={allPicks} 
              selectedPlayers={selectedPlayers} 
              team={teamName} 
              currentPick={currentPick} 
              currentRound={currentRound} 
              showOnTheClock={showOnTheClock} 
              currentDraftPick={currentDraftPick}
              currentPickRef={currentPickRef}
            />
          ) : (
            <YourPicks 
              filteredTeamPickNumbers={filteredTeamPickNumbers} 
              allPicks={allPicks} 
              selectedPlayers={selectedPlayers} 
              team={team} 
            />
          )}
        </div>

        {/* Right Panel: Draft Pool */}
        <DraftPool 
          availablePlayers={availablePlayers} 
          filterPosition={filterPosition} 
          setFilterPosition={setFilterPosition} 
          handleDraftPlayer={handleDraftPlayer} 
          currentPick={currentPick} 
        />
      </div>
    </div>
  );
};

export default DraftBoard;