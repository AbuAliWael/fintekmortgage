import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@/App.css';
import LandingPage from '@/components/LandingPage';
import CalculatorPage from '@/components/CalculatorPage';
import FHALoansPage from '@/components/FHALoansPage';
import ConventionalLoansPage from '@/components/ConventionalLoansPage';
import NonQMLoansPage from '@/components/NonQMLoansPage';
import FirstTimeBuyerPage from '@/components/FirstTimeBuyerPage';
import RefinancingPage from '@/components/RefinancingPage';
import FAQPage from '@/components/FAQPage';
import ApplyPage from '@/components/ApplyPage';
import QualificationPage from '@/components/QualificationPage';
import PreQualForm from '@/components/PreQualForm';
import ReferralLanding from '@/components/ReferralLanding';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/qualify" element={<QualificationPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/loans/non-qm" element={<NonQMLoansPage />} />
          <Route path="/loans/fha" element={<FHALoansPage />} />
          <Route path="/loans/conventional" element={<ConventionalLoansPage />} />
          <Route path="/loans/first-time-buyer" element={<FirstTimeBuyerPage />} />
          <Route path="/loans/refinancing" element={<RefinancingPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/get-started" element={<PreQualForm />} />
          <Route path="/pre-qualify" element={<PreQualForm />} />
          <Route path="/ref/:realtorName" element={<ReferralLanding />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
