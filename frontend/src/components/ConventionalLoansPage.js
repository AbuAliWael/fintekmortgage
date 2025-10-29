import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QualificationForm from './QualificationForm';
import ComplianceFooter from './ComplianceFooter';

const ConventionalLoansPage = () => {
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

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Conventional Loans</h1>
          <p className="text-xl text-blue-100">Flexible Options for Qualified Buyers</p>
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
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What is a Conventional Loan?</h2>
          <p className="text-lg text-gray-700 mb-4">Conventional loans are mortgages not backed by a government agency. They offer flexibility in property types and can be used for primary residences, second homes, or investment properties.</p>
          <p className="text-lg text-gray-700">With competitive rates and the potential to eliminate mortgage insurance, conventional loans are ideal for borrowers with good credit and stable income.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Benefits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start"><div className="bg-green-100 rounded-full p-3 mr-4"><svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div><div><h3 className="text-xl font-semibold mb-2">Low Down Payment</h3><p className="text-gray-600">As low as 3% down for qualified buyers</p></div></div>
            <div className="flex items-start"><div className="bg-green-100 rounded-full p-3 mr-4"><svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div><div><h3 className="text-xl font-semibold mb-2">No PMI at 20%</h3><p className="text-gray-600">Eliminate mortgage insurance with 20% down</p></div></div>
            <div className="flex items-start"><div className="bg-green-100 rounded-full p-3 mr-4"><svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div><div><h3 className="text-xl font-semibold mb-2">Property Flexibility</h3><p className="text-gray-600">Primary, second home, or investment property</p></div></div>
            <div className="flex items-start"><div className="bg-green-100 rounded-full p-3 mr-4"><svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div><div><h3 className="text-xl font-semibold mb-2">Competitive Rates</h3><p className="text-gray-600">Best rates for borrowers with strong credit</p></div></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Requirements</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4"><h3 className="text-xl font-semibold mb-2">Credit Score</h3><ul className="list-disc list-inside text-gray-700 space-y-1"><li>Minimum 620 credit score required</li><li>740+ gets best rates and terms</li><li>Strong credit history preferred</li></ul></div>
            <div className="border-l-4 border-blue-600 pl-4"><h3 className="text-xl font-semibold mb-2">Down Payment</h3><ul className="list-disc list-inside text-gray-700 space-y-1"><li>3% minimum for primary residence</li><li>10% minimum for second homes</li><li>15-25% for investment properties</li></ul></div>
            <div className="border-l-4 border-blue-600 pl-4"><h3 className="text-xl font-semibold mb-2">Income & Employment</h3><ul className="list-disc list-inside text-gray-700 space-y-1"><li>Steady employment (2+ years typical)</li><li>Tax returns and W-2s required</li><li>Debt-to-income ratio up to 50%</li><li>Verifiable income documentation</li></ul></div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2025 Loan Limits</h2>
          <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Conforming Limit:</span> $806,500</p>
          <p className="text-lg text-gray-700"><span className="font-semibold">High-Cost Areas:</span> Higher limits apply</p>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-4">Why Choose Wael for Conventional Loans?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div><h3 className="text-xl font-semibold mb-2">✓ Competitive Rates</h3><p>Access to multiple lenders for best terms</p></div>
            <div><h3 className="text-xl font-semibold mb-2">✓ Fast Closing</h3><p>Average 23-day close time</p></div>
            <div><h3 className="text-xl font-semibold mb-2">✓ Expert Guidance</h3><p>Licensed Mortgage Broker at Barrett Financial Group</p></div>
            <div><h3 className="text-xl font-semibold mb-2">✓ Multilingual</h3><p>English, Arabic, Spanish, Italian</p></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Pre-Approved?</h2>
          <p className="text-xl text-gray-600 mb-6">Let's find the perfect conventional loan for your needs!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://calendly.com/waelabdali/30min" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-semibold">Schedule Consultation</a>
            <a href="https://181106.my1003app.com/2171794/register?time=1742858528979" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md text-lg font-semibold">Apply Now</a>
          </div>
        </div>
        </>
        ) : (
          <QualificationForm loanType="conventional" />
        )}
      </div>
    </div>
  );
};

export default ConventionalLoansPage;