import React from 'react';
import useFunFactStore from '../../store/funFactStore';
import { supabase } from '../../lib/supabase';

const FunFactCard = ({ fact, isPreview }) => {
  const [currentUser, setCurrentUser] = React.useState(null);
  const { deleteFunFact, setEditingFunFact } = useFunFactStore();

  React.useEffect(() => {
    if (!isPreview) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setCurrentUser(user);
      });
    }
  }, [isPreview]);

  const handleEdit = () => {
    if (isPreview) return;
    setEditingFunFact(fact);
  };

  const handleDelete = async () => {
    if (isPreview) return;
    if (window.confirm('Are you sure you want to delete this fun fact?')) {
      await deleteFunFact(fact.id);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-xl">
      <h3 className="text-white text-xl font-semibold mb-2">{fact.title}</h3>
      <p className="text-white/90 mb-4">{fact.content}</p>
      {!isPreview && currentUser?.id === fact.user_id && (
        <div className="flex justify-end space-x-2">
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

export default FunFactCard;