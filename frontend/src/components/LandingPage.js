import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadAPI } from '@/lib/api';

const LandingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    loan_amount: '',
    property_value: '',
    source: 'web_form'
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rates, setRates] = useState({
    conventional_30: '6.19',
    conventional_15: '5.65',
    nonQM: 'Call for Quote'
  });

  useEffect(() => {
    // Fetch current market rates on component mount
    // Note: Replace with actual API integration for live rates
    const fetchRates = async () => {
      try {
        // Placeholder for API-Ninjas or other rate API
        // In production, call your backend endpoint that fetches from rate API
        const currentDate = new Date().toLocaleDateString();
        console.log('Rates updated:', currentDate);
      } catch (error) {
        console.error('Error fetching rates:', error);
      }
    };
    fetchRates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await leadAPI.create({
        ...formData,
        loan_amount: parseFloat(formData.loan_amount) || null,
        property_value: parseFloat(formData.property_value) || null
      });
      setSubmitted(true);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        loan_amount: '',
        property_value: '',
        source: 'web_form'
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting lead:', error);
      alert('Error submitting form. Please try again.');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-blue-600">Wael Abdeldayem</h1>
                <p className="text-xs text-gray-600">Licensed Mortgage Loan Officer</p>
              </div>
              <img 
                src="https://www.hud.gov/sites/dfiles/Main/images/eho_logo_english.jpg" 
                alt="Equal Housing Opportunity" 
                className="h-8"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/calculator')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                data-testid="nav-calculator-button"
              >
                Calculator
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                data-testid="nav-login-button"
              >
                Loan Officer Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Get Your Dream Home Loan in <span className="text-blue-600">48 Hours</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Fast approvals, competitive rates, and personalized service. Let us help you achieve homeownership.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">3.5%</div>
                <div className="text-sm text-gray-600">Starting Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">48hrs</div>
                <div className="text-sm text-gray-600">Quick Approval</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">99%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8" data-testid="lead-form-container">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Get Pre-Qualified Today</h3>
            {submitted && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4" data-testid="success-message">
                Thank you! We'll contact you within 24 hours.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  data-testid="input-first-name"
                />
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  data-testid="input-last-name"
                />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="input-email"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="input-phone"
              />
              <input
                type="number"
                name="loan_amount"
                value={formData.loan_amount}
                onChange={handleChange}
                placeholder="Desired Loan Amount"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="input-loan-amount"
              />
              <input
                type="number"
                name="property_value"
                value={formData.property_value}
                onChange={handleChange}
                placeholder="Property Value (Optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="input-property-value"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400"
                data-testid="submit-lead-button"
              >
                {loading ? 'Submitting...' : 'Get Started'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Us?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-2">Fast Approval</h4>
              <p className="text-gray-600">Get pre-approved in as little as 48 hours with our streamlined process.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-2">Competitive Rates</h4>
              <p className="text-gray-600">Access the best rates in the market with our extensive lender network.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-2">Expert Guidance</h4>
              <p className="text-gray-600">Our experienced loan officers guide you through every step of the process.</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">MortgageMaster</h4>
              <p className="text-gray-400">Your trusted partner in homeownership.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/calculator')} className="hover:text-white">Mortgage Calculator</button></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-white">Loan Officer Portal</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <p className="text-gray-400">Email: info@mortgagemaster.com</p>
              <p className="text-gray-400">Phone: (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MortgageMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
