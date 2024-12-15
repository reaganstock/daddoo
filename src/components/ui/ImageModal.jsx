import React from 'react';
import Modal from 'react-modal';

const ImageModal = ({ isOpen, onClose, image, alt }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="max-w-[90vw] max-h-[90vh] mx-auto mt-[5vh] bg-transparent outline-none"
      overlayClassName="fixed inset-0 bg-black/90 flex items-center justify-center cursor-pointer ReactModal__Overlay"
      closeTimeoutMS={200}
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 text-white/80 hover:text-white"
          aria-label="Close modal"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          src={image}
          alt={alt}
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
        />
      </div>
    </Modal>
  );
};

export default ImageModal;