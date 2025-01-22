const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const app = express();
app.use(cors());
const upload = multer({ dest: 'uploads/' });

// Function to structure data by repetitive words
const structureData = (text) => {
  const words = text.split(/\s+/); // Split text into words
  const wordFrequency = {};

  // Count word occurrences
  words.forEach((word) => {
    const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, ''); // Remove special characters
    if (cleanWord.length > 2) { // Skip short words
      wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
    }
  });

  // Get repetitive words (threshold: appears more than 3 times)
  const repetitiveWords = Object.keys(wordFrequency).filter((key) => wordFrequency[key] > 3);

  // Group sentences by repetitive words
  const groupedData = {};
  repetitiveWords.forEach((key) => {
    groupedData[key] = []; // Initialize empty array for each key
  });

  const sentences = text.split(/[\n.!?]+/); // Split text into sentences
  sentences.forEach((sentence) => {
    repetitiveWords.forEach((key) => {
      if (sentence.toLowerCase().includes(key)) {
        groupedData[key].push(sentence.trim());
      }
    });
  });

  return groupedData;
};

app.post('/upload', upload.single('pdfFile'), async (req, res) => {
  const filePath = req.file.path;

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(fileBuffer);

    // Structure the data
    const structuredData = structureData(data.text);

    res.json({
      text: data.text,
      structuredData: structuredData, // Indexed collection of sentences grouped by repetitive words
      metadata: data.info, // Original metadata
    });

    fs.unlinkSync(filePath); // Clean up uploaded file
  } catch (error) {
    res.status(500).json({ error: 'Failed to process PDF' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
