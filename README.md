# Draft Simulator

A Next.js-based NFL draft simulator where users can pick players for their favorite team while an auto-draft system fills in the rest. Built with React, Zustand for state management, and styled with Tailwind CSS. Currently an MVP with plans for production builds, deployment, and SSR enhancements.

## Features

- **Team Selection**: Pick an NFL team.
- **Interactive Drafting**: Manually select players for your team’s picks from a pool of ranked players.
- **Auto-Draft**: Automatically fills non-user picks in batches, completing the draft up to 257 picks.
- **Results Page**: Displays your team’s picks in a card view after the draft ends.
- **Responsive Design**: Works across devices with a dark-themed UI.

## Tech Stack

- **Next.js**: Framework for React with file-based routing.
- **React**: Frontend library for building components.
- **Zustand**: Lightweight state management for draft data.
- **Tailwind CSS**: Utility-first CSS for styling.
- **JavaScript**: Core language, ES6+ features.

## Prerequisites

- **Node.js**: v16+ (v18 recommended).
- **npm**: v8+ (or yarn if preferred).

## Setup

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/[your-username]/draft-simulator.git
   cd draft-simulator

2. **Install Dependencies**:
   ```bash
   npm install

2. **Run it locally**:
   ```bash
   npm run dev

Open http://localhost:3000 in your browser.


## Usage

- **Start Drafting**: Visit `http://localhost:3000/`.
- **Pick Players**: Use the `DraftPool` component to select players for your team’s picks.
- **View Results**: After the last pick, auto-draft completes the remaining slots, and you’re redirected to `/results?team=[Team Name]` to see your picks.


## Current Status

- **MVP Complete**: Core drafting functionality works in dev mode (`npm run dev`).
- **Next Steps**:
  - Production build (`npm run build`).
  - Deploy to the web (e.g., Vercel).
  - Convert components to SSR where possible.

## Contributing

Feel free to fork, submit PRs, or open issues! Focus areas:

- Bug fixes (e.g., auto-draft edge cases).
- UI enhancements (e.g., card animations).
- Performance optimizations (e.g., SSR, lazy loading).

## License

MIT License - free to use, modify, and distribute.
