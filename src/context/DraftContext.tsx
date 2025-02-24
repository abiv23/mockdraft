// src/context/DraftContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Player, Team } from '../types/player';
import nflTeams from '../data/nflTeams';
import initialQBs from '../data/qbs';
import initialRunningBacks from '../data/rbs';
import initialTightEnds from '../data/tes';
import initialWideReceivers from '../data/wrs';
import initialLinebackers from '../data/lbers';
import initialEdgeRushers from '../data/edges';
import initialOffensiveGuards from '../data/guards';
import initialOffensiveTackles from '../data/ots';
import initialCenters from '../data/centers';
import initialGuards from '../data/guards';
import initialKickers from '../data/ks';
import initialPunters from '../data/ps';
import initialLongSnappers from '../data/ls';
import initialSafeties from '../data/safs';
import initialCornerbacks from '../data/cbs';

interface DraftContextType {
  players: Player[];
  teams: Team[];
  draftedPlayers: Player[];
  selectedTeam: Team | null;
  draftPlayer: (player: Player) => void;
  selectTeam: (team: Team | null) => void;
  getSuggestedPicks: (team: Team) => Player[]; // New method for suggested picks
}

const DraftContext = createContext<DraftContextType | undefined>(undefined);

const allPlayers: Player[] = [
  ...initialQBs,
  ...initialRunningBacks,
  ...initialTightEnds,
  ...initialWideReceivers,
  ...initialLinebackers,
  ...initialEdgeRushers,
  ...initialOffensiveGuards,
  ...initialOffensiveTackles,
  ...initialCenters,
  ...initialInteriorDefensiveLinemen,
  ...initialKickers,
  ...initialPunters,
  ...initialLongSnappers,
  ...initialSafeties,
  ...initialCornerbacks,
];

export function DraftProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>(allPlayers);
  const [draftedPlayers, setDraftedPlayers] = useState<Player[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teams] = useState<Team[]>(initialTeams);

  const draftPlayer = (player: Player) => {
    if (!selectedTeam) return; // Ensure a team is selected
    setDraftedPlayers([...draftedPlayers, { ...player, teamId: selectedTeam.id }]);
    setPlayers(players.filter((p) => p.id !== player.id));
  };

  const selectTeam = (team: Team | null) => {
    setSelectedTeam(team);
  };

  const getSuggestedPicks = (team: Team): Player[] => {
    // Filter players by position to match team needs (e.g., prioritize QBs for teams needing QBs)
    const availablePlayers = players.filter((player) => 
      team.needs.includes(player.position) || // Match exact position needs
      (team.needs.includes("OL") && ["G", "OT", "C"].includes(player.position)) || // Group OL positions
      (team.needs.includes("DL") && ["IDL", "EDGE"].includes(player.position)) // Group DL positions
    );

    // Sort players by rating (highest first) and then by grade (higher rounds first)
    return availablePlayers
      .sort((a, b) => b.rating - a.rating || a.grade.localeCompare(b.grade))
      .slice(0, 3); // Return top 3 suggestions
  };

  const value = {
    players,
    teams,
    draftedPlayers,
    selectedTeam,
    draftPlayer,
    selectTeam,
    getSuggestedPicks,
  };

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export const useDraft = () => {
  const context = useContext(DraftContext);
  if (context === undefined) {
    throw new Error('useDraft must be used within a DraftProvider');
  }
  return context;
};