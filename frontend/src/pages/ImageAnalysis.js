import React, { useState } from 'react';
import './ImageAnalysis.css';
import API_URL from '../apiConfig';

function ImageAnalysis() {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [extractedText, setExtractedText] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [textExpanded, setTextExpanded] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setError(null);
        } else {
            setError('Please select a valid image file');
            setFile(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setError('Please select an image file');
            return;
        }
        setIsLoading(true);
        setError(null);
        setExtractedText('');
        setResult(null);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const response = await fetch(`${API_URL}/api/image-analyze`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to analyze image');
            }
            const data = await response.json();
            setExtractedText(data.text);
            setResult(data.analysis);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <title>Image Analysis Tool - ATLAS Scam Protection</title>
            <meta name="description" content="Scan screenshots and images for scams. Our OCR technology extracts and analyzes text from any image to detect potential threats and red flags instantly." />
            <div className="image-analysis-container">
                <h1>Image Analysis</h1>
                <p className="description">
                    Upload a screenshot or meme. We'll extract the text and analyze it for scams or fake news patterns.
                </p>
                <form onSubmit={handleSubmit} className="upload-form">
                    <div className="file-upload-container">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="file-input"
                            id="image-file"
                        />
                        <label htmlFor="image-file" className="file-label">
                            {file ? file.name : 'Choose Image File'}
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="analyze-button"
                        disabled={!file || isLoading}
                    >
                        {isLoading ? 'Analyzing...' : 'Analyze Image'}
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>}
                {extractedText && (
                    <div className="transcript-container">
                        <h2>Extracted Text</h2>
                        <div
                            className={`transcript-text${textExpanded ? ' expanded' : ''}`}
                            style={{
                                maxHeight: textExpanded ? 'none' : '6em',
                                overflow: textExpanded ? 'visible' : 'hidden',
                                position: 'relative',
                                transition: 'max-height 0.3s ease'
                            }}
                        >
                            {extractedText}
                        </div>
                        {extractedText.length > 200 && (
                            <button
                                className="toggle-transcript-btn"
                                onClick={() => setTextExpanded((prev) => !prev)}
                            >
                                {textExpanded ? 'Show less' : 'Show more'}
                            </button>
                        )}
                    </div>
                )}
                {result && (
                    <div className="result-container">
                        <h2>Analysis Result</h2>
                        {result.error ? (
                            <p className="error">{result.error}</p>
                        ) : (
                            <>
                                <p className={
                                    result.score > 4.0
                                        ? 'scam'
                                        : result.score > 1.5
                                            ? 'suspicious'
                                            : 'legitimate'
                                }>
                                    {
                                        result.score > 4.0
                                            ? '🚨 Potential Scam Detected! 🚨'
                                            : result.score > 1.5
                                                ? '⚠️ This image seems suspicious. Please use caution.'
                                                : '✅ This image seems legitimate.'
                                    }
                                </p>
                                <p><strong>Score:</strong> {result.score.toFixed(2)}</p>
                                {result.found_keywords && result.found_keywords.length > 0 && (
                                    <p><strong>Flagged Keywords:</strong> {result.found_keywords.join(', ')}</p>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default ImageAnalysis; 