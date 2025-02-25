'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Results from '../../src/components/Results';
import nflTeams from '../../src/data/nflTeams';
import teamPicks from '../../src/data/teamPicks';

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const team = searchParams.get('team');

  if (!team) {
    return <div className="p-5 bg-black min-h-screen text-white">Team not found.</div>;
  }

  const teamPickNumbers = teamPicks[team] || [];
  const { city, teamName } = nflTeams[team] || { city: '', teamName: team };

  return (
    <Results team={team} teamPicks={teamPickNumbers} teamName={`${city} ${teamName}`} />
  );
}