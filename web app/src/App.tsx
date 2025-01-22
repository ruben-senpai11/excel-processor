
import axios from 'axios';
import './App.css'
import FileUpload from './components/uploader'
import { useState } from 'react';

function App() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);

  const handleFileChange = (event: any) => {
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
    <>
      {/* <FileUpload /> */}
      <div className="contendor">
        <div className="container">
          <div className="import">
            <p>Veuillez sélectionner le fichier à importer</p>
            {/* <button id="import" type="button">Importer</button> */}
            <input type="file" id="fileInput" accept="application/pdf" onChange={handleFileChange} />
          </div>
          <div className="export">
            <p>Choisissez le chemin de destination</p>
            <button id="export" type="button" onClick={handleUpload} >Exporter</button>
          </div>
        </div>
        {jsonData && (
          <div className="datas">
            <h3>Extracted Data:</h3>
            <pre>{JSON.stringify(jsonData, null, 2)}</pre>
          </div>
        )}
      </div>
    </>
  )
}

export default App
