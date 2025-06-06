import React, { useState } from 'react';
import axios from 'axios';
import './TextAnalysis.css';

function TextAnalysis() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/analyze', { text });
      setResult(response.data);
    } catch (error) {
      console.error("Error analyzing text:", error);
      setResult({
        is_scam: null,
        error: "Failed to analyze text. Make sure the backend server is running."
      });
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🛡️ Anti-Scam & Misinformation Agent</h1>
        <p>Enter any text below to check if it's a potential scam.</p>
      </header>
      <main>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text here..."
          rows="10"
          cols="80"
        />
        <button onClick={handleAnalyze} disabled={loading || !text}>
          {loading ? 'Analyzing...' : 'Analyze Text'}
        </button>
        {result && (
          <div className="result">
            <h2>Analysis Result</h2>
            {result.error ? (
              <p className="error">{result.error}</p>
            ) : (
              <>
                <p className={result.is_scam ? 'scam' : 'legitimate'}>
                  {result.is_scam ? '🚨 Potential Scam Detected! 🚨' : '✅ This text seems legitimate.'}
                </p>
                <p><strong>Explanation:</strong> {result.explanation}</p>
                <p><strong>Score:</strong> {result.score.toFixed(2)}</p>
                {result.found_keywords && result.found_keywords.length > 0 && (
                  <p><strong>Flagged Keywords:</strong> {result.found_keywords.join(', ')}</p>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default TextAnalysis;
