import React, { useState } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import useMemoryStore from '../../store/memoryStore';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import { toast } from 'react-hot-toast';

const formatDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '';
    return format(date, 'MMMM dd, yyyy');
  } catch (error) {
    return '';
  }
};

const MemoryCard = ({ memory, isPreview }) => {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(memory.title);
  const [editContent, setEditContent] = useState(memory.content);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { deleteMemory, updateMemory } = useMemoryStore();

  React.useEffect(() => {
    if (!isPreview) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setCurrentUser(user);
      });
    }
  }, [isPreview]);

  const handleSave = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setIsLoading(true);
    const result = await updateMemory(memory.id, {
      title: editTitle,
      content: editContent,
      image_url: memory.image_url
    });
    setIsLoading(false);

    if (result.success) {
      toast.success('Memory updated successfully');
      setIsEditing(false);
    } else {
      toast.error(result.error || 'Failed to update memory');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this memory?')) {
      return;
    }

    setIsLoading(true);
    const result = await deleteMemory(memory.id);
    setIsLoading(false);

    if (result.success) {
      toast.success('Memory deleted successfully');
    } else {
      toast.error(result.error || 'Failed to delete memory');
    }
  };

  const handleMediaClick = () => {
    setIsFullScreen(true);
  };

  // Full screen overlay
  if (isFullScreen && memory.image_url) {
    return (
      <div 
        className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center cursor-pointer"
        onClick={() => setIsFullScreen(false)}
      >
        {memory.image_url.endsWith('.mp4') ? (
          <video
            src={memory.image_url}
            controls
            autoPlay
            className="max-h-screen max-w-screen-lg"
          />
        ) : (
          <img
            src={memory.image_url}
            alt={memory.title}
            className="max-h-screen max-w-screen-lg object-contain"
          />
        )}
      </div>
    );
  }

  // Early return for preview mode
  if (isPreview) {
    return (
      <Card>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{memory.title}</h3>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {memory.image_url && (
            <div className="w-full md:w-1/2 cursor-pointer" onClick={handleMediaClick}>
              {memory.image_url.endsWith('.mp4') ? (
                <video
                  src={memory.image_url}
                  controls
                  className="rounded-lg shadow-xl w-full"
                />
              ) : (
                <img
                  src={memory.image_url}
                  alt={memory.title}
                  className="rounded-lg shadow-xl w-full"
                />
              )}
            </div>
          )}
          <div className={`w-full ${memory.image_url ? 'md:w-1/2' : ''}`}>
            <p className="text-gray-200 whitespace-pre-wrap">{memory.content}</p>
            <div className="mt-4 text-gray-400">
              <span>{formatDate(memory.created_at)}</span>
            </div>
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
            placeholder="Title"
            disabled={isLoading}
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-3 bg-gray-800/50 rounded-lg text-white"
            rows="4"
            placeholder="Content"
            disabled={isLoading}
          />
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-600 rounded-lg text-white hover:bg-gray-700 disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{memory.title}</h3>
        {currentUser && currentUser.email === memory.user_email && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-400 hover:text-blue-300 disabled:opacity-50"
              disabled={isLoading}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-red-400 hover:text-red-300 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {memory.image_url && (
          <div className="w-full md:w-1/2 cursor-pointer" onClick={handleMediaClick}>
            {memory.image_url.endsWith('.mp4') ? (
              <video
                src={memory.image_url}
                controls
                className="rounded-lg shadow-xl w-full"
              />
            ) : (
              <img
                src={memory.image_url}
                alt={memory.title}
                className="rounded-lg shadow-xl w-full"
              />
            )}
          </div>
        )}
        <div className={`w-full ${memory.image_url ? 'md:w-1/2' : ''}`}>
          <p className="text-gray-200 whitespace-pre-wrap">{memory.content}</p>
          <div className="mt-4 text-gray-400">
            <span>Added by {memory.user_email || 'Anonymous'}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(memory.created_at)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MemoryCard;