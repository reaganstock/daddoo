import React, { useState, useEffect } from 'react';
import { usePreviewStore } from '../../store/previewStore';

interface PreviewCheckProps {
  children: React.ReactNode;
}

const PreviewCheck: React.FC<PreviewCheckProps> = ({ children }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { hasAccess, checkCode } = usePreviewStore();

  useEffect(() => {
    // Clear any existing access on component mount
    if (!hasAccess) {
      setCode('');
      setError('');
    }
  }, [hasAccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkCode(code)) {
      setError('');
    } else {
      setError('Invalid preview code');
      setCode('');
    }
  };

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Dad's Birthday Celebration</h2>
        <p className="text-gray-200 mb-6">Enter the preview code to access the celebration</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-md 
                       text-white placeholder-gray-300 focus:ring-2 focus:ring-white/50 
                       focus:border-white/50"
              autoFocus
            />
            {error && <p className="text-red-300 text-sm mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 
                     rounded-md transition-colors border border-white/30"
          >
            Enter Celebration
          </button>
        </form>
      </div>
    </div>
  );
};

export default PreviewCheck;
