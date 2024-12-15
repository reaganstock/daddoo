import React from 'react';
import Modal from 'react-modal';
import { LoginForm } from './LoginForm';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderRadius: '1rem',
    padding: '2.5rem',
    maxWidth: '32rem',
    width: '90%',
    border: 'none',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
    backdropFilter: 'blur(8px)'
  }
};

Modal.setAppElement('#root'); // Set this to your root element id

interface LoginModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export const LoginModal = ({ isOpen, onRequestClose }: LoginModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Login Modal"
    >
      <div className="relative">
        <button
          onClick={onRequestClose}
          className="absolute -top-2 -right-2 text-white/60 hover:text-white/90 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-white/60">Sign in to continue to the celebration</p>
        </div>
        <LoginForm />
      </div>
    </Modal>
  );
};
