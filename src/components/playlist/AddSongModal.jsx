import React, { useState } from 'react';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';

const AddSongModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const song = {
      id: uuidv4(),
      title: title.trim(),
      artist: artist.trim(),
      url: url.trim(),
      addedBy: 'User', // Replace with actual user ID when auth is implemented
      dateAdded: new Date().toISOString()
    };
    onAdd(song);
    setTitle('');
    setArtist('');
    setUrl('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="max-w-2xl mx-auto mt-20 bg-gray-900/95 p-8 rounded-lg outline-none"
      overlayClassName="fixed inset-0 bg-black/75 flex items-center justify-center"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Add a Song</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white mb-2">Song Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-white/10 rounded-lg text-white"
            required
          />
        </div>
        <div>
          <label className="block text-white mb-2">Artist</label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full p-3 bg-white/10 rounded-lg text-white"
            required
          />
        </div>
        <div>
          <label className="block text-white mb-2">Song URL (YouTube/SoundCloud)</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 bg-white/10 rounded-lg text-white"
            required
            placeholder="https://"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded-lg text-white hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700"
          >
            Add Song
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddSongModal;