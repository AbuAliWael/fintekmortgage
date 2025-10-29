import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QualificationForm from './QualificationForm';

const FirstTimeBuyerPage = () => {
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

      <div className="bg-gradient-to-r from-green-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4">🏡</span>
            <h1 className="text-4xl md:text-5xl font-bold">First-Time Homebuyer Programs</h1>
          </div>
          <p className="text-xl text-blue-100">Your Path to Homeownership Starts Here</p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-6">First-Time Homebuyer Guide</h2>
          <p className="text-lg text-gray-700 mb-4">Buying your first home is an exciting milestone! As a first-time homebuyer, you have access to special programs, lower down payments, and expert guidance to make the process smooth and affordable.</p>
          <p className="text-lg text-gray-700">Whether you're looking at FHA, VA (if you're a veteran), conventional loans, or special state programs, I'll help you find the best path to homeownership.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Best Programs for First-Time Buyers</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-green-600 pl-6 bg-green-50 p-6">
              <h3 className="text-2xl font-semibold mb-3">FHA Loans - Most Popular</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg">
                <li><span className="font-semibold">3.5% down payment</span> with 600+ credit score</li>
                <li>Flexible credit requirements (600+ accepted)</li>
                <li>Gift funds allowed from family</li>
                <li>Higher DTI allowed (up to 55%)</li>
                <li>Perfect for those with limited savings</li>
              </ul>
              <a href="/loans/fha" className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-semibold">Learn More About FHA →</a>
            </div>

            <div className="border-l-4 border-blue-600 pl-6 bg-blue-50 p-6">
              <h3 className="text-2xl font-semibold mb-3">Conventional 97 Program</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg">
                <li><span className="font-semibold">3% down payment</span> option</li>
                <li>620+ credit score required</li>
                <li>Lower mortgage insurance than FHA</li>
                <li>Can cancel PMI at 20% equity</li>
                <li>Income limits may apply</li>
              </ul>
              <a href="/loans/conventional" className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-semibold">Learn More About Conventional →</a>
            </div>

            <div className="border-l-4 border-red-600 pl-6 bg-red-50 p-6">
              <h3 className="text-2xl font-semibold mb-3">VA Loans - Veterans Only</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg">
                <li><span className="font-semibold">$0 down payment</span> - 100% financing</li>
                <li>No mortgage insurance required</li>
                <li>Best rates available</li>
                <li>Must be veteran, active duty, or eligible spouse</li>
              </ul>
              <a href="/loans/va" className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-semibold">Learn More About VA →</a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">First-Time Buyer Steps</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4"><span className="text-3xl font-bold text-green-600 mr-4">1</span><h3 className="text-xl font-semibold">Get Pre-Approved</h3></div>
              <p className="text-gray-700">Know your budget and show sellers you're serious. Takes 48 hours or less.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4"><span className="text-3xl font-bold text-green-600 mr-4">2</span><h3 className="text-xl font-semibold">Save for Down Payment</h3></div>
              <p className="text-gray-700">As low as 3.5% with FHA, or use gift funds from family members.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4"><span className="text-3xl font-bold text-green-600 mr-4">3</span><h3 className="text-xl font-semibold">Choose Your Home</h3></div>
              <p className="text-gray-700">Work with a real estate agent to find properties in your budget.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4"><span className="text-3xl font-bold text-green-600 mr-4">4</span><h3 className="text-xl font-semibold">Close on Your Home</h3></div>
              <p className="text-gray-700">Average 23 days from application to keys in hand!</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-4">Why Choose Wael for Your First Home?</h2>
          <p className="text-lg mb-6">As a Licensed Mortgage Broker at Barrett Financial Group, I specialize in helping first-time buyers navigate the home buying process with confidence.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div><h3 className="text-xl font-semibold mb-2">✓ First-Time Buyer Expert</h3><p>Specialized knowledge of all first-time programs</p></div>
            <div><h3 className="text-xl font-semibold mb-2">✓ Patient Guidance</h3><p>I'll explain every step in simple terms</p></div>
            <div><h3 className="text-xl font-semibold mb-2">✓ Fast Closing</h3><p>Average 23-day close time</p></div>
            <div><h3 className="text-xl font-semibold mb-2">✓ Multilingual</h3><p>English, Arabic, Spanish, Italian</p></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Buy Your First Home?</h2>
          <p className="text-xl text-gray-600 mb-6">Let's get you pre-approved and on the path to homeownership!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://calendly.com/waelabdali/30min" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-semibold">Schedule Free Consultation</a>
            <a href="https://181106.my1003app.com/2171794/register?time=1742858528979" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md text-lg font-semibold">Get Pre-Approved</a>
          </div>
          <p className="text-sm text-gray-600 mt-4">NMLS #2171794 | Licensed Mortgage Broker | Barrett Financial Group</p>
        </div>
        </>
        ) : (
          <QualificationForm loanType="firsttimebuyer" />
        )}
      </div>
    </div>
  );
};

export default FirstTimeBuyerPage;