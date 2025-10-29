import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QualificationForm from './QualificationForm';

const FHALoansPage = () => {
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">FHA Loans</h1>
          <p className="text-xl text-blue-100">Low Down Payment, Flexible Credit Requirements</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Overview */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What is an FHA Loan?</h2>
          <p className="text-lg text-gray-700 mb-4">
            FHA loans are mortgages backed by the Federal Housing Administration, designed to help Americans achieve homeownership with lower down payments and more flexible credit requirements than conventional loans.
          </p>
          <p className="text-lg text-gray-700">
            Perfect for first-time homebuyers and those with credit scores as low as 600, FHA loans have helped millions of families purchase their dream homes.
          </p>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Benefits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Low Down Payment</h3>
                <p className="text-gray-600">Only 3.5% down with credit score of 600 or higher</p>
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
                <p className="text-gray-600">Credit scores as low as 600 accepted</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">High DTI Allowed</h3>
                <p className="text-gray-600">Debt-to-income ratio up to 55%</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Gift Funds Allowed</h3>
                <p className="text-gray-600">Down payment can come from family gifts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">FHA Loan Requirements</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-xl font-semibold mb-2">Credit Score</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Minimum 600 credit score (industry standard)</li>
                <li>580-599 may qualify with 10% down payment</li>
                <li>Higher scores get better interest rates</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-xl font-semibold mb-2">Down Payment</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>3.5% minimum with 600+ credit score</li>
                <li>10% minimum with 580-599 credit score</li>
                <li>Can use gift funds from family members</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-xl font-semibold mb-2">Income & Employment</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Steady employment history (typically 2 years)</li>
                <li>Tax returns and W-2s required</li>
                <li>Debt-to-income ratio up to 55%</li>
                <li>Must have verifiable income</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-xl font-semibold mb-2">Property Requirements</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Must be your primary residence</li>
                <li>Property must meet FHA standards</li>
                <li>FHA appraisal required</li>
                <li>Occupy within 60 days of closing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Loan Limits */}
        <div className="bg-blue-50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2025 FHA Loan Limits</h2>
          <p className="text-lg text-gray-700 mb-4">
            <span className="font-semibold">Standard Areas:</span> $524,225
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">High-Cost Areas:</span> Up to $1,209,750
          </p>
          <p className="text-sm text-gray-600 mt-4">Limits vary by county. Contact us to find your area's specific limit.</p>
        </div>

        {/* Mortgage Insurance */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Mortgage Insurance (MIP)</h2>
          <p className="text-lg text-gray-700 mb-4">
            FHA loans require mortgage insurance to protect lenders:
          </p>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Upfront MIP</h3>
              <p className="text-gray-700">1.75% of loan amount (can be rolled into loan)</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Annual MIP</h3>
              <p className="text-gray-700">0.45% - 1.05% annually (paid monthly)</p>
            </div>
          </div>
        </div>

        {/* Why Choose Wael */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-4">Why Choose Wael Abdeldayem for Your FHA Loan?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">✓ FHA Loan Expert</h3>
              <p>Specialized knowledge of FHA programs and requirements</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">✓ Fast Approvals</h3>
              <p>Average 23-day close time</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">✓ Multilingual Service</h3>
              <p>English, Arabic, Spanish, and Italian supported</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">✓ Personal Attention</h3>
              <p>Licensed broker at Barrett Financial Group</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-6">
            Let's discuss your FHA loan options and get you pre-approved today!
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
          <p className="text-sm text-gray-600 mt-4">NMLS #2171794 | Licensed Mortgage Broker</p>
        </div>

      </div>
    </div>
  );
};

export default FHALoansPage;
