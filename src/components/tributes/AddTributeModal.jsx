import React, { useState, useRef, useEffect } from 'react';
import ReactModal from 'react-modal';
import SignatureCanvas from 'react-signature-canvas';
import { v4 as uuidv4 } from 'uuid';
import useTributeStore from '../../store/tributeStore';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const AddTributeModal = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const signaturePadRef = useRef();
  
  const { addTribute } = useTributeStore();

  const handleClose = () => {
    setContent('');
    setTitle('');
    setAudioBlob(null);
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
    onClose();
  };

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
      toast.error('Error accessing microphone');
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
    if (!content.trim() || !title.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
      toast.error('Please add your signature');
      return;
    }

    try {
      let audioUrl = null;
      let signatureUrl = null;

      if (audioBlob) {
        const reader = new FileReader();
        const base64Promise = new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
        });
        reader.readAsDataURL(audioBlob);
        audioUrl = await base64Promise;
      }

      // Convert signature to base64
      signatureUrl = signaturePadRef.current.toDataURL();

      const tributeData = {
        id: uuidv4(),
        title,
        content,
        audio_url: audioUrl,
        signature_url: signatureUrl,
      };

      const result = await addTribute(tributeData);
      
      if (result.success) {
        toast.success('Tribute added successfully!');
        handleClose();
      } else {
        toast.error(result.error || 'Failed to add tribute');
      }
    } catch (error) {
      console.error('Error saving tribute:', error);
      toast.error('Error saving tribute');
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="max-w-2xl w-full mx-auto mt-20 bg-gray-900 rounded-lg p-6 border border-gray-700"
      overlayClassName="fixed inset-0 bg-black/75 flex items-start justify-center"
    >
      <div className="relative">
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 text-white/60 hover:text-white/90 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Add New Tribute</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter title"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[200px]"
              placeholder="Write your tribute..."
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Audio Message (Optional)</label>
            {!audioBlob && !isRecording && (
              <button
                type="button"
                onClick={startRecording}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Start Recording
              </button>
            )}
            {isRecording && (
              <button
                type="button"
                onClick={stopRecording}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Stop Recording
              </button>
            )}
            {audioBlob && !isRecording && (
              <div className="space-y-2">
                <AudioPlayer
                  src={URL.createObjectURL(audioBlob)}
                  customAdditionalControls={[]}
                  className="rounded-lg overflow-hidden bg-white/5"
                />
                <button
                  type="button"
                  onClick={() => setAudioBlob(null)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove Recording
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-white mb-2">Your Signature</label>
            <div className="bg-white rounded-lg overflow-hidden">
              <SignatureCanvas
                ref={signaturePadRef}
                canvasProps={{
                  className: 'w-full',
                  style: { 
                    width: '100%', 
                    height: '200px',
                    backgroundColor: 'white'
                  }
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => signaturePadRef.current?.clear()}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300"
            >
              Clear Signature
            </button>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add Tribute
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
};

export default AddTributeModal;