'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import nflTeams from '../data/nflTeams';
import teamColors from '../data/teamColors';
import RoundSelector from './RoundSelector'
import { useDraftStore } from '../store/draftStore';
import Footer from './Footer'

const TeamSelection = () => {
  const router = useRouter();
  const { resetDraft } = useDraftStore();

  // Reset draft store when TeamSelection loads
  useEffect(() => {
    resetDraft();
  }, [resetDraft]);

  const handleTeamSelect = (team) => {
    router.push(`/draft-simulator?team=${encodeURIComponent(team)}&rounds=${selectedRounds || 7}`);
  };

  // Function to get team color, now using the imported teamColors object
  const getTeamColor = (teamName) => {
    return teamColors[teamName] || '#FFFFFF'; // Default to white if team not found
  }

  // State for selected rounds (default to 7, matching NFL drafts)
  const [selectedRounds, setSelectedRounds] = useState(7);

  return (
    <div className="p-5 bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">Select Your Team</h1>
      <div className="flex flex-row gap-4">
        {/* Team Selection Grid (Left Column) */}
        <div className="flex-1">
          <div className="flex flex-wrap justify-center gap-4">
            {Object.keys(nflTeams).map((fullName) => {
              const { city, teamName } = nflTeams[fullName];
              const logoPath = `/logos/nfl/${teamName.toLowerCase().replace(/ /g, '-').replace(/'/g, '')}.png`;
              const backgroundColor = getTeamColor(teamName);

              return (
                <button
                  key={fullName}
                  className="p-4 rounded-lg w-40 h-40 flex flex-col items-center justify-center transition-colors duration-200 hover:opacity-80 hover:shadow-lg"
                  style={{
                    backgroundColor: backgroundColor, // Team-specific background color
                  }}
                  onClick={() => handleTeamSelect(fullName)}
                  aria-label={`${city} ${teamName}`} // Accessibility for screen readers
                >
                  <img
                    src={logoPath}
                    alt={`${city} ${teamName} Logo`} // Accessibility for images
                    className="max-w-full max-h-full object-contain mb-2" // Ensure logo fits, with margin for text
                    onError={(e) => {
                      e.target.style.display = 'none'; // Hide if logo fails to load
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Rail (Round Selector) */}
        <div className="w-1/4 bg-gray-900 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-white">Draft Rounds</h2>
          <RoundSelector value={selectedRounds} onChange={setSelectedRounds} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TeamSelection;