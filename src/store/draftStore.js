// ./src/store/draftStore.js
import { create } from 'zustand';

export const useDraftStore = create((set) => ({
  selectedPlayers: {},
  currentUserPick: null,
  setSelectedPlayer: (pickNumber, player) =>
    set((state) => {
      if (!state.selectedPlayers[pickNumber]) {
        return {
          selectedPlayers: { ...state.selectedPlayers, [pickNumber]: player },
        };
      }
      return state;
    }),
  setCurrentUserPick: (pickNumber) => set({ currentUserPick: pickNumber }),
  setMultiplePicks: (picks) =>
    set((state) => ({
      selectedPlayers: { ...state.selectedPlayers, ...picks },
    })),
  setInitialDraft: (initialSelections, initialPick) =>
    set({ selectedPlayers: initialSelections, currentUserPick: initialPick }),
  resetDraft: () => set({ selectedPlayers: {}, currentUserPick: null }),
}));