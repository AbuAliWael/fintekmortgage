import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ComplianceFooter from './ComplianceFooter';
import { ga } from '@/lib/analytics';

export default function FirstTimeBuyerPage() {
  const navigate = useNavigate();

  useEffect(() => {
    ga.loanPageView('first_time_buyer');
  }, []);

  const steps = [
    { num: '1', title: 'Check Your Eligibility', body: 'Takes 60 seconds. Answer a few questions and see which loan fits you best — FHA, Conventional, or Non-QM.' },
    { num: '2', title: 'Get Pre-Approved', body: 'Know your exact budget before you look at homes. Sellers take pre-approved buyers seriously. Average 48-hour turnaround.' },
    { num: '3', title: 'Find Your Home', body: 'Work with a real estate agent. Your pre-approval letter shows exactly what price range you can offer.' },
    { num: '4', title: 'Close in 23 Days', body: 'Fintek Mortgage closes faster than the industry average of 30–45 days. We move when you\'re ready.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="text-blue-700 font-semibold text-sm hover:text-blue-900">
            ← Fintek Mortgage
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => { ga.ctaClick('ftb_qualify_header', 'first_time_buyer_page'); navigate('/qualify'); }}
              className="text-sm border border-blue-600 text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              Check My Eligibility
            </button>
            <a
              href="https://calendly.com/abualiwael/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => ga.bookingClick('ftb_header')}
              className="text-sm bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg"
            >
              Book Consultation
            </a>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            First-Time Homebuyers
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your First Home<br />Is Closer Than You Think.
          </h1>
          <p className="text-xl text-blue-200 mb-4 max-w-2xl">
            As little as 3–3.5% down. Credit scores from 580. Gift funds allowed. I'll walk you through every step — in English or Arabic.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => { ga.ctaClick('ftb_hero_qualify', 'first_time_buyer_page'); navigate('/qualify'); }}
              className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold px-8 py-4 rounded-xl text-lg"
            >
              See What I Qualify For
            </button>
            <a
              href="tel:+19173040234"
              onClick={() => ga.callClick('ftb_hero')}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-lg text-center"
            >
              Call (917) 304-0234
            </a>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Best Programs for First-Time Buyers</h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            Which one fits you depends on your credit, down payment, and income type. Use the eligibility tool to find out in 60 seconds.
          </p>
          <div className="space-y-6">
            <div className="p-8 rounded-2xl border-2 border-blue-200 bg-blue-50">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <span className="inline-block bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-2 py-1 rounded mb-3">Most Popular</span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">FHA Loan</h3>
                  <p className="text-gray-600 mb-4">3.5% down · 580+ credit · gift funds OK · high DTI allowed</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>✓ Down payment can be a gift from family</li>
                    <li>✓ Credit scores as low as 580 accepted</li>
                    <li>✓ Debt-to-income ratio up to 55%</li>
                    <li>✓ Available in NJ, NY, and CT</li>
                  </ul>
                </div>
                <button
                  onClick={() => { ga.ctaClick('ftb_fha_link', 'first_time_buyer_page'); navigate('/loans/fha'); }}
                  className="text-blue-700 font-semibold text-sm hover:underline whitespace-nowrap"
                >
                  Learn About FHA →
                </button>
              </div>
            </div>

            <div className="p-8 rounded-2xl border-2 border-gray-200 bg-gray-50">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Conventional 97</h3>
                  <p className="text-gray-600 mb-4">3% down · 620+ credit · cancel PMI at 20% equity</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>✓ Lowest PMI rates with strong credit</li>
                    <li>✓ Can cancel mortgage insurance — FHA can't</li>
                    <li>✓ 740+ credit score = best rates</li>
                  </ul>
                </div>
                <button
                  onClick={() => { ga.ctaClick('ftb_conv_link', 'first_time_buyer_page'); navigate('/loans/conventional'); }}
                  className="text-blue-700 font-semibold text-sm hover:underline whitespace-nowrap"
                >
                  Learn About Conventional →
                </button>
              </div>
            </div>

            <div className="p-8 rounded-2xl border-2 border-yellow-200 bg-yellow-50">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <span className="inline-block bg-yellow-500 text-white text-xs font-bold uppercase tracking-wider px-2 py-1 rounded mb-3">Self-Employed?</span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Non-QM / Bank Statement Loan</h3>
                  <p className="text-gray-600 mb-4">No tax returns · 680+ credit · 20% down · bank statements used as income</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>✓ Self-employed, 1099, cash-based income</li>
                    <li>✓ 12 or 24 months bank statements</li>
                    <li>✓ No W-2s required</li>
                  </ul>
                </div>
                <button
                  onClick={() => { ga.ctaClick('ftb_nonqm_link', 'first_time_buyer_page'); navigate('/loans/non-qm'); }}
                  className="text-blue-700 font-semibold text-sm hover:underline whitespace-nowrap"
                >
                  Learn About Non-QM →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100">
                <div className="w-10 h-10 flex-shrink-0 bg-blue-700 text-white font-bold rounded-full flex items-center justify-center text-lg">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Arabic section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">هل تشتري بيتك الأول؟</h2>
                <p className="text-blue-200 text-lg mb-4">
                  أساعد كثيراً من إخواننا العرب في نيوجيرسي على تملك أول بيت لهم. سواء كنت موظفاً أو تعمل لحسابك الخاص، هناك برنامج يناسبك.
                </p>
                <a
                  href="tel:+19173040234"
                  onClick={() => ga.callClick('ftb_arabic')}
                  className="inline-block bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold px-6 py-3 rounded-xl"
                >
                  اتصل بوائل: (917) 304-0234
                </a>
              </div>
              <div className="text-center">
                <p className="text-blue-300 text-sm uppercase tracking-wider mb-2">Full English & Arabic Service</p>
                <p className="text-white text-lg">Every document, every call, every question — in the language you're comfortable in.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Buy Your First Home?</h2>
          <p className="text-gray-500 mb-8">Check eligibility in 60 seconds. No commitment, no personal info required.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => { ga.ctaClick('ftb_bottom_qualify', 'first_time_buyer_page'); navigate('/qualify'); }}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-4 rounded-xl text-lg"
            >
              Check My Eligibility
            </button>
            <a
              href="https://calendly.com/abualiwael/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => ga.bookingClick('ftb_bottom')}
              className="bg-white border-2 border-blue-700 text-blue-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-blue-50"
            >
              Book Free Consultation
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-500">Wael Abdeldayem · NMLS #2171794 · Barrett Financial Group · Licensed NJ · NY · CT</p>
        </div>
      </section>

      <ComplianceFooter />
    </div>
  );
}
