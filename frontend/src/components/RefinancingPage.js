import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ComplianceFooter from './ComplianceFooter';
import { ga } from '@/lib/analytics';

export default function RefinancingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    ga.loanPageView('refinancing');
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
              onClick={() => { ga.ctaClick('refi_apply_header', 'refinancing_page'); navigate('/apply'); }}
              className="text-sm border border-blue-600 text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              Start My Refi
            </button>
            <a
              href="https://calendly.com/abualiwael/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => ga.bookingClick('refi_header')}
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
            Refinancing
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Lower Your Rate.<br />Access Your Equity.
          </h1>
          <p className="text-xl text-blue-200 mb-4 max-w-2xl">
            If you bought when rates were higher — or you need cash for home improvements, debt consolidation, or investment — refinancing may be the smartest move you can make this year.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => { ga.ctaClick('refi_hero_apply', 'refinancing_page'); navigate('/apply'); }}
              className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold px-8 py-4 rounded-xl text-lg"
            >
              Start My Refinance
            </button>
            <a
              href="tel:+19173040234"
              onClick={() => ga.callClick('refi_hero')}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-lg text-center"
            >
              Call (917) 304-0234
            </a>
          </div>
        </div>
      </section>

      {/* When to Refi */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">When Does Refinancing Make Sense?</h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            Not everyone should refinance. Here's when it typically makes financial sense.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '📉', title: 'Rates Have Dropped', body: 'If your current rate is 0.5% or more above today\'s market rate, refinancing can reduce your monthly payment significantly. Even 0.25% makes a difference on a $500K loan.' },
              { icon: '💰', title: 'You Need Cash', body: 'Cash-out refinance lets you borrow against your equity at mortgage rates — much lower than credit cards or personal loans. Fund renovations, pay off debt, or invest.' },
              { icon: '📊', title: 'Your Credit Improved', body: 'If your score was 680 when you bought and it\'s now 740+, you may qualify for substantially better rates. Your credit history since purchase matters.' },
              { icon: '🏦', title: 'Remove Mortgage Insurance', body: 'On an FHA loan with 20%+ equity? You can\'t remove FHA MIP — you have to refinance into a conventional loan to eliminate it. Could save $200–$400/month.' },
              { icon: '⏰', title: 'Switch to a Shorter Term', body: 'Refinancing from 30 to 15 years means higher monthly payments but massive interest savings and building equity twice as fast.' },
              { icon: '🔒', title: 'Get Off an ARM', body: 'Adjustable-rate mortgage approaching its adjustment period? Lock in today\'s fixed rate before your payment spikes.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-all">
                <div className="text-3xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refi Types */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Types of Refinancing</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border-2 border-blue-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rate & Term Refinance</h3>
              <p className="text-gray-600 mb-4">Change your interest rate, loan term, or both. No cash out — just better terms.</p>
              <div className="flex flex-wrap gap-3">
                {['Lower monthly payment', 'Shorter loan term', 'Switch ARM to fixed', 'Save on total interest'].map((t, i) => (
                  <span key={i} className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">{t}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border-2 border-green-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cash-Out Refinance</h3>
              <p className="text-gray-600 mb-4">Borrow more than you owe and receive the difference as cash at closing.</p>
              <div className="flex flex-wrap gap-3">
                {['Home renovations', 'Debt consolidation', 'Investment capital', 'College tuition'].map((t, i) => (
                  <span key={i} className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full">{t}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border-2 border-purple-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">FHA Streamline Refinance</h3>
              <p className="text-gray-600 mb-4">Already have an FHA loan? Streamline refinance is the fastest option — no appraisal, minimal docs.</p>
              <div className="flex flex-wrap gap-3">
                {['No appraisal needed', 'Minimal documentation', 'Fast closing', 'Must lower payment'].map((t, i) => (
                  <span key={i} className="bg-purple-50 text-purple-700 text-sm font-medium px-3 py-1 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Refinance Requirements</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              { label: 'Credit Score', detail: '620+ for conventional · 580+ for FHA streamline' },
              { label: 'Equity', detail: '20%+ for conventional cash-out · 5% for FHA streamline' },
              { label: 'Income', detail: 'Proof of stable income — same docs as a purchase loan' },
              { label: 'Payment History', detail: 'On-time mortgage payments for past 12 months' },
              { label: 'DTI Ratio', detail: '45–50% or less depending on loan type' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-36 flex-shrink-0 font-bold text-gray-900 text-sm">{item.label}</div>
                <div className="text-gray-600 text-sm">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Lower Your Rate?</h2>
          <p className="text-gray-500 mb-8">I'll analyze your current loan and show you exactly how much you'd save.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => { ga.ctaClick('refi_bottom_apply', 'refinancing_page'); navigate('/apply'); }}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-4 rounded-xl text-lg"
            >
              Start My Refinance
            </button>
            <a
              href="https://calendly.com/abualiwael/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => ga.bookingClick('refi_bottom')}
              className="bg-white border-2 border-blue-700 text-blue-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-blue-50"
            >
              Free Refinance Analysis
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-500">Wael Abdeldayem · NMLS #2171794 · Barrett Financial Group · Licensed NJ · NY · CT</p>
        </div>
      </section>

      <ComplianceFooter />
    </div>
  );
}
