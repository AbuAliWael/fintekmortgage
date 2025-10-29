import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '@/App.css';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';
import LeadsPage from '@/components/LeadsPage';
import PipelinePage from '@/components/PipelinePage';
import PartnersPage from '@/components/PartnersPage';
import CalculatorPage from '@/components/CalculatorPage';
import AuthPage from '@/components/AuthPage';
import ChatWidget from '@/components/ChatWidget';
import FHALoansPage from '@/components/FHALoansPage';
import VALoansPage from '@/components/VALoansPage';
import ConventionalLoansPage from '@/components/ConventionalLoansPage';
import NonQMLoansPage from '@/components/NonQMLoansPage';
import FirstTimeBuyerPage from '@/components/FirstTimeBuyerPage';
import RefinancingPage from '@/components/RefinancingPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Optionally verify token with backend
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/loans/fha" element={<FHALoansPage />} />
          <Route path="/loans/va" element={<VALoansPage />} />
          <Route path="/loans/conventional" element={<ConventionalLoansPage />} />
          <Route path="/loans/non-qm" element={<NonQMLoansPage />} />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" /> : 
                <AuthPage onLogin={handleLogin} />
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
                <Dashboard user={user} onLogout={handleLogout} /> : 
                <Navigate to="/login" />
            } 
          />
          <Route 
            path="/leads" 
            element={
              isAuthenticated ? 
                <LeadsPage onLogout={handleLogout} /> : 
                <Navigate to="/login" />
            } 
          />
          <Route 
            path="/pipeline" 
            element={
              isAuthenticated ? 
                <PipelinePage onLogout={handleLogout} /> : 
                <Navigate to="/login" />
            } 
          />
          <Route 
            path="/partners" 
            element={
              isAuthenticated ? 
                <PartnersPage onLogout={handleLogout} /> : 
                <Navigate to="/login" />
            } 
          />
        </Routes>
      </BrowserRouter>
      
      {/* AI Chat Widget - Available on all pages */}
      <ChatWidget showChat={showChat} setShowChat={setShowChat} />
      
      {/* Floating Chat Button */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all z-50"
          data-testid="open-chat-button"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default App;