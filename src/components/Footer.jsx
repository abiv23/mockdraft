// src/components/Footer.jsx
'use client';

import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white p-4 text-right">
      <p>&copy; {currentYear} Draft Bivulator. All rights reserved.</p>
    </footer>
  );
};

export default Footer;