'use client';

import React, { Suspense } from 'react'
import DraftBoard from '../../src/components/DraftBoard';

export default function DraftSimulator() {
  return (
    <Suspense fallback={<div className="p-5 bg-black min-h-screen text-white">Loading draft...</div>}>
      <DraftBoard />
    </Suspense>
  )
}