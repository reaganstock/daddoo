import React from 'react';
import useTributeStore from '../../store/tributeStore';

const TributeCard = ({ tribute, isEditable }) => {
  const { deleteTribute, setEditingTribute } = useTributeStore();

  const handleEdit = () => {
    setEditingTribute(tribute);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this tribute?')) {
      await deleteTribute(tribute.id);
    }
  };

  const formatContent = (content) => {
    return content.split('\n').map((line, index) => {
      // Check if the line is the prayer line
      if (line.includes('I pray that')) {
        return (
          <p key={index} className="text-xl italic text-white/90 my-6">
            {line}
          </p>
        );
      }
      // Add spacing between paragraphs
      return (
        <p key={index} className="text-white/90 text-lg mb-4">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-xl">
      <h2 className="text-4xl font-playfair text-white mb-8">{tribute.title}</h2>
      <div className="space-y-4">
        {formatContent(tribute.content)}
      </div>
      <div className="mt-8 text-right">
        <p className="text-2xl italic text-white/90">From {tribute.user_email.split('@')[0]}</p>
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
    </div>
  );
};

export default TributeCard;