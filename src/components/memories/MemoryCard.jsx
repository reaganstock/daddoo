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
    console.log('MemoryCard component mounted');
    if (!isPreview) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setCurrentUser(user);
      });
    }
  }, [isPreview]);

  const isOwner = currentUser?.email === memory.user_email;

  const handleSave = async () => {
    console.log('Attempting to save memory:', memory.id);
    console.log('Current user:', currentUser?.email);
    console.log('Memory owner:', memory.user_email);

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

    console.log('Update result:', result);

    if (result.success) {
      toast.success('Memory updated successfully');
      setIsEditing(false);
    } else {
      toast.error(result.error || 'Failed to update memory');
    }
  };

  const handleDelete = async () => {
    console.log('Attempting to delete memory:', memory.id);
    console.log('Current user:', currentUser?.email);
    console.log('Memory owner:', memory.user_email);

    if (!window.confirm('Are you sure you want to delete this memory?')) {
      return;
    }

    setIsLoading(true);
    const result = await deleteMemory(memory.id);
    setIsLoading(false);

    console.log('Delete result:', result);

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

  if (isEditing) {
    return (
      <Card>
        <div className="space-y-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-2 bg-gray-800/50 rounded text-white text-xl"
            placeholder="Memory Title"
            disabled={isLoading}
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 bg-gray-800/50 rounded text-white min-h-[200px]"
            placeholder="Memory Content"
            disabled={isLoading}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
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
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-playfair text-white">{memory.title}</h3>
          {!isPreview && isOwner && (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-indigo-300 hover:text-indigo-200 transition-colors"
                disabled={isLoading}
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-300 hover:text-red-200 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        <div className="text-gray-300 text-sm">
          {formatDate(memory.created_at)}
        </div>

        {memory.image_url && (
          <div 
            className="cursor-pointer transform hover:scale-[1.02] transition-transform duration-300"
            onClick={handleMediaClick}
          >
            {memory.image_url.endsWith('.mp4') ? (
              <video
                src={memory.image_url}
                controls
                className="w-full rounded-lg shadow-xl"
              />
            ) : (
              <img
                src={memory.image_url}
                alt={memory.title}
                className="w-full rounded-lg shadow-xl"
              />
            )}
          </div>
        )}

        <p className="text-gray-200 text-lg whitespace-pre-wrap">{memory.content}</p>
      </div>
    </Card>
  );
};

export default MemoryCard;