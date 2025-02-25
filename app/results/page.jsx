// ./app/results/page.jsx
import React, { Suspense } from 'react';
import Results from '../../src/components/Results'; // Adjust path

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="p-5 bg-black min-h-screen text-white">Loading results...</div>}>
      <Results />
    </Suspense>
  );
}