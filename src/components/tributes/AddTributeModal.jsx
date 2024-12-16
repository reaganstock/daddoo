import React, { useState, useRef, useEffect } from 'react';
import ReactModal from 'react-modal';
import SignatureCanvas from 'react-signature-canvas';
import { v4 as uuidv4 } from 'uuid';
import useTributeStore from '../../store/tributeStore';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const modalStyles = {
  content: {
    position: 'relative',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '40rem',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    border: 'none',
    margin: '2rem auto',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    WebkitOverflowScrolling: 'touch',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
    overflowY: 'auto',
    display: 'block'
  }
};

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

      // Only get signature if it's not empty
      if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
        signatureUrl = signaturePadRef.current.toDataURL();
      }

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
      style={modalStyles}
      contentLabel="Add Tribute Modal"
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

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Add Your Tribute</h2>
          <p className="text-white/60">Share your birthday message for Trey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter a title for your tribute"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-1.5">
              Message
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Write your birthday message here"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-1.5">
              Voice Message (Optional)
            </label>
            <div className="space-y-2">
              {!audioBlob && (
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-full px-4 py-3 rounded-lg transition-colors ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-purple-500 hover:bg-purple-600'
                  } text-white`}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
              )}
              {audioBlob && (
                <div className="space-y-2">
                  <AudioPlayer
                    src={URL.createObjectURL(audioBlob)}
                    className="rounded-lg overflow-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setAudioBlob(null)}
                    className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Delete Recording
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-1.5">
              Signature (Optional)
            </label>
            <div className="bg-white rounded-lg overflow-hidden">
              <SignatureCanvas
                ref={signaturePadRef}
                canvasProps={{
                  className: 'w-full h-40'
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => signaturePadRef.current?.clear()}
              className="mt-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Clear Signature
            </button>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            Submit Tribute
          </button>
        </form>
      </div>
    </ReactModal>
  );
};

export default AddTributeModal;