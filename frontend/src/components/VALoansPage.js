import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QualificationForm from './QualificationForm';

const VALoansPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-800 font-semibold">
              ← Back to Home
            </button>
            <a
              href="https://181106.my1003app.com/2171794/register?time=1742858528979"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold"
            >
              Apply Now
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4">🇺🇸</span>
            <h1 className="text-4xl md:text-5xl font-bold">VA Loans</h1>
          </div>
          <p className="text-xl text-blue-100">Zero Down Payment for Those Who Served</p>
        </div>
      </div>

      {/* Content */}
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
        
        {/* Overview */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What is a VA Loan?</h2>
          <p className="text-lg text-gray-700 mb-4">
            VA loans are mortgage benefits guaranteed by the U.S. Department of Veterans Affairs for active-duty service members, veterans, and eligible surviving spouses. These loans offer unparalleled advantages including no down payment, no mortgage insurance, and competitive interest rates.
          </p>
          <p className="text-lg text-gray-700">
            It's a way to thank those who served our country by making homeownership more accessible and affordable.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Exclusive Benefits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">$0 Down Payment</h3>
                <p className="text-gray-600">100% financing available - no down payment required</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">No PMI Required</h3>
                <p className="text-gray-600">Save hundreds monthly - no mortgage insurance</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Competitive Rates</h3>
                <p className="text-gray-600">Often lower than conventional loan rates</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">No Loan Limits</h3>
                <p className="text-gray-600">With full entitlement, no maximum loan amount</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Flexible Credit</h3>
                <p className="text-gray-600">More lenient credit requirements</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Reusable Benefit</h3>
                <p className="text-gray-600">Can use multiple times throughout your life</p>
              </div>
            </div>
          </div>
        </div>

        {/* Eligibility */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Who Qualifies?</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-xl font-semibold mb-2">Veterans</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>90 days active duty during wartime</li>
                <li>181 days active duty during peacetime</li>
                <li>Must have honorable discharge</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-xl font-semibold mb-2">Active-Duty Service Members</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>After 90 days of continuous active service</li>
                <li>Currently serving in any branch</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-xl font-semibold mb-2">National Guard & Reserves</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>6 years of creditable service</li>
                <li>Or 90 days of active duty including 30 consecutive days</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-xl font-semibold mb-2">Surviving Spouses</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Spouse of veteran who died in service</li>
                <li>Spouse of veteran who died from service-connected disability</li>
                <li>Must not have remarried (exceptions apply)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-blue-50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">VA Loan Requirements</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Certificate of Eligibility (COE)</h3>
              <p className="text-gray-700">Required to prove your eligibility - we can help you obtain this</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Credit Score</h3>
              <p className="text-gray-700">Typically 620+ preferred (no VA minimum, lender dependent)</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Debt-to-Income Ratio</h3>
              <p className="text-gray-700">Generally 41% or less (flexible with strong compensating factors)</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Property Use</h3>
              <p className="text-gray-700">Must be your primary residence</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Funding Fee</h3>
              <p className="text-gray-700">2.15% - 3.3% (waived for veterans with service-connected disabilities)</p>
            </div>
          </div>
        </div>

        {/* Why Choose Wael */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-4">Wael Abdeldayem: Your VA Loan Partner</h2>
          <p className="text-lg mb-6">
            As a Licensed Mortgage Broker at Barrett Financial Group, I'm honored to help veterans and military families achieve homeownership through VA loans.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">✓ VA Loan Specialist</h3>
              <p>Expert knowledge of VA programs and benefits</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">✓ Fast Processing</h3>
              <p>Average 23-day close time</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">✓ Certificate Assistance</h3>
              <p>Help obtaining your COE quickly</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">✓ Multilingual Support</h3>
              <p>English, Arabic, Spanish, Italian</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Use Your VA Benefits?</h2>
          <p className="text-xl text-gray-600 mb-6">
            Let's honor your service by helping you secure the home you deserve!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://calendly.com/waelabdali/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-semibold"
            >
              Schedule Consultation
            </a>
            <a
              href="https://181106.my1003app.com/2171794/register?time=1742858528979"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md text-lg font-semibold"
            >
              Apply Now
            </a>
          </div>
          <p className="text-sm text-gray-600 mt-4">NMLS #2171794 | Licensed Mortgage Broker | Barrett Financial Group</p>
        </div>

      </div>
    </div>
  );
};

export default VALoansPage;
