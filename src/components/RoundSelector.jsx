'use client'

import React from 'react';

const RoundSelector = ({ value, onChange }) => {
  const rounds = Array.from({ length: 7 }, (_, i) => i + 1); // [1, 2, 3, 4, 5, 6, 7]

  return (
    <div className="space-y-2">
      {rounds.map((round) => (
        <button
          key={round}
          className={`w-full p-2 rounded-md text-white ${
            value === round ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
          } transition-colors duration-200`}
          onClick={() => onChange(round)}
          aria-label={`Select ${round} round${round > 1 ? 's' : ''}`}
        >
          {round} Round{round > 1 ? 's' : ''}
        </button>
      ))}
    </div>
  );
};

export default RoundSelector;