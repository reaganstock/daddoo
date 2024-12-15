import React, { useState, useRef } from 'react';
import ReactModal from 'react-modal';
import SignatureCanvas from 'react-signature-canvas';
import { v4 as uuidv4 } from 'uuid';
import useTributeStore from '../../store/tributeStore';

const AddTributeModal = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const signaturePadRef = useRef();
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const addTribute = useTributeStore((state) => state.addTribute);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() || !author.trim()) return;

    const signature = signaturePadRef.current?.getTrimmedCanvas().toDataURL();
    const audioUrl = audioBlob ? URL.createObjectURL(audioBlob) : null;

    const tribute = {
      id: uuidv4(),
      content: content.trim(),
      author: author.trim(),
      signature,
      audio: audioUrl,
      date: new Date().toISOString()
    };

    addTribute(tribute);
    setContent('');
    setAuthor('');
    setAudioBlob(null);
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
    onClose();
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
          <div className="space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 bg-gray-800/50 rounded-lg text-white text-lg"
              rows="8"
              required
            />
            
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

        <div className="flex justify-end gap-6 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 bg-gray-600 rounded-lg text-white text-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!content.trim() || !author.trim()}
            className="px-8 py-3 bg-purple-600 rounded-lg text-white text-lg hover:bg-purple-700 disabled:opacity-50"
          >
            Add Tribute
          </button>
        </div>
      </form>
    </ReactModal>
  );
};

export default AddTributeModal;