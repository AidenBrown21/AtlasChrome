import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import TextAnalysis from './pages/TextAnalysis';
import VoiceAnalysis from './pages/VoiceAnalysis';
import ImageAnalysis from './pages/ImageAnalysis';
import VisionPage from './pages/VisionPage';
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage';
import WhatsNewPage from './pages/WhatsNewPage';
import './App.css';
import Header from './components/Header'

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/text" element={<TextAnalysis />} />
                        <Route path="/voice" element={<VoiceAnalysis />} />
                        <Route path="/image" element={<ImageAnalysis />} />
                        <Route path="/vision" element={<VisionPage />} />
                        <Route path="/whats-new" element={<WhatsNewPage />} />
                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<DashboardPage />} />
                        </Route>
                        <Route element={<AdminRoute />}>
                            <Route path="/admin" element={<AdminPage />} />
                        </Route>
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App; 