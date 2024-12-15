import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import Card from '../ui/Card';
import { formatDate } from '../../utils/dateUtils';
import useMemoryStore from '../../store/memoryStore';

const MemoryCard = ({ id, title, description, image, video, date, author }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const { updateMemory, deleteMemory } = useMemoryStore();

  const handleSave = () => {
    updateMemory(id, {
      title: editTitle,
      description: editDescription
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      deleteMemory(id);
    }
  };

  if (isEditing) {
    return (
      <Card>
        <div className="space-y-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-3 bg-white/10 rounded-lg text-white"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full p-3 bg-white/10 rounded-lg text-white"
            rows="4"
          />
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-600 rounded-lg text-white hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700"
            >
              Save
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-400 hover:text-blue-300"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {image && (
          <div className="w-full md:w-1/2">
            <img
              src={image}
              alt={title}
              className="rounded-lg shadow-xl w-full"
            />
          </div>
        )}
        <div className={`w-full ${image ? 'md:w-1/2' : ''}`}>
          <p className="text-gray-200 text-lg mb-4">{description}</p>
          
          {video && (
            <div className="mt-4">
              <button
                onClick={() => setShowVideo(!showVideo)}
                className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700"
              >
                {showVideo ? 'Hide' : 'Show'} Video
              </button>
              {showVideo && (
                <div className="mt-4">
                  <ReactPlayer
                    url={video}
                    width="100%"
                    height="auto"
                    controls
                  />
                </div>
              )}
            </div>
          )}
          
          <div className="mt-6 flex justify-between items-center text-sm">
            <span className="text-purple-300">Added by {author}</span>
            <span className="text-blue-200">
              {formatDate(date)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MemoryCard;