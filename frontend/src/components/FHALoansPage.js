import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ComplianceFooter from './ComplianceFooter';
import { ga } from '@/lib/analytics';

export default function FHALoansPage() {
  const navigate = useNavigate();

  useEffect(() => {
    ga.loanPageView('fha');
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
              onClick={() => { ga.ctaClick('fha_qualify_header', 'fha_page'); navigate('/qualify'); }}
              className="text-sm border border-blue-600 text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              Check My Eligibility
            </button>
            <a
              href="https://calendly.com/abualiwael/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => ga.bookingClick('fha_header')}
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
            FHA Loans
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Low Down Payment.<br />Flexible Credit.
          </h1>
          <p className="text-xl text-blue-200 mb-4 max-w-2xl">
            FHA loans are the #1 choice for first-time homebuyers and anyone with less-than-perfect credit. As little as 3.5% down, credit scores from 580.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => { ga.ctaClick('fha_hero_qualify', 'fha_page'); navigate('/qualify'); }}
              className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold px-8 py-4 rounded-xl text-lg"
            >
              See If I Qualify
            </button>
            <a
              href="tel:+19173040234"
              onClick={() => ga.callClick('fha_hero')}
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
              <p className="text-4xl font-bold text-blue-700 mb-2">3.5%</p>
              <p className="font-semibold text-gray-900">Minimum Down Payment</p>
              <p className="text-sm text-gray-500 mt-1">With 580+ credit score</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100 text-center">
              <p className="text-4xl font-bold text-blue-700 mb-2">580+</p>
              <p className="font-semibold text-gray-900">Credit Score</p>
              <p className="text-sm text-gray-500 mt-1">580–619 requires 10% down</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100 text-center">
              <p className="text-4xl font-bold text-blue-700 mb-2">55%</p>
              <p className="font-semibold text-gray-900">Max DTI Allowed</p>
              <p className="text-sm text-gray-500 mt-1">More flexibility than conventional</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Why FHA?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Low Down Payment', body: 'Only 3.5% down with a 580+ credit score. Down payment can be a gift from family members — no need to have saved it yourself.' },
              { title: 'Flexible Credit', body: 'Credit scores as low as 580 accepted. If you\'ve had credit challenges in the past, FHA is often the most accessible path to homeownership.' },
              { title: 'High DTI Allowed', body: 'Debt-to-income ratio up to 55%. If you carry student loans, car payments, or other debt, FHA gives you more room than conventional loans.' },
              { title: '2025 Loan Limits', body: 'Standard areas: $524,225. High-cost areas: up to $1,209,750. NJ, NY, and CT all have elevated limits — contact me for your county\'s limit.' },
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
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">FHA Requirements</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              { label: 'Credit Score', detail: '580+ for 3.5% down · 500–579 for 10% down' },
              { label: 'Down Payment', detail: '3.5% minimum (can be gift funds from family)' },
              { label: 'Employment', detail: 'Steady history typically 2 years · W-2 or self-employed' },
              { label: 'Property', detail: 'Must be primary residence · FHA appraisal required' },
              { label: 'Mortgage Insurance', detail: '1.75% upfront MIP + 0.45–1.05% annually' },
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
              onClick={() => { ga.ctaClick('fha_bottom_qualify', 'fha_page'); navigate('/qualify'); }}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-4 rounded-xl text-lg"
            >
              Check My Eligibility
            </button>
            <a
              href="https://calendly.com/abualiwael/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => ga.bookingClick('fha_bottom')}
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
