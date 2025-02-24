'use client'; // Marks this as a Client Component

import { useRouter, useSearchParams } from 'next/navigation'; // Updated imports

export default function DraftSimulator() {
  const searchParams = useSearchParams(); // Use useSearchParams for query params
  const team = searchParams.get('team');

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-4">Draft Simulator</h1>
      <p>Selected Team: {team || 'None'}</p>
      {/* Add draft logic here */}
    </div>
  );
}