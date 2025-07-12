import React, { useState } from 'react';
import './VoiceAnalysis.css';
import API_URL from '../apiConfig';

function VoiceAnalysis() {
    const [file, setFile] = useState(null);
    const [transcript, setTranscript] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [transcriptExpanded, setTranscriptExpanded] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('audio/')) {
            setFile(selectedFile);
            setError(null);
        } else {
            setError('Please select a valid audio file');
            setFile(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setError('Please select an audio file');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('audio', file);

            const transcriptResponse = await fetch(`${API_URL}/api/transcribe`, {
                method: 'POST',
                body: formData,
            });

            if (!transcriptResponse.ok) {
                const errData = await transcriptResponse.json();
                throw new Error(errData.error || 'Failed to transcribe audio');
            }

            const transcriptData = await transcriptResponse.json();
            setTranscript(transcriptData.transcript);

            const analysisResponse = await fetch(`${API_URL}/api/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: transcriptData.transcript }),
            });

            if (!analysisResponse.ok) {
                const errData = await analysisResponse.json();
                throw new Error(errData.error || 'Failed to analyze transcript');
            }

            const analysisResult = await analysisResponse.json();
            setResult(analysisResult);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <title>Voice & Audio Analysis Tool - ATLAS Scam Protection</title>
            <meta name="description" content="Analyze suspicious voicemails and audio files (MP3, WAV, M4A). ATLAS transcribes the audio and scans the text for potential scam patterns and keywords." />
            <div className="voice-analysis-container">
                <h1>Voice Analysis</h1>
                <p className="description">
                    Upload an audio file to analyze it for potential scams. We'll transcribe the audio and check it against our scam detection database.
                </p>

                <form onSubmit={handleSubmit} className="upload-form">
                    <div className="file-upload-container">
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={handleFileChange}
                            className="file-input"
                            id="audio-file"
                        />
                        <label htmlFor="audio-file" className="file-label">
                            {file ? file.name : 'Choose Audio File'}
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        className="analyze-button"
                        disabled={!file || isLoading}
                    >
                        {isLoading ? 'Analyzing...' : 'Analyze Audio'}
                    </button>
                </form>

                {error && <p className="error-message">{error}</p>}

                {transcript && (
                    <div className="transcript-container">
                        <h2>Transcript</h2>
                        <div
                            className={`transcript-text${transcriptExpanded ? ' expanded' : ''}`}
                            style={{
                                maxHeight: transcriptExpanded ? 'none' : '6em',
                                overflow: transcriptExpanded ? 'visible' : 'hidden',
                                position: 'relative',
                                transition: 'max-height 0.3s ease'
                            }}
                        >
                            {transcript}
                        </div>
                        {transcript.length > 200 && (
                            <button
                                className="toggle-transcript-btn"
                                onClick={() => setTranscriptExpanded((prev) => !prev)}
                            >
                                {transcriptExpanded ? 'Show less' : 'Show more'}
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
                                                ? '⚠️ This audio seems suspicious. Please use caution.'
                                                : '✅ This audio seems legitimate.'
                                    }
                                </p>
                                <p>
                                    <strong>Score:</strong> {result.score.toFixed(2)}
                                    <span 
                                        className="tooltip-trigger" 
                                        data-tooltip="This score combines a similarity analysis (out of 10) with a cumulative score based on any high-risk keywords found in the text."
                                    >
                                        ℹ️
                                    </span>
                                </p>
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

export default VoiceAnalysis; 