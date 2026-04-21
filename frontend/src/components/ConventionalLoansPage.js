import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ComplianceFooter from './ComplianceFooter';
import { ga } from '@/lib/analytics';

export default function ConventionalLoansPage() {
  const navigate = useNavigate();

  useEffect(() => {
    ga.loanPageView('conventional');
  }, []);

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
              onClick={() => { ga.ctaClick('conv_qualify_header', 'conventional_page'); navigate('/qualify'); }}
              className="text-sm border border-blue-600 text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              Check My Eligibility
            </button>
            <a
              href="https://calendly.com/abualiwael/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => ga.bookingClick('conventional_header')}
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
            Conventional Loans
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            The Best Rates for<br />Qualified Buyers.
          </h1>
          <p className="text-xl text-blue-200 mb-4 max-w-2xl">
            Conventional loans offer the lowest rates, no mortgage insurance at 20% down, and flexibility for primary homes, second homes, and investment properties.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => { ga.ctaClick('conv_hero_qualify', 'conventional_page'); navigate('/qualify'); }}
              className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold px-8 py-4 rounded-xl text-lg"
            >
              See If I Qualify
            </button>
            <a
              href="tel:+19173040234"
              onClick={() => ga.callClick('conventional_hero')}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-lg text-center"
            >
              Call (917) 304-0234
            </a>
          </div>
        </div>
      </section>

      {/* Key Numbers */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100 text-center">
              <p className="text-4xl font-bold text-blue-700 mb-2">3%</p>
              <p className="font-semibold text-gray-900">Minimum Down Payment</p>
              <p className="text-sm text-gray-500 mt-1">Primary residence, 620+ credit</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100 text-center">
              <p className="text-4xl font-bold text-blue-700 mb-2">620+</p>
              <p className="font-semibold text-gray-900">Minimum Credit Score</p>
              <p className="text-sm text-gray-500 mt-1">740+ unlocks best pricing</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100 text-center">
              <p className="text-4xl font-bold text-blue-700 mb-2">$806,500</p>
              <p className="font-semibold text-gray-900">2025 Conforming Limit</p>
              <p className="text-sm text-gray-500 mt-1">Jumbo above this amount</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Why Conventional?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'No PMI at 20% Down', body: 'Put 20% down and there\'s no private mortgage insurance — ever. This can save hundreds per month compared to FHA, which has permanent MIP regardless of equity.' },
              { title: 'Property Flexibility', body: 'Use it for your primary residence, a second/vacation home, or an investment property. FHA only allows primary residences — conventional is the tool for investors and second-home buyers.' },
              { title: 'Cancel PMI at 20% Equity', body: 'Start with less than 20% down? Once you reach 20% equity through payments or appreciation, you can cancel PMI automatically. FHA MIP often stays for life.' },
              { title: 'Best Rates for Strong Credit', body: 'If your credit score is 740+ and your finances are solid, conventional loans will give you the lowest available rates. No government guarantee means lower costs for low-risk borrowers.' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Conventional Requirements</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              { label: 'Credit Score', detail: '620+ minimum · 740+ for best rates and lowest PMI' },
              { label: 'Down Payment', detail: '3% primary · 10% second home · 15–25% investment' },
              { label: 'Employment', detail: 'Steady 2-year history · W-2s and tax returns required' },
              { label: 'DTI Ratio', detail: 'Up to 50% with strong compensating factors' },
              { label: 'Property Types', detail: 'Primary residence, second home, or investment property' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 bg-white rounded-xl border border-gray-200">
                <div className="w-36 flex-shrink-0 font-bold text-gray-900 text-sm">{item.label}</div>
                <div className="text-gray-600 text-sm">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Pre-Approved?</h2>
          <p className="text-gray-500 mb-8">Check your eligibility in 60 seconds — no personal info required.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => { ga.ctaClick('conv_bottom_qualify', 'conventional_page'); navigate('/qualify'); }}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-4 rounded-xl text-lg"
            >
              Check My Eligibility
            </button>
            <a
              href="https://calendly.com/abualiwael/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => ga.bookingClick('conventional_bottom')}
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
