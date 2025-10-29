import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QualificationForm from './QualificationForm';

const NonQMLoansPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-800 font-semibold">← Back to Home</button>
            <a href="https://181106.my1003app.com/2171794/register?time=1742858528979" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold">Apply Now</a>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Non-QM Loans</h1>
          <p className="text-xl text-blue-100">No Tax Returns. No Income Verification. Big Down Payment Required.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`${
                  activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-lg`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('qualify')}
                className={`${
                  activeTab === 'qualify'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-lg`}
              >
                See If I Qualify
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <>
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-6 mb-8">
          <div className="flex items-start">
            <svg className="w-8 h-8 text-yellow-600 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div><h3 className="text-xl font-bold text-yellow-900 mb-2">IMPORTANT: Large Down Payment Required</h3><p className="text-yellow-800 text-lg">This program requires a <span className="font-bold">minimum 20% down payment</span> to eliminate mortgage insurance. Perfect for those who've worked hard to build savings but don't have traditional income documentation.</p></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What is a Non-QM Loan?</h2>
          <p className="text-lg text-gray-700 mb-4">Non-QM (Non-Qualified Mortgage) loans are designed for creditworthy borrowers who don't fit traditional lending guidelines. If you've built strong credit and substantial savings but lack traditional income verification, this program is for you.</p>
          <p className="text-lg text-gray-700 mb-4 font-semibold text-blue-600">✓ NO Tax Returns Required</p>
          <p className="text-lg text-gray-700 mb-4 font-semibold text-blue-600">✓ NO Traditional Income Verification</p>
          <p className="text-lg text-gray-700 font-semibold text-red-600">✗ MUST Have 20%+ Down Payment & 660+ Credit Score</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Who Benefits from Non-QM Loans?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg"><h3 className="text-xl font-semibold mb-3 text-blue-900">💼 Self-Employed Professionals</h3><p className="text-gray-700">Business owners, freelancers, contractors with fluctuating income</p></div>
            <div className="bg-blue-50 p-6 rounded-lg"><h3 className="text-xl font-semibold mb-3 text-blue-900">💰 Cash-Based Earners</h3><p className="text-gray-700">Those with income that's hard to document traditionally</p></div>
            <div className="bg-blue-50 p-6 rounded-lg"><h3 className="text-xl font-semibold mb-3 text-blue-900">🏢 Real Estate Investors</h3><p className="text-gray-700">Portfolio lenders needing flexible income verification</p></div>
            <div className="bg-blue-50 p-6 rounded-lg"><h3 className="text-xl font-semibold mb-3 text-blue-900">📊 Strong Savers</h3><p className="text-gray-700">Those who've built substantial down payment funds</p></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Requirements</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-purple-600 pl-4 bg-purple-50 p-4"><h3 className="text-xl font-semibold mb-2 text-purple-900">Credit Score (CRITICAL)</h3><ul className="list-disc list-inside text-gray-700 space-y-1"><li className="font-semibold">Minimum 660 credit score required</li><li>Higher scores get better rates</li><li>Strong credit history essential</li></ul></div>
            <div className="border-l-4 border-purple-600 pl-4 bg-purple-50 p-4"><h3 className="text-xl font-semibold mb-2 text-purple-900">Down Payment (CRITICAL)</h3><ul className="list-disc list-inside text-gray-700 space-y-1"><li className="font-semibold">Minimum 20% down payment REQUIRED</li><li>This eliminates mortgage insurance (PMI)</li><li>Larger down payment = better terms</li><li>Must show source of funds</li></ul></div>
            <div className="border-l-4 border-purple-600 pl-4 bg-green-50 p-4"><h3 className="text-xl font-semibold mb-2 text-green-900">Income Verification (FLEXIBLE!)</h3><ul className="list-disc list-inside text-gray-700 space-y-1"><li className="font-semibold text-green-700">✓ NO Tax Returns Required</li><li className="font-semibold text-green-700">✓ NO W-2s Required</li><li className="font-semibold text-green-700">✓ NO Pay Stubs Required</li><li>Bank statements for 12-24 months may be used</li><li>Alternative documentation accepted</li></ul></div>
            <div className="border-l-4 border-purple-600 pl-4"><h3 className="text-xl font-semibold mb-2">Debt-to-Income Ratio</h3><ul className="list-disc list-inside text-gray-700 space-y-1"><li>Maximum 50% DTI ratio</li><li>Lower DTI gets better rates</li></ul></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900 to-blue-900 text-white rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6">Why Wael Specializes in Non-QM Loans</h2>
          <p className="text-lg mb-6">As a Licensed Mortgage Broker at Barrett Financial Group, I understand that success isn't always measured by tax returns. If you've built excellent credit and substantial savings through hard work, I can help you achieve homeownership.</p>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 mb-6"><h3 className="text-2xl font-bold mb-4">My Unique Approach:</h3><p className="text-lg mb-4">I specialize in helping clients who <span className="font-bold text-yellow-300">don't have 2 years of verified employment</span> but have:</p><ul className="space-y-2 text-lg"><li className="flex items-center"><svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Strong credit score (660+)</li><li className="flex items-center"><svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Substantial down payment (20%+)</li><li className="flex items-center"><svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Proven financial responsibility</li></ul></div>
          <div className="grid md:grid-cols-2 gap-4"><div><h3 className="text-xl font-semibold mb-2">✓ Non-QM Expert</h3><p>Specialized knowledge of alternative lending</p></div><div><h3 className="text-xl font-semibold mb-2">✓ Fast Processing</h3><p>Average 23-day close time</p></div><div><h3 className="text-xl font-semibold mb-2">✓ Multilingual</h3><p>English, Arabic, Spanish, Italian</p></div><div><h3 className="text-xl font-semibold mb-2">✓ Personal Service</h3><p>Direct access to decision-maker</p></div></div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Explore Non-QM Options?</h2>
          <p className="text-xl text-gray-600 mb-6">If you have strong credit (660+) and 20%+ down payment, let's talk!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://calendly.com/waelabdali/30min" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-semibold">Schedule Consultation</a>
            <a href="https://181106.my1003app.com/2171794/register?time=1742858528979" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md text-lg font-semibold">Apply Now</a>
          </div>
          <p className="text-sm text-gray-600 mt-4">NMLS #2171794 | Licensed Mortgage Broker | Barrett Financial Group</p>
        </div>
        </>
        ) : (
          <QualificationForm loanType="nonqm" />
        )}
      </div>
    </div>
  );
};

export default NonQMLoansPage;