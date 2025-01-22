import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [jsonData, setJsonData] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('pdfFile', selectedFile);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setJsonData(response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
            <h2>Upload PDF and Extract Data</h2>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <button onClick={handleUpload} style={{ marginTop: '10px' }}>
                Upload and Extract
            </button>
            {jsonData && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Extracted Data:</h3>
                    <pre>{JSON.stringify(jsonData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
