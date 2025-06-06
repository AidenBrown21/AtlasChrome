import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TextAnalysis from './pages/TextAnalysis';
import VoiceAnalysis from './pages/VoiceAnalysis';
import ImageAnalysis from './pages/ImageAnalysis';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import ContactPage from './pages/ContactPage';
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
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App; 