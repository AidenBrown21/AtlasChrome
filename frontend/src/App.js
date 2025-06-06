import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TextAnalysis from './pages/TextAnalysis';
import VoiceAnalysis from './pages/VoiceAnalysis';
import ImageAnalysis from './pages/ImageAnalysis';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/text" element={<TextAnalysis />} />
                    <Route path="/voice" element={<VoiceAnalysis />} />
                    <Route path="/image" element={<ImageAnalysis />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App; 