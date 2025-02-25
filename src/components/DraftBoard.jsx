// src/components/DraftBoard.jsx
'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import teamPicks from '../data/teamPicks';
import nflTeams from '../data/nflTeams';
import draftOrder from '../data/draftOrder';
import rankedPlayers from '../data/rankedPlayers';
import { useDraftStore } from '../store/draftStore';
import DraftPool from './DraftPool';
import FullDraft from './FullDraft';
import YourPicks from './YourPicks';
import TopNav from './TopNav';
import Footer from './Footer';

const DraftBoard = React.memo(() => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const team = searchParams.get('team');
  const rounds = parseInt(searchParams.get('rounds') || 7, 10);

  const {
    selectedPlayers,
    currentUserPick,
    setSelectedPlayer,
    setCurrentUserPick,
    setMultiplePicks,
    setInitialDraft,
    resetDraft,
  } = useDraftStore();

  useEffect(() => {
    resetDraft();
  }, [team, resetDraft]);

  const allPicks = useMemo(() => {
    const picks = [];
    for (let i = 1; i <= rounds; i++) {
      const round = `Round ${i}`;
      if (draftOrder[round]) {
        Object.entries(draftOrder[round]).forEach(([pickNumber, teamName]) => {
          picks.push({ pickNumber, round, team: teamName });
        });
      }
    }
    return picks.sort((a, b) => parseInt(a.pickNumber) - parseInt(b.pickNumber));
  }, [rounds]);

  const teamPickNumbers = team ? teamPicks[team] || [] : [];
  const filteredTeamPickNumbers = useMemo(
    () =>
      teamPickNumbers.filter((pick) => {
        const round = Object.keys(draftOrder).find((r) => draftOrder[r][pick] === team);
        return round && parseInt(round.split(' ')[1]) <= rounds;
      }),
    [team, rounds, teamPickNumbers]
  );

  useEffect(() => {
    if (Object.keys(selectedPlayers).length > 0 || !team) return;

    const initialSelections = {};
    let availablePlayers = [...rankedPlayers];
    const firstUserPick = filteredTeamPickNumbers[0] || "1";

    for (let i = 1; i < parseInt(firstUserPick); i++) {
      const pickNumber = i.toString();
      const pick = allPicks.find((p) => p.pickNumber === pickNumber);
      if (pick && pick.team !== team) {
        const highestRated = availablePlayers.reduce(
          (highest, current) => (current.rating > highest.rating ? current : highest),
          { rating: -Infinity }
        );
        if (highestRated.rating !== -Infinity) {
          initialSelections[pickNumber] = highestRated;
          availablePlayers = availablePlayers.filter((p) => p.name !== highestRated.name);
        }
      }
    }

    for (let i = 1; i <= 257; i++) {
      const pickNumber = i.toString();
      if (!(pickNumber in initialSelections)) {
        initialSelections[pickNumber] = null;
      }
    }

    setInitialDraft(initialSelections, firstUserPick);
    console.log('Initial setup:', { firstUserPick, selectedPlayers: initialSelections });
  }, [team, filteredTeamPickNumbers, allPicks, setInitialDraft]);

  const autoDraftNonUserPicks = useCallback(
    (newCurrentPick) => {
      if (!newCurrentPick) return;

      const currentPickNumber = parseInt(newCurrentPick);
      const picksToDraft = {};
      let availablePlayers = rankedPlayers.filter(
        (p) => !Object.values(selectedPlayers).some((sp) => sp?.name === p.name)
      );

      const lastUserPick =
        filteredTeamPickNumbers
          .filter((p) => parseInt(p) < currentPickNumber)
          .sort((a, b) => parseInt(b) - parseInt(a))[0] || "0";

      console.log(`Auto-drafting from ${lastUserPick} to ${currentPickNumber - 1}`);

      for (let i = parseInt(lastUserPick) + 1; i < currentPickNumber; i++) {
        const pickNumber = i.toString();
        const pick = allPicks.find((p) => p.pickNumber === pickNumber);
        if (pick && pick.team !== team && !selectedPlayers[pickNumber]) {
          const highestRated = availablePlayers.reduce(
            (highest, current) => (current.rating > highest.rating ? current : highest),
            { rating: -Infinity }
          );
          if (highestRated.rating !== -Infinity) {
            picksToDraft[pickNumber] = highestRated;
            availablePlayers = availablePlayers.filter((p) => p.name !== highestRated.name);
          } else {
            console.warn(`No available players for pick ${pickNumber}`);
          }
        }
      }

      // If no more user picks, finish the draft
      if (!filteredTeamPickNumbers.some((p) => parseInt(p) > currentPickNumber)) {
        console.log(`Finishing draft from ${currentPickNumber + 1} to 257`);
        for (let i = currentPickNumber + 1; i <= 257; i++) {
          const pickNumber = i.toString();
          const pick = allPicks.find((p) => p.pickNumber === pickNumber);
          if (pick && pick.team !== team && !selectedPlayers[pickNumber]) {
            const highestRated = availablePlayers.reduce(
              (highest, current) => (current.rating > highest.rating ? current : highest),
              { rating: -Infinity }
            );
            if (highestRated.rating !== -Infinity) {
              picksToDraft[pickNumber] = highestRated;
              availablePlayers = availablePlayers.filter((p) => p.name !== highestRated.name);
            } else {
              console.warn(`No available players for pick ${pickNumber}`);
            }
          }
        }
      }

      if (Object.keys(picksToDraft).length > 0) {
        console.log(`Auto-draft picks for ${newCurrentPick}:`, picksToDraft);
        setMultiplePicks(picksToDraft);
      } else {
        console.log(`No picks to auto-draft for ${newCurrentPick}`);
      }
    },
    [team, allPicks, selectedPlayers, setMultiplePicks, filteredTeamPickNumbers]
  );

  const [activeTab, setActiveTab] = useState('Full Draft');
  const [filterPosition, setFilterPosition] = useState('All');

  const takenPlayerNames = useMemo(
    () =>
      Object.values(selectedPlayers)
        .filter((player) => player !== null)
        .map((player) => player.name),
    [selectedPlayers]
  );
  const availablePlayers = useMemo(
    () =>
      rankedPlayers
        .filter((player) => {
          const matchesPosition = filterPosition === 'All' || player.position === filterPosition;
          return !takenPlayerNames.includes(player.name) && matchesPosition;
        })
        .sort((a, b) => b.rating - a.rating),
    [filterPosition, takenPlayerNames]
  );

  const { city, teamName } = team
    ? nflTeams[team] || { city: '', teamName: team }
    : { city: '', teamName: 'No Team' };

  const handleDraftPlayer = useCallback(
    (player, pickNumber) => {
      if (filteredTeamPickNumbers.includes(pickNumber)) {
        console.log(`User drafting pick ${pickNumber}:`, player);
        setSelectedPlayer(pickNumber, player);
        const nextUserPick = filteredTeamPickNumbers.find(
          (pick) => parseInt(pick) > parseInt(pickNumber) && !selectedPlayers[pick]
        );
        setCurrentUserPick(nextUserPick || null);
        autoDraftNonUserPicks(nextUserPick || "257");
      } else {
        console.warn('Cannot manually draft for another team’s pick');
      }
    },
    [filteredTeamPickNumbers, selectedPlayers, setSelectedPlayer, setCurrentUserPick, autoDraftNonUserPicks]
  );

  const currentPickRef = useRef(null);
  const [currentDraftPick, setCurrentDraftPick] = useState(null);

  const scrollToCurrentPick = useCallback(() => {
    if (leftRailRef.current) {
      if (activeTab === 'Full Draft' && currentDraftPick) {
        const element = leftRailRef.current.querySelector(`[data-pick="${currentDraftPick}"]`);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (activeTab === 'Your Picks') {
        leftRailRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [activeTab, currentDraftPick]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextUndraftedPick = allPicks.find((pick) => !selectedPlayers[pick.pickNumber])?.pickNumber;
      setCurrentDraftPick(nextUndraftedPick);
      scrollToCurrentPick();
    }, 100);
    return () => clearTimeout(timer);
  }, [currentUserPick, allPicks, scrollToCurrentPick]);

  useEffect(() => {
    const allPicksFilled = allPicks.every((pick) => selectedPlayers[pick.pickNumber] !== null);
    const noUserPicksRemaining = filteredTeamPickNumbers.every((pick) => selectedPlayers[pick]);
    if (noUserPicksRemaining && allPicksFilled) {
      console.log('Draft fully complete, navigating to results');
      router.push(`/results?team=${encodeURIComponent(team)}`);
    }
  }, [selectedPlayers, filteredTeamPickNumbers, allPicks, team, router]);

  const currentPick = currentUserPick;
  const currentRound = currentPick
    ? Object.keys(draftOrder).find((round) => draftOrder[round][currentPick] === team)
    : null;
  const showOnTheClock =
    currentPick && currentRound && team === allPicks.find((p) => p.pickNumber === currentPick)?.team;

  const leftRailRef = useRef(null);

  return (
    <div className="p-5 bg-black min-h-screen">
      <TopNav />
      <h1 className="text-3xl font-bold mb-6 text-white">Draft Board for {city} {teamName}</h1>
      <div className="flex flex-row gap-4">
        <div
          ref={leftRailRef}
          className="w-1/3 bg-gray-900 rounded-lg shadow-md overflow-y-auto h-[calc(100vh-350px)]"
        >
          <div className="p-4 sticky top-0 bg-gray-900 z-10">
            <div className="flex mb-4">
              <button
                className={`flex-1 p-2 rounded-t-lg ${
                  activeTab === 'Full Draft'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } transition-colors duration-200`}
                onClick={() => {
                  setActiveTab('Full Draft');
                  scrollToCurrentPick();
                }}
              >
                Full Draft
              </button>
              <button
                className={`flex-1 p-2 rounded-t-lg ${
                  activeTab === 'Your Picks'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } transition-colors duration-200`}
                onClick={() => {
                  setActiveTab('Your Picks');
                  scrollToCurrentPick();
                }}
              >
                Your Picks
              </button>
            </div>
          </div>
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
        <DraftPool
          availablePlayers={availablePlayers}
          filterPosition={filterPosition}
          setFilterPosition={setFilterPosition}
          handleDraftPlayer={handleDraftPlayer}
          currentPick={currentPick}
        />
      </div>
      <Footer />
    </div>
  );
});

DraftBoard.displayName = 'DraftBoard';
export default DraftBoard;