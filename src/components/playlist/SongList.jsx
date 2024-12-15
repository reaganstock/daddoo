import React from 'react';
import Card from '../ui/Card';

const SongList = ({ songs, onSongSelect, onSongRemove, onAddClick }) => {
  return (
    <Card>
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Songs</h3>
        <button
          onClick={onAddClick}
          className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700"
        >
          Add Song
        </button>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {songs.map((song) => (
          <div
            key={song.id}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <button
              onClick={() => onSongSelect(song)}
              className="flex-1 text-left"
            >
              <h4 className="text-white font-medium">{song.title}</h4>
              <p className="text-gray-400 text-sm">{song.artist}</p>
            </button>
            <button
              onClick={() => onSongRemove(song.id)}
              className="ml-4 text-red-400 hover:text-red-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SongList;