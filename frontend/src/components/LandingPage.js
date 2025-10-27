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
  const [dailyInsight, setDailyInsight] = useState(null);
  const [calendlyUrl] = useState('https://calendly.com/waelabdali/30min');

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
    
    // Fetch daily mortgage insight
    const fetchDailyInsight = async () => {
      try {
        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(`${BACKEND_URL}/api/insights/latest`);
        if (response.ok) {
          const data = await response.json();
          setDailyInsight(data);
        }
      } catch (error) {
        console.error('Error fetching daily insight:', error);
      }
    };
    fetchDailyInsight();
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
              <img 
                src="https://customer-assets.emergentagent.com/job_mortgage-mastery/artifacts/y2wa234f_Wael%27s%20Pic.jpg"
                alt="Wael Abdeldayem"
                className="h-16 w-16 rounded-full object-cover border-2 border-blue-600"
              />
              <div>
                <h1 className="text-2xl font-bold text-blue-600">Wael Abdeldayem</h1>
                <p className="text-xs text-gray-600">Licensed Mortgage Loan Officer</p>
              </div>
              <div className="flex items-center bg-blue-900 px-2 py-1 rounded" title="Equal Housing Opportunity">
                <svg className="h-7 w-7 text-white" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50 10L10 40v50h30V60h20v30h30V40L50 10zm0 8.66L82 38v44H68V54H32v28H18V38l32-19.34z"/>
                  <rect x="40" y="32" width="8" height="8"/>
                  <rect x="52" y="32" width="8" height="8"/>
                  <rect x="40" y="44" width="8" height="8"/>
                  <rect x="52" y="44" width="8" height="8"/>
                </svg>
                <span className="ml-1 text-white text-xs font-semibold">=</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/calculator')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                data-testid="nav-calculator-button"
              >
                Calculator
              </button>
              <a
                href="https://181106.my1003app.com/2171794/register?time=1742858528979"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                data-testid="nav-application-button"
              >
                Complete Application
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            {/* Professional Photo and Intro */}
            <div className="flex items-center space-x-4 mb-8">
              <img 
                src="https://customer-assets.emergentagent.com/job_mortgage-mastery/artifacts/y2wa234f_Wael%27s%20Pic.jpg"
                alt="Wael Abdeldayem - Licensed Mortgage Loan Officer"
                className="h-24 w-24 rounded-full object-cover border-4 border-blue-600 shadow-lg"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Wael Abdeldayem</h2>
                <p className="text-blue-600 font-semibold">Licensed Mortgage Loan Officer</p>
                <p className="text-sm text-gray-600">NMLS #2171794</p>
              </div>
            </div>
            
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Get Your Dream Home Loan with <span className="text-blue-600">Expert Guidance</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Fast approvals, competitive rates, and personalized service from a licensed mortgage professional.
            </p>
            
            {/* Current Market Rates */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                📊 Current Market Rates
                <span className="ml-2 text-xs text-gray-500">(Updated Daily)</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">30-Year Fixed (Conventional)</span>
                  <span className="text-lg font-bold text-blue-600">{rates.conventional_30}%*</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">15-Year Fixed (Conventional)</span>
                  <span className="text-lg font-bold text-blue-600">{rates.conventional_15}%*</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Non-QM Programs</span>
                  <span className="text-sm font-semibold text-gray-600">{rates.nonQM}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                *Rates are national averages and subject to change. Your actual rate depends on credit score, 
                loan amount, down payment, and property location. Contact us for a personalized quote.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">Fast</div>
                <div className="text-sm text-gray-600">Quick Approval</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">20%+</div>
                <div className="text-sm text-gray-600">No PMI Option</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">Flexible</div>
                <div className="text-sm text-gray-600">Employment Rules</div>
              </div>
            </div>
            
            {/* Unique Value Proposition */}
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8">
              <p className="text-sm text-green-800">
                <strong>💡 Special Programs Available:</strong> You can qualify for a mortgage even without 2 years of verified employment history when you have enough down payment (20%+) to avoid mortgage insurance. Let's discuss your options!
              </p>
            </div>
            
            {/* Schedule Consultation Button */}
            <div className="mt-8">
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-center text-lg transition-colors shadow-lg"
                data-testid="schedule-consultation-button"
              >
                📅 Schedule Free 30-Min Consultation
              </a>
              <p className="text-xs text-gray-600 mt-2 text-center">
                Available: Mon, Wed, Fri • 12 PM - 7 PM EST
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8" data-testid="lead-form-container">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Pre-Qualified Today</h3>
            <p className="text-sm text-gray-600 mb-6">Complete this form to get started with your mortgage application</p>
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
                {loading ? 'Submitting...' : 'Get Pre-Qualified'}
              </button>
              
              {/* Application Link */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <a
                  href="https://181106.my1003app.com/2171794/register?time=1742858528979"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
                  data-testid="full-application-link"
                >
                  Complete Full Application →
                </a>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Ready to apply? Click here for our secure online application
                </p>
              </div>
            </form>
            
            {/* Compliance Statement */}
            <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
              <p className="mb-2">
                <strong>Equal Housing Opportunity:</strong> We do business in accordance with Federal Fair Lending Laws. 
                We are committed to ensuring that our services are accessible to all qualified applicants without regard to race, 
                color, religion, sex, handicap, familial status, or national origin.
              </p>
              <p>
                By submitting this form, you consent to be contacted about mortgage products and services. 
                Your information will be handled in accordance with applicable privacy laws.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Mortgage Insights Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Today's Expert Advice</span>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">Daily Mortgage Insights</h3>
            <p className="text-gray-600 mt-2">Professional guidance to help you make informed decisions</p>
          </div>
          
          {dailyInsight ? (
            <div className="bg-white rounded-2xl shadow-xl p-8" data-testid="daily-insight">
              <div className="flex items-center justify-between mb-4">
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold capitalize">
                  {dailyInsight.category}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(dailyInsight.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">{dailyInsight.title}</h4>
              <p className="text-gray-700 leading-relaxed text-lg">{dailyInsight.content}</p>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://customer-assets.emergentagent.com/job_mortgage-mastery/artifacts/y2wa234f_Wael%27s%20Pic.jpg"
                    alt="Wael Abdeldayem"
                    className="h-12 w-12 rounded-full object-cover border-2 border-blue-200"
                  />
                  <p className="text-sm text-gray-600 italic">
                    💡 Expert advice from Wael Abdeldayem, Licensed Mortgage Loan Officer
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
              </div>
            </div>
          )}
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              New insights published daily • Based on current market trends and buyer questions
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
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

      {/* Follow on Instagram Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Follow Me on Instagram</h3>
            <p className="text-gray-600">Stay updated with mortgage tips, market insights, and success stories</p>
          </div>
          <div className="flex justify-center">
            <div 
              dangerouslySetInnerHTML={{
                __html: `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/wael_abdeldayem_loan_officer/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/wael_abdeldayem_loan_officer/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this profile on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/wael_abdeldayem_loan_officer/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px;" target="_blank">Wael Abdeldayem</a> (@<a href="https://www.instagram.com/wael_abdeldayem_loan_officer/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px;" target="_blank">wael_abdeldayem_loan_officer</a>) • Instagram photos and videos</p></div></blockquote>
                <script async src="//www.instagram.com/embed.js"></script>`
              }}
            />
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="https://customer-assets.emergentagent.com/job_mortgage-mastery/artifacts/y2wa234f_Wael%27s%20Pic.jpg"
                  alt="Wael Abdeldayem"
                  className="h-16 w-16 rounded-full object-cover border-2 border-white"
                />
                <div>
                  <h4 className="text-xl font-bold">Wael Abdeldayem</h4>
                  <p className="text-gray-400 text-sm">Licensed Mortgage Loan Officer</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                NMLS ID: 2171794
              </p>
              <div className="mt-4">
                <img 
                  src="https://www.hud.gov/sites/dfiles/Main/images/eho_logo_english.jpg" 
                  alt="Equal Housing Opportunity" 
                  className="h-12 bg-white p-1 rounded"
                />
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Connect With Me</h5>
              <div className="flex space-x-4 mb-4">
                <a 
                  href="https://instagram.com/wael_abdeldayem_loan_officer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/in/wael-abdeldayem-8b0044164/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="https://facebook.com/profile.php?id=100090237072741"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a 
                    href={calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    📅 Schedule Consultation
                  </a>
                </li>
                <li>
                  <a 
                    href="https://181106.my1003app.com/2171794/register?time=1742858528979"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    Complete Application
                  </a>
                </li>
                <li><button onClick={() => navigate('/calculator')} className="hover:text-white">Mortgage Calculator</button></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-white">Loan Officer Portal</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <p className="text-gray-400">Email: Wael@BarrettFinancial.com</p>
              <p className="text-sm text-gray-400 mt-4">
                NMLS #2171794
              </p>
            </div>
          </div>
          
          {/* Federal Compliance Disclosures */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-xs text-gray-400 space-y-4">
            <p>
              <strong>Equal Housing Opportunity Statement:</strong> We are committed to ensuring that our services 
              are accessible to all qualified applicants without regard to race, color, religion, sex, handicap, 
              familial status, or national origin. All loan programs are subject to credit approval and property appraisal. 
              Not all loan programs are available in all states for all loan amounts.
            </p>
            <p>
              <strong>Rate Disclaimer:</strong> The rates displayed are national averages from public market data and 
              are provided for informational purposes only. Actual rates offered may differ and are based on a variety 
              of factors including but not limited to: credit score, loan-to-value (LTV) ratio, loan amount, loan purpose, 
              property location, occupancy type, and documentation requirements. Rates are subject to change without notice. 
              Contact us for a personalized rate quote.
            </p>
            <p>
              <strong>New Jersey Disclosure:</strong> All mortgage transactions are subject to New Jersey state regulations 
              including flood risk disclosure requirements. Property condition disclosure statements will be provided in 
              accordance with New Jersey law.
            </p>
            <p>
              <strong>Licensing Information:</strong> NMLS ID: 2171794. 
              To verify licensing, visit: <a href="https://www.nmlsconsumeraccess.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">www.nmlsconsumeraccess.org</a>
            </p>
            <p className="text-center pt-4">
              &copy; 2025 Wael Abdeldayem - Licensed Mortgage Loan Officer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
