import React, { useState } from 'react';
import axios from 'axios';
import './TextAnalysis.css';
import API_URL from '../apiConfig';

function TextAnalysis() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post(`${API_URL}/api/analyze`, { text });
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
    <>
      <title>Text Analysis Tool - ATLAS Scam Protection</title>
      <meta name="description" content="Received a suspicious email or text message? Paste it into the ATLAS Text Analysis tool to instantly scan for phishing links, scam language, and other risks." /> 
      <div className="text-analysis-container">
        <h1>Text Analysis</h1>
        <p className="description">
          Paste any suspicious text, from a questionable email to a weird text message. Our AI will instantly scan it for high-risk keywords, phishing language, and other red flags.
        </p>
        <main className="analysis-box">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text here..."
            rows="10"
          />
          <button onClick={handleAnalyze} disabled={loading || !text}>
            {loading ? 'Analyzing...' : 'Analyze Text'}
          </button>
        </main>
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
                      ? '⚠️ This text seems suspicious. Please use caution.'
                      : '✅ This text seems legitimate.'
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
        <div className="flex min-h-screen item-center justify-center">
          <section className="info-section max-w-2xl text-center">
            <h3>The Dangers of Text-Based Scams</h3>
            <p>
            Text-based scams, including phishing emails and smishing (SMS phishing), are becoming increasingly sophisticated and prevalent in our digital lives. Scammers leverage urgent language, enticing offers, and impersonation of trusted entities to trick individuals into revealing sensitive information or sending money. Staying vigilant and using tools like ATLAS are crucial steps in protecting yourself from financial loss and identity theft.
          </p>
        </section>
        </div>
      </div>
    </>
  );
}

export default TextAnalysis;
