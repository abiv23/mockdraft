// src/components/TopNav.jsx
'use client';

import React from 'react';
import Link from 'next/link';

const TopNav = () => {
  return (
    <nav className="bg-black p-4 shadow-md sticky top-0 z-20">
      <div className="container mx-auto flex justify-start">
        <Link href="/" className="text-white text-lg font-semibold hover:text-blue-600 transition-colors duration-200">
          Back to Home
        </Link>
      </div>
    </nav>
  );
};

export default TopNav;