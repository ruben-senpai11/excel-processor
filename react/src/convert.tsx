import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = 
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

const PdfExtractor: React.FC = () => {
  const [textContent, setTextContent] = useState<string>("");
  const [collection, setCollection] = useState<Array<{ key: string; value: string }>>([]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    const pdfData = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

    let extractedText = "";
    const extractedCollection: Array<{ key: string; value: string }> = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContentData = await page.getTextContent();

      textContentData.items.forEach((item) => {
        if ("str" in item) extractedText += (item as any).str + " ";
      });
    }

    setTextContent(extractedText);

    
    extractedText.split("\n").forEach((line) => {
      const fields = line.split(":"); // Example delimiter
      if (fields.length === 2) {
        extractedCollection.push({
          key: fields[0].trim(),
          value: fields[1].trim(),
        });
      }
    });

    setCollection(extractedCollection);
  };

  return (
    <div>
      <h1>PDF Data Extraction</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <h2>Extracted Text:</h2>
      <pre>{textContent}</pre>
      <h2>Data Collection:</h2>
      <ul>
        {collection.map((item, index) => (
          <li key={index}>
            <strong>{item.key}:</strong> {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PdfExtractor;
