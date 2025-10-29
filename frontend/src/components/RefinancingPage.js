import React from 'react';
import { useNavigate } from 'react-router-dom';

const RefinancingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-800 font-semibold">← Back to Home</button>
            <a href="https://181106.my1003app.com/2171794/register?time=1742858528979" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold">Apply to Refinance</a>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Mortgage Refinancing</h1>
          <p className="text-xl text-blue-100">Lower Your Rate, Lower Your Payment, Access Your Equity</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Should You Refinance?</h2>
          <p className="text-lg text-gray-700 mb-4">Refinancing can save you thousands of dollars over the life of your loan by lowering your interest rate, reducing your monthly payment, or accessing your home's equity for important expenses.</p>
          <p className="text-lg text-gray-700">Let's analyze your current loan and see if refinancing makes sense for your financial goals.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Types of Refinancing</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-6 bg-blue-50 p-6">
              <h3 className="text-2xl font-semibold mb-3">Rate & Term Refinance</h3>
              <p className="text-gray-700 mb-3">Lower your interest rate or change your loan term to save money.</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><span className="font-semibold">Lower monthly payments</span> with reduced rate</li>
                <li><span className="font-semibold">Pay off loan faster</span> by shortening term</li>
                <li><span className="font-semibold">Switch from ARM to fixed</span> rate</li>
                <li>No cash out - just better terms</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-600 pl-6 bg-green-50 p-6">
              <h3 className="text-2xl font-semibold mb-3">Cash-Out Refinance</h3>
              <p className="text-gray-700 mb-3">Access your home equity for renovations, debt consolidation, or investments.</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><span className="font-semibold">Get cash</span> from your home's equity</li>
                <li><span className="font-semibold">Consolidate high-interest debt</span></li>
                <li><span className="font-semibold">Fund home improvements</span></li>
                <li>Typically keep 20% equity in home</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-600 pl-6 bg-purple-50 p-6">
              <h3 className="text-2xl font-semibold mb-3">FHA Streamline Refinance</h3>
              <p className="text-gray-700 mb-3">Fast, simple refinance for current FHA borrowers.</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><span className="font-semibold">No appraisal</span> required</li>
                <li><span className="font-semibold">Minimal documentation</span></li>
                <li><span className="font-semibold">Must reduce payment</span> or switch to fixed</li>
                <li>Fastest refinance option</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">When Does Refinancing Make Sense?</h2>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start"><span className="text-green-600 text-xl mr-3">✓</span><p><span className="font-semibold">Rates have dropped</span> - You can lower your rate by 0.5% or more</p></div>
            <div className="flex items-start"><span className="text-green-600 text-xl mr-3">✓</span><p><span className="font-semibold">Credit improved</span> - Your score has increased since you bought</p></div>
            <div className="flex items-start"><span className="text-green-600 text-xl mr-3">✓</span><p><span className="font-semibold">Remove PMI</span> - You have 20%+ equity and want to drop mortgage insurance</p></div>
            <div className="flex items-start"><span className="text-green-600 text-xl mr-3">✓</span><p><span className="font-semibold">Need cash</span> - Access equity for important expenses</p></div>
            <div className="flex items-start"><span className="text-green-600 text-xl mr-3">✓</span><p><span className="font-semibold">Pay off faster</span> - Shorten term from 30 to 15 years</p></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Refinancing Requirements</h2>
          <div className="space-y-4">
            <div><h3 className="text-xl font-semibold mb-2">Credit Score</h3><p className="text-gray-700">620+ for conventional, 600+ for FHA refinance</p></div>
            <div><h3 className="text-xl font-semibold mb-2">Equity</h3><p className="text-gray-700">Typically 20%+ equity (80% loan-to-value), 5% for FHA streamline</p></div>
            <div><h3 className="text-xl font-semibold mb-2">Income</h3><p className="text-gray-700">Proof of stable income and employment</p></div>
            <div><h3 className="text-xl font-semibold mb-2">Payment History</h3><p className="text-gray-700">On-time mortgage payments for past 12 months</p></div>
            <div><h3 className="text-xl font-semibold mb-2">Debt-to-Income</h3><p className="text-gray-700">45-50% or less depending on loan type</p></div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-4">Why Refinance with Wael?</h2>
          <p className="text-lg mb-6">As a Licensed Mortgage Broker at Barrett Financial Group, I have access to multiple lenders to find you the absolute best refinance rates and terms.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div><h3 className="text-xl font-semibold mb-2">✓ Rate Shopping</h3><p>Compare offers from multiple lenders</p></div>
            <div><h3 className="text-xl font-semibold mb-2">✓ Fast Processing</h3><p>Average 23-day close time</p></div>
            <div><h3 className="text-xl font-semibold mb-2">✓ No Hidden Fees</h3><p>Transparent pricing and closing costs</p></div>
            <div><h3 className="text-xl font-semibold mb-2">✓ Multilingual</h3><p>English, Arabic, Spanish, Italian</p></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Lower Your Rate?</h2>
          <p className="text-xl text-gray-600 mb-6">Let's analyze your current loan and see how much you can save!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://calendly.com/waelabdali/30min" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-semibold">Free Refinance Analysis</a>
            <a href="https://181106.my1003app.com/2171794/register?time=1742858528979" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md text-lg font-semibold">Apply to Refinance</a>
          </div>
          <p className="text-sm text-gray-600 mt-4">NMLS #2171794 | Licensed Mortgage Broker | Barrett Financial Group</p>
        </div>
      </div>
    </div>
  );
};

export default RefinancingPage;