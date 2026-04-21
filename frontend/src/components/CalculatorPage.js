import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ComplianceFooter from './ComplianceFooter';
import { ga } from '@/lib/analytics';

const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtInt = (n) => Math.round(n).toLocaleString('en-US');

function calcPI(principal, annualRatePct, termYears) {
  const r = annualRatePct / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export default function CalculatorPage() {
  const navigate = useNavigate();
  const [rates, setRates] = useState({ updated: null, rates: { '30yr_fixed': 6.81, '15yr_fixed': 6.10 } });
  const [loanAmount, setLoanAmount] = useState('');
  const [term, setTerm] = useState('30');
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('/rates.json')
      .then(r => r.json())
      .then(data => setRates(data))
      .catch(() => {}); // fallback to defaults already in state
  }, []);

  const currentRate = term === '30' ? rates.rates['30yr_fixed'] : rates.rates['15yr_fixed'];

  const calculate = () => {
    const principal = parseFloat(loanAmount.replace(/,/g, ''));
    if (!principal || principal <= 0) return;
    const monthly = calcPI(principal, currentRate, parseInt(term, 10));
    const totalPaid = monthly * parseInt(term, 10) * 12;
    const totalInterest = totalPaid - principal;
    setResult({ monthly, totalPaid, totalInterest, principal, rate: currentRate, term: parseInt(term, 10) });
    ga.calculatorUsed(principal, parseInt(term, 10), currentRate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="text-blue-700 font-semibold text-sm hover:text-blue-900">
            ← Fintek Mortgage
          </button>
          <span className="text-sm text-gray-500 font-medium">NMLS #2171794 · Barrett Financial Group</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mortgage Calculator</h1>
          <p className="text-gray-500">Principal & Interest — using current Freddie Mac average rates</p>
        </div>

        {/* Rate display */}
        <div className="bg-blue-900 text-white rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-blue-300 text-xs uppercase tracking-wider font-semibold mb-1">Current Average Rates</p>
            <div className="flex gap-6">
              <div>
                <span className="text-2xl font-bold">{rates.rates['30yr_fixed']}%</span>
                <span className="text-blue-300 text-sm ml-2">30-yr Fixed</span>
              </div>
              <div>
                <span className="text-2xl font-bold">{rates.rates['15yr_fixed']}%</span>
                <span className="text-blue-300 text-sm ml-2">15-yr Fixed</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-300 text-xs">Source: Freddie Mac PMMS</p>
            {rates.updated && <p className="text-blue-200 text-xs">Updated: {rates.updated}</p>}
          </div>
        </div>

        {/* Calculator */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Loan Amount ($)</label>
              <input
                type="text"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none"
                placeholder="e.g. 400,000"
                onKeyDown={(e) => e.key === 'Enter' && calculate()}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Loan Term</label>
              <div className="grid grid-cols-2 gap-3">
                {['30', '15'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTerm(t)}
                    className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                      term === t
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400'
                    }`}
                  >
                    {t}-Year
                    <div className="text-xs font-normal mt-0.5 opacity-75">
                      {t === '30' ? rates.rates['30yr_fixed'] : rates.rates['15yr_fixed']}%
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={calculate}
            disabled={!loanAmount}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl text-lg transition-all"
          >
            Calculate Monthly Payment
          </button>

          {result && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="text-center mb-6">
                <p className="text-gray-500 text-sm mb-1">Estimated Monthly Payment (P&I)</p>
                <p className="text-5xl font-bold text-blue-700">${fmt(result.monthly)}</p>
                <p className="text-gray-400 text-sm mt-2">
                  Using {result.rate}% · {result.term}-year fixed
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-gray-500 text-xs mb-1">Loan Amount</p>
                  <p className="font-bold text-gray-900">${fmtInt(result.principal)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-gray-500 text-xs mb-1">Total Interest Paid</p>
                  <p className="font-bold text-gray-900">${fmtInt(result.totalInterest)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-gray-500 text-xs mb-1">Total Payments</p>
                  <p className="font-bold text-gray-900">{result.term * 12} months</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-gray-500 text-xs mb-1">Total Amount Paid</p>
                  <p className="font-bold text-gray-900">${fmtInt(result.totalPaid)}</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-5 text-center">
                <p className="text-blue-900 font-semibold mb-1">Want to know your actual rate?</p>
                <p className="text-blue-700 text-sm mb-3">Your rate depends on credit score, loan type, and property. Wael can give you a real quote in minutes.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="https://calendly.com/abualiwael/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => ga.bookingClick('calculator_result')}
                    className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl"
                  >
                    📅 Book Free Consultation
                  </a>
                  <a
                    href="tel:+19173040234"
                    onClick={() => ga.callClick('calculator_result')}
                    className="bg-white border border-blue-300 text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50"
                  >
                    📞 Call (917) 304-0234
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 text-xs text-gray-400 leading-relaxed">
          <p><strong>Estimates only.</strong> This calculator shows Principal & Interest only based on Freddie Mac national average rates, updated weekly. It does not include property taxes, homeowner's insurance, HOA fees, or mortgage insurance (PMI). Actual rates vary based on credit score, loan type, property, and market conditions. This is not a loan offer or rate lock. Contact Wael Abdeldayem (NMLS #2171794) for a personalized rate quote.</p>
        </div>
      </div>

      <ComplianceFooter />
    </div>
  );
}
