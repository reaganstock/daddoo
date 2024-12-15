import React, { useState } from 'react';
import ReactModal from 'react-modal';
import useTributeStore from '../../store/tributeStore';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const AddTributeModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const signaturePadRef = useRef();
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const addTribute = useTributeStore((state) => state.addTribute);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter your message');
      return;
    }

    if (!author.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsLoading(true);
    try {
      const signature = signaturePadRef.current?.getTrimmedCanvas().toDataURL();
      const audioUrl = audioBlob ? URL.createObjectURL(audioBlob) : null;

      const tribute = {
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
        signature,
        audio: audioUrl,
        created_at: new Date().toISOString(),
        user_email: currentUser?.email
      };

      const result = await addTribute(tribute);
      if (!result.success) {
        throw new Error(result.error || 'Failed to add tribute');
      }

      toast.success('Tribute added successfully');
      setTitle('');
      setContent('');
      setAuthor('');
      setAudioBlob(null);
      if (signaturePadRef.current) {
        signaturePadRef.current.clear();
      }
      onClose();
    } catch (error) {
      console.error('Error adding tribute:', error);
      toast.error(error.message || 'Failed to add tribute');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="max-w-4xl mx-auto mt-10 bg-gray-900/95 p-12 rounded-lg outline-none"
      overlayClassName="fixed inset-0 bg-black/75 flex items-center justify-center"
    >
      <h2 className="text-4xl font-bold text-white mb-8 text-center">Add a Birthday Tribute</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-white text-xl mb-3">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 bg-gray-800/50 rounded-lg text-white text-lg"
            placeholder="Enter a title for your tribute"
            required
          />
        </div>

        <div>
          <label className="block text-white text-xl mb-3">Your Name</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-4 bg-gray-800/50 rounded-lg text-white text-lg"
            required
          />
        </div>

        <div>
          <label className="block text-white text-xl mb-3">Your Message</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 bg-gray-800/50 rounded-lg text-white text-lg"
            rows="8"
            placeholder="Write your birthday message here..."
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="px-4 py-2 bg-gray-800/50 rounded-lg text-white hover:bg-gray-700/50"
              >
                🎤 Add Voice Message
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="px-4 py-2 bg-red-600/50 rounded-lg text-white hover:bg-red-700/50 animate-pulse"
              >
                ⏹️ Stop Recording
              </button>
            )}
            {audioBlob && (
              <audio src={URL.createObjectURL(audioBlob)} controls className="flex-1 bg-transparent" />
            )}
          </div>
        </div>

        <div>
          <label className="block text-white text-xl mb-3">Your Signature</label>
          <div className="bg-transparent rounded-lg">
            <SignatureCanvas
              ref={signaturePadRef}
              canvasProps={{
                className: "w-full h-40 rounded-lg",
                style: { 
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)'
                }
              }}
              backgroundColor="rgba(0,0,0,0)"
            />
          </div>
          <button
            type="button"
            onClick={() => signaturePadRef.current?.clear()}
            className="mt-2 px-4 py-2 bg-gray-800/50 rounded-lg text-white text-sm hover:bg-gray-700/50"
          >
            Clear Signature
          </button>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Tribute'}
          </button>
        </div>
      </form>
    </ReactModal>
  );
};

export default AddTributeModal;