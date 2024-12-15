import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePlaylistStore = create(
  persist(
    (set) => ({
      songs: [],
      addSong: (song) => set((state) => ({
        songs: [...state.songs, song]
      })),
      removeSong: (id) => set((state) => ({
        songs: state.songs.filter(song => song.id !== id)
      })),
      editSong: (id, updates) => set((state) => ({
        songs: state.songs.map(song => 
          song.id === id ? { ...song, ...updates } : song
        )
      }))
    }),
    {
      name: 'playlist-storage'
    }
  )
);

export default usePlaylistStore;