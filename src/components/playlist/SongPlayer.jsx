import React from 'react';
import ReactPlayer from 'react-player';
import Card from '../ui/Card';

const SongPlayer = ({ currentSong }) => {
  return (
    <Card>
      {currentSong ? (
        <div className="h-full flex flex-col">
          <h3 className="text-xl font-bold text-white mb-4">Now Playing</h3>
          <div className="flex-1 relative min-h-[300px]">
            <ReactPlayer
              url={currentSong.url}
              width="100%"
              height="100%"
              controls
              playing
              config={{
                youtube: {
                  playerVars: { showinfo: 1 }
                }
              }}
            />
          </div>
        </div>
      ) : (
        <div className="h-full min-h-[300px] flex items-center justify-center text-gray-400">
          Select a song to play
        </div>
      )}
    </Card>
  );
};

export default SongPlayer;