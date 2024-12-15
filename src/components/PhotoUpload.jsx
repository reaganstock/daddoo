import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const PhotoUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };

      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setSelectedImage({
          preview: reader.result,
          file: compressedFile
        });
      };
      
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error compressing image:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage.file);
      formData.append('description', description);

      // Here you would typically send the formData to your backend
      // For now, we'll just simulate a successful upload
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSelectedImage(null);
      setDescription('');
      alert('Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error uploading photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-6">
      <h3 className="text-2xl font-bold text-white mb-4">Add a Memory</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white mb-2">Select Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="w-full text-white"
          />
        </div>

        {selectedImage && (
          <div className="relative">
            <img
              src={selectedImage.preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg cursor-pointer"
              onClick={() => setModalIsOpen(true)}
            />
          </div>
        )}

        <div>
          <label className="block text-white mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded-lg bg-white/20 text-white"
            rows="3"
          />
        </div>

        <button
          type="submit"
          disabled={!selectedImage || uploading}
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </form>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="max-w-4xl mx-auto mt-20 bg-black rounded-lg outline-none"
        overlayClassName="fixed inset-0 bg-black/90 flex items-center justify-center"
      >
        {selectedImage && (
          <img
            src={selectedImage.preview}
            alt="Full size preview"
            className="w-full h-auto rounded-lg"
          />
        )}
      </Modal>
    </div>
  );
};

export default PhotoUpload;