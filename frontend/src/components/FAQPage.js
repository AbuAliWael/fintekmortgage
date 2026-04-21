import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ComplianceFooter from './ComplianceFooter';
import { ga } from '@/lib/analytics';

export default function FAQPage() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    ga.loanPageView('faq');
  }, []);

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How much house can I afford?',
          a: 'A general rule is the 28% rule: spend no more than 28% of your gross monthly income on your mortgage payment (principal + interest). Use our calculator to estimate your payment. Pre-approval gives you the exact number based on your actual financials.',
        },
        {
          q: "What's the difference between pre-qualification and pre-approval?",
          a: 'Pre-qualification is a rough estimate based on self-reported info. Pre-approval means the lender has reviewed your documents, credit report, and employment — and issued a conditional commitment. Pre-approval is what you need to make a serious offer on a home.',
        },
        {
          q: 'How much down payment do I need?',
          a: 'It depends on the loan type: FHA loans require 3.5% (580+ credit) or 10% (500–579). Conventional loans start at 3% for primary residences. Non-QM loans require 20%+. Putting 20%+ down on a conventional loan eliminates PMI entirely.',
        },
      ],
    },
    {
      category: 'Loan Types',
      questions: [
        {
          q: 'What is a Non-QM loan?',
          a: "Non-QM (Non-Qualified Mortgage) loans don't require tax returns or W-2s. Instead they use bank statements (12–24 months), 1099s, P&L statements, or asset depletion as income verification. They're designed for self-employed borrowers, cash-based earners, investors, and foreign nationals. Typical requirements: 680+ credit score and 20%+ down payment.",
        },
        {
          q: 'Should I choose a 15-year or 30-year mortgage?',
          a: '30-year: lower monthly payment, higher total interest paid. 15-year: higher monthly payment, much less total interest, equity builds faster. If you can comfortably afford the 15-year payment, it almost always wins mathematically. If cash flow is tight, the 30-year gives you flexibility.',
        },
        {
          q: 'What is a DSCR loan?',
          a: "DSCR (Debt Service Coverage Ratio) loans qualify you based on the rental income of the investment property — not your personal income. If the property's rent covers its mortgage payment (DSCR ≥ 1.0–1.25), you can qualify. No personal income docs required. This is the primary tool for building a rental portfolio.",
        },
        {
          q: 'What types of mortgages are available?',
          a: 'Common types: Fixed-rate (15 or 30 years), Adjustable-rate (ARM), FHA (low down payment, flexible credit), Conventional (best rates for qualified buyers), Non-QM/Bank Statement (no tax returns), and DSCR (investment properties based on rental income).',
        },
      ],
    },
    {
      category: 'Qualification Requirements',
      questions: [
        {
          q: 'What credit score do I need to buy a home?',
          a: 'Minimums: FHA 580 (3.5% down) or 500 (10% down). Conventional 620+. Non-QM 680+. Higher scores unlock better rates. 740+ gets the best pricing on conventional loans. If your score is below the minimum, I can help you with a plan to improve it.',
        },
        {
          q: 'What is debt-to-income (DTI) ratio?',
          a: 'DTI = total monthly debt payments ÷ gross monthly income. Example: $2,000 monthly debt on $6,000 income = 33% DTI. Most conventional loans allow up to 50% DTI. FHA allows up to 55%. Lower DTI improves your approval odds and rate.',
        },
        {
          q: 'Can I get a mortgage without traditional employment?',
          a: 'Yes — Non-QM loans are built for this. Self-employed, 1099, cash-based, real estate investors, retirees, and foreign nationals can all qualify using bank statements, assets, or rental income. Typical requirements: 680+ credit and 20%+ down payment.',
        },
      ],
    },
    {
      category: 'Refinancing',
      questions: [
        {
          q: 'When should I refinance my mortgage?',
          a: "Refinancing makes sense when: rates have dropped 0.5%+ below yours, your credit has improved significantly since you bought, you want to switch from ARM to fixed, you want to remove FHA MIP (requires refinancing to conventional), or you need cash from your equity.",
        },
        {
          q: "What's the difference between rate-and-term and cash-out refinance?",
          a: 'Rate-and-term: changes your rate and/or loan term without taking cash out. Cash-out: you borrow more than you owe and receive the difference at closing — at mortgage rates, which are typically much lower than credit cards or personal loans.',
        },
        {
          q: 'How much equity do I need to refinance?',
          a: 'For conventional refinance: 20% equity is standard. FHA streamline: as little as 5%. Cash-out refinance: typically requires you to maintain 20% equity after taking cash out. On a $500K home, that means your new loan can be up to $400K.',
        },
      ],
    },
    {
      category: 'Costs & Process',
      questions: [
        {
          q: 'What are closing costs?',
          a: 'Closing costs typically run 2–5% of the loan amount and include: appraisal, title insurance, origination fees, credit report, recording fees, and prepaid items (taxes, insurance). On a $400,000 loan expect $8,000–$20,000. Some can be negotiated or rolled into the loan.',
        },
        {
          q: 'What is PMI and how can I avoid it?',
          a: 'PMI (Private Mortgage Insurance) is required on conventional loans when you put less than 20% down — typically 0.5–1% of the loan annually. You avoid it by: putting 20%+ down, or removing it once you reach 20% equity. FHA has its own MIP which works differently and is harder to remove.',
        },
        {
          q: 'How long does it take to close on a mortgage?',
          a: 'Fintek Mortgage closes in an average of 23 days. Industry standard is 30–45 days. Timeline depends on: how quickly you provide documents, appraisal scheduling, loan type, and underwriting workload. Being responsive makes the biggest difference.',
        },
      ],
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
              onClick={() => { ga.ctaClick('faq_qualify_header', 'faq_page'); navigate('/qualify'); }}
              className="text-sm border border-blue-600 text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              Check My Eligibility
            </button>
            <a
              href="https://calendly.com/abualiwael/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => ga.bookingClick('faq_header')}
              className="text-sm bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg"
            >
              Book Consultation
            </a>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Mortgage FAQ</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Straight answers to the questions every homebuyer asks. No fluff.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-5 mb-12 rounded-r-xl">
            <p className="text-blue-900 text-sm">
              <strong>Still have questions?</strong> These cover the most common situations. For anything specific to your case,{' '}
              <a
                href="https://calendly.com/abualiwael/30min"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => ga.bookingClick('faq_inline')}
                className="underline font-semibold"
              >
                book a free 30-minute call
              </a>{' '}
              or call <a href="tel:+19173040234" onClick={() => ga.callClick('faq_inline')} className="underline font-semibold">(917) 304-0234</a>.
            </p>
          </div>

          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="bg-blue-700 text-white rounded-full w-9 h-9 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {sectionIndex + 1}
                </span>
                {section.category}
              </h2>

              <div className="space-y-3">
                {section.questions.map((faq, questionIndex) => {
                  const globalIndex = `${sectionIndex}-${questionIndex}`;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div key={globalIndex} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => toggleAccordion(globalIndex)}
                        className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 pr-4 text-sm leading-relaxed">{faq.q}</span>
                        <svg
                          className={`w-5 h-5 text-blue-600 flex-shrink-0 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-3xl p-10 text-center mt-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Take the Next Step?</h2>
            <p className="text-blue-200 mb-8">Check your eligibility in 60 seconds — or book a call to talk through your specific situation.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => { ga.ctaClick('faq_bottom_qualify', 'faq_page'); navigate('/qualify'); }}
                className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold px-8 py-4 rounded-xl"
              >
                Check My Eligibility
              </button>
              <a
                href="https://calendly.com/abualiwael/30min"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => ga.bookingClick('faq_bottom')}
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl"
              >
                Book Free Consultation
              </a>
            </div>
            <p className="mt-6 text-sm text-blue-300">Wael Abdeldayem · NMLS #2171794 · Barrett Financial Group · Licensed NJ · NY · CT</p>
          </div>
        </div>
      </section>

      <ComplianceFooter />
    </div>
  );
}
