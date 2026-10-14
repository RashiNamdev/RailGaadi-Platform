import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Train } from '../types';
import { POPULAR_TRAINS } from '../constants';

interface AppState {
  selectedTrainNumber: string;
  recentSearches: Train[];
  favourites: string[]; // Train numbers
  mapMode: 'free' | 'follow' | 'overview' | 'station';
  is3DPitch: boolean;
  bottomSheetExpanded: boolean;
  activeTab: 'overview' | 'map' | 'analytics' | 'companion';
  searchQuery: string;
  isLiveTrackingEnabled: boolean;

  // Actions
  setSelectedTrainNumber: (trainNumber: string) => void;
  addRecentSearch: (train: Train) => void;
  toggleFavourite: (trainNumber: string) => void;
  setMapMode: (mode: 'free' | 'follow' | 'overview' | 'station') => void;
  toggle3DPitch: () => void;
  setBottomSheetExpanded: (expanded: boolean) => void;
  setActiveTab: (tab: 'overview' | 'map' | 'analytics' | 'companion') => void;
  setSearchQuery: (query: string) => void;
  toggleLiveTracking: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      selectedTrainNumber: '12951', // Mumbai Rajdhani default
      recentSearches: [POPULAR_TRAINS[0], POPULAR_TRAINS[1]],
      favourites: ['12951'],
      mapMode: 'follow',
      is3DPitch: false,
      bottomSheetExpanded: false,
      activeTab: 'overview',
      searchQuery: '',
      isLiveTrackingEnabled: true,

      setSelectedTrainNumber: (trainNumber) =>
        set({ selectedTrainNumber: trainNumber, mapMode: 'follow' }),

      addRecentSearch: (train) => {
        const current = get().recentSearches;
        const filtered = current.filter((t) => t.trainNumber !== train.trainNumber);
        set({ recentSearches: [train, ...filtered].slice(0, 5) });
      },

      toggleFavourite: (trainNumber) => {
        const current = get().favourites;
        const exists = current.includes(trainNumber);
        set({
          favourites: exists
            ? current.filter((id) => id !== trainNumber)
            : [...current, trainNumber],
        });
      },

      setMapMode: (mode) => set({ mapMode: mode }),
      toggle3DPitch: () => set((state) => ({ is3DPitch: !state.is3DPitch })),
      setBottomSheetExpanded: (expanded) => set({ bottomSheetExpanded: expanded }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      toggleLiveTracking: () => set((state) => ({ isLiveTrackingEnabled: !state.isLiveTrackingEnabled })),
    }),
    {
      name: 'railgaadi-storage',
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        favourites: state.favourites,
        selectedTrainNumber: state.selectedTrainNumber,
        isLiveTrackingEnabled: state.isLiveTrackingEnabled,
      }),
    }
  )
);
