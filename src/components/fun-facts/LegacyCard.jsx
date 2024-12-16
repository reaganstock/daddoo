import React, { useState } from 'react';
import Card from '../ui/Card';
import useFunFactsStore from '../../store/funFactsStore';

const LOCKED_FACTS = ['football', 'heroes'];

const LegacyCard = ({ id, title, content, image, preview }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);
  const { updateFunFact, deleteFunFact } = useFunFactsStore();

  const isLocked = LOCKED_FACTS.includes(id);

  // Don't even render edit form in preview mode
  if (preview) {
    return (
      <Card>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
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
            <p className="text-gray-200">{content}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (isEditing) {
    return (
      <Card>
        <div className="space-y-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-3 bg-gray-800/50 rounded-lg text-white"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-3 bg-gray-800/50 rounded-lg text-white"
            rows="4"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                await updateFunFact(id, { title: editTitle, content: editContent });
                setIsEditing(false);
              }}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
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
        <h3 className="text-xl font-bold text-white">{title}</h3>
        {!isLocked && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this fun fact?')) {
                  deleteFunFact(id);
                }
              }}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Delete
            </button>
          </div>
        )}
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
          <p className="text-gray-200">{content}</p>
        </div>
      </div>
    </Card>
  );
};

export default LegacyCard;