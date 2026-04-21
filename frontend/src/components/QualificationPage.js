import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ComplianceFooter from './ComplianceFooter';
import { ga } from '@/lib/analytics';

const STEPS = ['employment', 'credit', 'downpayment', 'property'];

const RESULT_MAP = {
  // [employment][credit][down][property]
  // Returns { loan, label, path, color, reason }
};

function getResult(employment, credit, down, property) {
  const creditNum = parseInt(credit, 10);
  const downNum = parseInt(down, 10);

  // Non-QM: self-employed or other, 680+, 20%+
  if ((employment === 'self' || employment === 'other') && creditNum >= 680 && downNum >= 20) {
    return {
      loan: 'Non-QM',
      path: '/loans/non-qm',
      color: 'blue',
      headline: 'Great news — you likely qualify for a Non-QM loan.',
      reason: 'Non-QM loans are designed exactly for you: no tax returns required, flexible income documentation. Your credit score and down payment meet the requirements.',
      cta_label: 'Learn About Non-QM Loans',
    };
  }

  // Non-QM investor
  if (employment === 'investor' && creditNum >= 680 && downNum >= 20) {
    return {
      loan: 'Non-QM (DSCR)',
      path: '/loans/non-qm',
      color: 'blue',
      headline: 'You may qualify for a DSCR / Non-QM investor loan.',
      reason: 'Investment property loans based on rental income (Debt Service Coverage Ratio), not personal income. No tax returns required.',
      cta_label: 'Explore Non-QM for Investors',
    };
  }

  // FHA: W-2 or self, 580+, 3.5%+
  if ((employment === 'w2' || employment === 'self') && creditNum >= 580 && downNum >= 3) {
    if (property === 'primary') {
      return {
        loan: 'FHA',
        path: '/loans/fha',
        color: 'green',
        headline: 'You likely qualify for an FHA loan.',
        reason: 'FHA loans are government-backed, making them accessible with lower credit scores and small down payments. Great for primary home purchases.',
        cta_label: 'Learn About FHA Loans',
      };
    }
  }

  // Conventional: W-2, 680+, 5%+
  if (employment === 'w2' && creditNum >= 680 && downNum >= 5) {
    return {
      loan: 'Conventional',
      path: '/loans/conventional',
      color: 'indigo',
      headline: 'You look like a strong Conventional loan candidate.',
      reason: 'With solid W-2 income, strong credit, and a meaningful down payment, you qualify for the best rates and terms in the market.',
      cta_label: 'Learn About Conventional Loans',
    };
  }

  // Below minimums — Wael can still help
  return {
    loan: 'Custom Review',
    path: null,
    color: 'orange',
    headline: 'Let\'s talk — there may still be options.',
    reason: 'Based on your answers, you don\'t clearly fit a standard program right now — but every situation is different. Wael reviews every case personally and often finds solutions banks miss.',
    cta_label: null,
  };
}

const T = {
  title: 'Find Your Loan in 60 Seconds',
  sub: 'Answer 4 quick questions — no personal information needed.',
  step1_q: 'What is your employment situation?',
  step1_a: [
    { val: 'w2', label: 'W-2 Employee', icon: '👔', sub: 'I receive pay stubs from an employer' },
    { val: 'self', label: 'Self-Employed / Business Owner', icon: '💼', sub: 'I file a Schedule C or own a business' },
    { val: 'investor', label: 'Real Estate Investor', icon: '🏢', sub: 'I\'m buying an investment / rental property' },
    { val: 'other', label: 'Other / Non-Traditional', icon: '💰', sub: 'Cash income, 1099, or non-standard' },
  ],
  step2_q: 'What is your credit score range?',
  step2_a: [
    { val: '740', label: '740+', icon: '⭐', sub: 'Excellent' },
    { val: '700', label: '700–739', icon: '✅', sub: 'Very Good' },
    { val: '680', label: '680–699', icon: '👍', sub: 'Good' },
    { val: '620', label: '620–679', icon: '📊', sub: 'Fair' },
    { val: '580', label: '580–619', icon: '⚠️', sub: 'Below Average' },
    { val: '0', label: 'Below 580 / Unsure', icon: '❓', sub: 'Not sure or rebuilding' },
  ],
  step3_q: 'How much can you put as a down payment?',
  step3_a: [
    { val: '20', label: '20% or more', icon: '💰', sub: 'Avoids mortgage insurance' },
    { val: '10', label: '10–19%', icon: '💵', sub: 'Solid down payment' },
    { val: '5', label: '5–9%', icon: '📈', sub: 'Standard range' },
    { val: '3', label: '3–4.99%', icon: '🔑', sub: 'Minimum for most programs' },
    { val: '0', label: 'Less than 3%', icon: '💡', sub: 'May need special program' },
  ],
  step4_q: 'What type of property are you buying?',
  step4_a: [
    { val: 'primary', label: 'Primary Residence', icon: '🏠', sub: 'My main home' },
    { val: 'investment', label: 'Investment / Rental', icon: '🏢', sub: 'I won\'t live there' },
    { val: 'second', label: 'Second Home / Vacation', icon: '🌴', sub: 'Part-time residence' },
  ],
};

export default function QualificationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ employment: null, credit: null, down: null, property: null });
  const [result, setResult] = useState(null);

  const keys = ['employment', 'credit', 'downpayment', 'property'];
  const answerKeys = ['employment', 'credit', 'down', 'property'];
  const steps = [T.step1_q, T.step2_q, T.step3_q, T.step4_q];
  const options = [T.step1_a, T.step2_a, T.step3_a, T.step4_a];

  const select = (val) => {
    const key = answerKeys[step];
    const newAnswers = { ...answers, [key]: val };
    setAnswers(newAnswers);

    if (step < 3) {
      setStep(step + 1);
    } else {
      const res = getResult(newAnswers.employment, newAnswers.credit, newAnswers.down, newAnswers.property);
      setResult(res);
      ga.qualifyComplete(res.loan, newAnswers.employment);
      if (res.path) {
        ga.leadQualified(res.loan);
      } else {
        ga.leadUnqualified('below_minimums');
      }
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers({ employment: null, credit: null, down: null, property: null });
    setResult(null);
  };

  const colorMap = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-300', badge: 'bg-blue-700 text-white', btn: 'bg-blue-700 hover:bg-blue-800 text-white' },
    green: { bg: 'bg-green-50', border: 'border-green-300', badge: 'bg-green-700 text-white', btn: 'bg-green-700 hover:bg-green-800 text-white' },
    indigo: { bg: 'bg-indigo-50', border: 'border-indigo-300', badge: 'bg-indigo-700 text-white', btn: 'bg-indigo-700 hover:bg-indigo-800 text-white' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-300', badge: 'bg-orange-600 text-white', btn: 'bg-orange-600 hover:bg-orange-700 text-white' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="text-blue-700 font-semibold text-sm hover:text-blue-900">
            ← Fintek Mortgage
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium text-blue-700">NMLS #2171794</span>
            <span>·</span>
            <span>Barrett Financial Group</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {!result ? (
          <>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Step {step + 1} of 4</span>
                <span>{Math.round(((step) / 4) * 100)}% complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-700 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${((step) / 4) * 100}%` }}
                />
              </div>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{T.title}</h1>
              <p className="text-gray-500 text-sm">{T.sub}</p>
            </div>

            {/* Question */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{steps[step]}</h2>
              <div className="grid gap-3">
                {options[step].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => select(opt.val)}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-left transition-all group"
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-800">{opt.label}</div>
                      <div className="text-sm text-gray-500">{opt.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="mt-4 text-sm text-gray-400 hover:text-gray-600">
                ← Back
              </button>
            )}
          </>
        ) : (
          /* Result */
          <div className={`rounded-2xl border-2 p-8 ${colorMap[result.color].bg} ${colorMap[result.color].border}`}>
            <div className="text-center mb-6">
              <span className={`inline-block text-sm font-bold uppercase tracking-wider px-4 py-1 rounded-full mb-4 ${colorMap[result.color].badge}`}>
                Recommended: {result.loan}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{result.headline}</h2>
              <p className="text-gray-600 leading-relaxed">{result.reason}</p>
            </div>

            <div className="grid gap-3">
              {result.path && (
                <button
                  onClick={() => { ga.ctaClick('qualify_result_loan', 'qualification'); navigate(result.path); }}
                  className={`w-full py-4 rounded-xl font-bold text-lg ${colorMap[result.color].btn}`}
                >
                  {result.cta_label}
                </button>
              )}

              <a
                href="https://calendly.com/abualiwael/30min"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => ga.bookingClick('qualification_result')}
                className="w-full py-4 rounded-xl font-bold text-lg bg-white border-2 border-gray-300 text-gray-800 hover:border-blue-500 hover:text-blue-700 text-center block"
              >
                📅 Book Free Consultation with Wael
              </a>

              <a
                href="tel:+19173040234"
                onClick={() => ga.callClick('qualification_result')}
                className="w-full py-4 rounded-xl font-semibold text-gray-600 hover:text-blue-700 text-center block"
              >
                📞 Call (917) 304-0234
              </a>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <button onClick={restart} className="text-sm text-gray-400 hover:text-gray-600">
                Start over
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-400 text-center">
              This tool provides general guidance only and is not a loan commitment or guarantee of terms.
              Wael Abdeldayem, NMLS #2171794 | Barrett Financial Group | Equal Housing Opportunity
            </p>
          </div>
        )}
      </div>

      <ComplianceFooter />
    </div>
  );
}
