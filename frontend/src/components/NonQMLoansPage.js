import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ComplianceFooter from './ComplianceFooter';
import { ga } from '@/lib/analytics';

export default function NonQMLoansPage() {
  const navigate = useNavigate();

  useEffect(() => {
    ga.loanPageView('non_qm');
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
              onClick={() => { ga.ctaClick('nonqm_qualify', 'non_qm_page'); navigate('/apply'); }}
              className="text-sm border border-blue-600 text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              Apply Now
            </button>
            <a
              href="https://calendly.com/abualiwael/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => ga.bookingClick('non_qm_header')}
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
            Our Specialty — Non-QM Loans
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Were You Told<br />You Don't Qualify?
          </h1>
          <p className="text-xl text-blue-200 mb-4 max-w-2xl">
            Non-QM loans exist for exactly this reason. If you're self-employed, have cash-based income, or can't document income the traditional way — this is your loan.
          </p>
          <p className="text-lg text-blue-300 mb-8 max-w-2xl">
            No tax returns. No W-2s. No pay stubs required.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => { ga.ctaClick('nonqm_hero_apply', 'non_qm_page'); navigate('/apply'); }}
              className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold px-8 py-4 rounded-xl text-lg"
            >
              Apply for Non-QM Now
            </button>
            <a
              href="tel:+19173040234"
              onClick={() => ga.callClick('non_qm_hero')}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-lg text-center"
            >
              Call (917) 304-0234
            </a>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Who Is Non-QM For?</h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            If your income doesn't fit neatly on a W-2 or tax return, you're not alone — and you're not out of options.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '💼', title: 'Self-Employed Business Owners', body: 'Your write-offs reduce taxable income — great for taxes, hard on mortgage applications. Non-QM uses bank statements instead. 12 or 24 months of deposits are your income.' },
              { icon: '💰', title: 'Cash-Based & 1099 Earners', body: 'Contractors, consultants, gig workers, and cash businesses: your actual income is real, even if it\'s hard to document. We have programs that work with your reality.' },
              { icon: '🏢', title: 'Real Estate Investors', body: 'DSCR loans (Debt Service Coverage Ratio) qualify you based on the property\'s rental income — not your personal income. Perfect for building a portfolio.' },
              { icon: '🌐', title: 'Foreign Nationals', body: 'No U.S. tax history? No problem. We have programs for foreign nationals buying property in NJ, NY, and CT.' },
              { icon: '📊', title: 'High Net Worth / Asset Depletion', body: 'You have substantial savings or investments but limited income on paper. Asset depletion programs let your wealth count as income.' },
              { icon: '⏰', title: 'Recent Credit Events', body: 'Bankruptcy, foreclosure, or missed payments? If it\'s been 2+ years and you\'ve rebuilt your credit, Non-QM can get you back in the market.' },
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

      {/* Requirements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Requirements</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-red-100">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold text-gray-900 mb-2">Credit Score</h3>
              <p className="text-3xl font-bold text-blue-700 mb-2">680+</p>
              <p className="text-sm text-gray-600">Minimum required. Higher scores unlock better rates. 720+ gets the best pricing.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-red-100">
              <div className="text-3xl mb-3">💵</div>
              <h3 className="font-bold text-gray-900 mb-2">Down Payment</h3>
              <p className="text-3xl font-bold text-blue-700 mb-2">20%+</p>
              <p className="text-sm text-gray-600">Minimum 20% required. This eliminates mortgage insurance and compensates for flexible income docs.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-green-100">
              <div className="text-3xl mb-3">📄</div>
              <h3 className="font-bold text-gray-900 mb-2">Income Docs</h3>
              <p className="text-2xl font-bold text-green-600 mb-2">Flexible</p>
              <p className="text-sm text-gray-600">Bank statements (12–24 months), 1099s, P&L statement, asset depletion, or DSCR — no tax returns required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Arabic community section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">خدمة كاملة بالعربية</h2>
                <p className="text-blue-200 text-lg mb-4">
                  أفهم أن كثيراً من إخواننا العرب في نيوجيرسي يعملون لحسابهم الخاص أو لديهم دخل غير تقليدي. هذه القروض صُممت لكم.
                </p>
                <p className="text-blue-300 mb-6">
                  بدون إقرارات ضريبية. بدون W-2. فقط تاريخ ائتمان جيد و20% دفعة أولى.
                </p>
                <a
                  href="tel:+19173040234"
                  onClick={() => ga.callClick('non_qm_arabic')}
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Find Out If You Qualify?</h2>
          <p className="text-gray-500 mb-8">Takes 60 seconds. No personal info required.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => { ga.ctaClick('nonqm_bottom_apply', 'non_qm_page'); navigate('/apply'); }}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-4 rounded-xl text-lg"
            >
              Apply for Non-QM Now
            </button>
            <a
              href="https://calendly.com/abualiwael/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => ga.bookingClick('non_qm_bottom')}
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
