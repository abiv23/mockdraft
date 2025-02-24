// src/types/player.ts
export interface Player {
    id: number;
    name: string;
    position: string;
    rating: number;
    pffGrade?: number; // Optional PFF-specific grade
  }
  
  export interface Team {
    id: number;
    name: string;
    needs: string[]; // e.g., ["QB", "WR"]
  }