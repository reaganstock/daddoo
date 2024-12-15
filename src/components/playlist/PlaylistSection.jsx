import React, { useState } from 'react';
import AddSongModal from './AddSongModal';
import usePlaylistStore from '../../store/playlistStore';
import Section from '../ui/Section';
import SongList from './SongList';
import SongPlayer from './SongPlayer';

const PlaylistSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { songs, addSong, removeSong } = usePlaylistStore();
  const [currentSong, setCurrentSong] = useState(null);

  return (
    <Section id="playlist" title="Dad's Playlist">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SongList
          songs={songs}
          onSongSelect={setCurrentSong}
          onSongRemove={removeSong}
          onAddClick={() => setIsModalOpen(true)}
        />
        <SongPlayer currentSong={currentSong} />
      </div>

      <AddSongModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addSong}
      />
    </Section>
  );
};

export default PlaylistSection;