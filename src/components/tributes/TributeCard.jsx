import React, { useState } from 'react';
import useTributeStore from '../../store/tributeStore';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import toast from 'react-hot-toast';

const TributeCard = ({ tribute, isEditable }) => {
  const { deleteTribute, updateTribute } = useTributeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(tribute.content);
  const [editedTitle, setEditedTitle] = useState(tribute.title);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(tribute.content);
    setEditedTitle(tribute.title);
  };

  const handleSave = async () => {
    try {
      const result = await updateTribute(tribute.id, {
        content: editedContent,
        title: editedTitle
      });
      
      if (result.success) {
        setIsEditing(false);
        toast.success('Tribute updated successfully!');
      } else {
        toast.error(result.error || 'Failed to update tribute');
      }
    } catch (error) {
      console.error('Error updating tribute:', error);
      toast.error('Failed to update tribute');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(tribute.content);
    setEditedTitle(tribute.title);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this tribute?')) {
      try {
        const result = await deleteTribute(tribute.id);
        if (result.success) {
          toast.success('Tribute deleted successfully!');
        } else {
          toast.error(result.error || 'Failed to delete tribute');
        }
      } catch (error) {
        console.error('Error deleting tribute:', error);
        toast.error('Failed to delete tribute');
      }
    }
  };

  const formatContent = (content) => {
    return content.split('\n').map((line, index) => {
      if (line.includes('I pray that')) {
        return (
          <p key={index} className="text-xl italic text-white/90 my-6">
            {line}
          </p>
        );
      }
      return (
        <p key={index} className="text-white/90 text-lg mb-4">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-xl">
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 bg-gray-800/50 rounded text-white text-xl"
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 bg-gray-800/50 rounded text-white min-h-[200px]"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-4xl font-playfair text-white mb-8">{tribute.title}</h2>
          <div className="space-y-4">
            {formatContent(tribute.content)}
            {tribute.audio_url && (
              <div className="mt-6">
                <AudioPlayer
                  src={tribute.audio_url}
                  customAdditionalControls={[]}
                  className="rounded-lg overflow-hidden bg-white/5"
                  autoPlay={false}
                  autoPlayAfterSrcChange={false}
                />
              </div>
            )}
            {tribute.signature_url && (
              <div className="mt-6">
                <img 
                  src={tribute.signature_url} 
                  alt="Signature" 
                  className="max-h-24 bg-white rounded-lg p-2"
                />
              </div>
            )}
          </div>
          {isEditable && (
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleEdit}
                className="text-indigo-300 hover:text-indigo-200 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-300 hover:text-red-200 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TributeCard;