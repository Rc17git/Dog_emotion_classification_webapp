import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [emotionResult, setEmotionResult] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Display the selected image
    resizeAndDisplayImage(file);
  };

  const resizeAndDisplayImage = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const maxWidth = 400; // Set your desired max width
        const scale = maxWidth / img.width;
        const height = img.height * scale;

        canvas.width = maxWidth;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, maxWidth, height);

        const resizedImage = canvas.toDataURL('image/jpeg');
        setUploadedImage(resizedImage);
      };
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post('http://localhost:8000/uploadfile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response from server:', response.data);

      setEmotionResult(response.data.emotion_label);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    console.log('Emotion Result in useEffect:', emotionResult);
  }, [emotionResult]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f0f0f0' }}>
      <h1 style={{ marginBottom: '20px', color: '#333' }}>Dog Emotion Prediction</h1>
      <input type="file" onChange={handleFileChange} style={{ marginBottom: '20px' }} />
      {uploadedImage && <img src={uploadedImage} alt="Uploaded" style={{ marginBottom: '20px', maxWidth: '100%' }} />}
      <button onClick={handleSubmit} style={{ backgroundColor: '#61dafb', color: '#fff', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Upload and Predict</button>
      {emotionResult && <p style={{ marginTop: '20px', fontSize: '18px', color: '#333' }}>The Doggo is : {emotionResult}</p>}
    </div>
  );
};

export default App;
