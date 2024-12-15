import React, { useState } from 'react';
import Card from '../ui/Card';
import { formatDate } from '../../utils/dateUtils';
import useTributeStore from '../../store/tributeStore';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const TributeCard = ({ id, content, author, date, signature, audio }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const { updateTribute, deleteTribute } = useTributeStore();

  const handleSave = () => {
    updateTribute(id, { content: editContent });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this tribute?')) {
      deleteTribute(id);
    }
  };

  if (isEditing) {
    return (
      <Card>
        <div className="space-y-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-4 bg-white/10 rounded-lg text-white text-lg"
            rows="8"
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
        <div className="flex items-center gap-4">
          <span className="text-purple-300">From {author}</span>
          {signature && (
            <img
              src={signature}
              alt={`${author}'s signature`}
              className="h-12 object-contain"
            />
          )}
        </div>
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

      <div className="prose prose-lg prose-invert mx-auto">
        <div className="whitespace-pre-line text-gray-200 text-lg leading-relaxed">
          {content}
        </div>
        
        {audio && (
          <div className="mt-6">
            <AudioPlayer
              src={audio}
              customAdditionalControls={[]}
              className="rounded-lg overflow-hidden"
            />
          </div>
        )}

        <div className="mt-6 text-right">
          <span className="text-blue-200">{formatDate(date)}</span>
        </div>
      </div>
    </Card>
  );
};

export default TributeCard;