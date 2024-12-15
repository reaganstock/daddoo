import React from 'react';
import ReactPlayer from 'react-player';
import Card from '../ui/Card';

const Player = ({ currentSong }) => {
  return (
    <Card>
      {currentSong ? (
        <div className="h-full flex flex-col">
          <h3 className="text-xl font-bold text-white mb-4">Now Playing</h3>
          <div className="flex-1 relative">
            <ReactPlayer
              url={currentSong.url}
              width="100%"
              height="100%"
              controls
            />
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">
          Select a song to play
        </div>
      )}
    </Card>
  );
};

export default Player;