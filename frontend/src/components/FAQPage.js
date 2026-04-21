import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FAQPage = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How much house can I afford?",
          a: "A general rule is the 28% rule: spend no more than 28% of your gross monthly income on your mortgage payment (including principal, interest, taxes, and insurance). Use our mortgage calculator to estimate your maximum payment based on your income and expenses. Pre-approval will give you a more accurate budget."
        },
        {
          q: "What's the difference between pre-qualification and pre-approval?",
          a: "Pre-qualification is a preliminary estimate based on self-reported financial information. Pre-approval is stronger—it involves a lender reviewing your financial documents, credit report, and employment verification. Pre-approval shows sellers you're a serious buyer and clarifies your actual buying power."
        },
        {
          q: "How much down payment do I need?",
          a: "Down payment requirements vary by loan type: FHA loans require as little as 3.5%, Conventional loans typically 3-20%, VA loans offer 0% down for eligible veterans. However, putting down 20% or more helps you avoid Private Mortgage Insurance (PMI) and often secures better rates."
        }
      ]
    },
    {
      category: "Loan Types",
      questions: [
        {
          q: "What types of mortgages are available?",
          a: "Common types include: Fixed-rate mortgages (15 or 30 years with constant interest), Adjustable-rate mortgages (ARMs with lower initial rates that adjust later), FHA loans (low down payment, flexible credit), VA loans (0% down for veterans), USDA loans (rural properties), and Conventional loans (flexible options, competitive rates)."
        },
        {
          q: "What is a Non-QM loan?",
          a: "Non-QM (Non-Qualified Mortgage) loans are designed for borrowers who don't fit traditional lending criteria. They don't require tax returns and use alternative income verification methods like bank statements. Ideal for self-employed, real estate investors, or those with unique financial situations. Typically require 20%+ down payment and 660+ credit score."
        },
        {
          q: "Should I choose a 15-year or 30-year mortgage?",
          a: "30-year mortgages have lower monthly payments but higher total interest over time. 15-year mortgages have higher monthly payments but save significantly on interest and build equity faster. Choose based on your financial goals, monthly budget, and long-term plans."
        }
      ]
    },
    {
      category: "Qualification Requirements",
      questions: [
        {
          q: "What credit score do I need to buy a home?",
          a: "Minimum credit scores vary: FHA loans accept 580+ (580-619 requires 10% down, 620+ requires 3.5% down), Conventional loans typically require 620+, VA loans often 620+, and Non-QM loans usually 660+. Higher credit scores qualify for better interest rates. We can help improve your credit profile if needed."
        },
        {
          q: "What is debt-to-income (DTI) ratio and why does it matter?",
          a: "DTI ratio is your total monthly debt payments divided by your gross monthly income. Most lenders prefer DTI below 43%, though some programs allow higher. For example, if you earn $6,000/month and have $2,000 in debt payments, your DTI is 33%. Lower DTI improves your chances of approval and better rates."
        },
        {
          q: "Can I get a mortgage without traditional employment?",
          a: "Yes! Non-QM loans and certain portfolio products don't require W-2s or tax returns. With sufficient down payment (20%+ to avoid mortgage insurance) and good credit, self-employed individuals, gig workers, real estate investors, and retirees can qualify using bank statements, assets, or alternative income documentation."
        }
      ]
    },
    {
      category: "Refinancing",
      questions: [
        {
          q: "When should I refinance my mortgage?",
          a: "Consider refinancing when: interest rates drop significantly (typically 0.5-1% lower), you want to switch from ARM to fixed-rate, you need to access home equity (cash-out refinance), or you want to remove PMI after reaching 20% equity. Our team can analyze if refinancing makes financial sense for your situation."
        },
        {
          q: "What's the difference between rate-and-term and cash-out refinance?",
          a: "Rate-and-term refinance changes your interest rate and/or loan term without taking cash out—often used to secure lower rates or change loan duration. Cash-out refinance allows you to borrow against your home's equity, receiving the difference in cash at closing—useful for home improvements, debt consolidation, or investments."
        },
        {
          q: "How much equity do I need to refinance?",
          a: "Most lenders require you to maintain at least 20% equity in your home after refinancing with a conventional loan. For example, if your home is worth $400,000, you'd need to keep $80,000 equity. FHA and VA refinances may have different equity requirements."
        }
      ]
    },
    {
      category: "Costs & Payments",
      questions: [
        {
          q: "What are closing costs and how much are they?",
          a: "Closing costs typically range from 2-5% of the loan amount and include: appraisal fee, title insurance, origination fees, credit report fees, recording fees, and prepaid items (taxes, insurance). On a $300,000 loan, expect $6,000-$15,000 in closing costs. Some can be rolled into the loan or negotiated with the seller."
        },
        {
          q: "What is PMI and how can I avoid it?",
          a: "Private Mortgage Insurance (PMI) protects the lender if you default. It's required on conventional loans with less than 20% down payment, typically costing 0.5-1% of the loan amount annually. You can avoid PMI by: putting 20%+ down, using piggyback loans, or choosing VA loans (no PMI required)."
        },
        {
          q: "How long does it take to close on a mortgage?",
          a: "Our average close time is 23 days, though industry standard is 30-45 days. Timeline depends on: loan type (VA/FHA take longer), documentation completeness, appraisal scheduling, and underwriting workload. Being responsive and providing documents quickly helps expedite the process."
        }
      ]
    },
    {
      category: "Special Situations",
      questions: [
        {
          q: "Can I buy a home with bad credit?",
          a: "Yes! While higher credit scores get better rates, FHA loans accept scores as low as 580 (some lenders go to 500 with 10% down). Focus on: paying down debt, fixing credit report errors, avoiding new credit applications, and working with us to explore all available programs tailored to your credit situation."
        },
        {
          q: "What programs are available for first-time homebuyers?",
          a: "First-time buyers can access: FHA loans (3.5% down), Conventional 97 loans (3% down), state/local down payment assistance grants, first-time buyer tax credits, and homebuyer education courses (sometimes required for certain programs). Many states offer special programs with income and purchase price limits."
        },
        {
          q: "Do I need to provide tax returns?",
          a: "For conventional, FHA, and VA loans: usually yes (2 years of tax returns). For Non-QM loans: no tax returns required—we use bank statements, asset depletion, or other alternative documentation. This is ideal for self-employed borrowers, business owners, or those with complex tax situations showing lower income."
        }
      ]
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/')} className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
                <img 
                  src="https://customer-assets.emergentagent.com/job_mortgage-mastery/artifacts/y2wa234f_Wael%27s%20Pic.jpg"
                  alt="Wael Abdeldayem"
                  className="h-16 w-16 rounded-full object-cover border-2 border-blue-600"
                />
                <div>
                  <h1 className="text-2xl font-bold text-blue-600">Wael Abdeldayem</h1>
                  <p className="text-xs text-gray-600">Licensed Mortgage Broker</p>
                </div>
              </button>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                ← Back to Home
              </button>
              <button
                onClick={() => navigate('/calculator')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Calculator
              </button>
              <a
                href="https://181106.my1003app.com/2171794/register?time=1742858528979"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Complete Application
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl opacity-90">Everything you need to know about mortgages, answered by experts</p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-12 rounded-r-lg">
          <p className="text-blue-900">
            <strong>💡 Have more questions?</strong> These are the most common questions from homebuyers. 
            Can't find your answer? <a href="https://calendly.com/abualiwael/30min" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Schedule a free consultation</a> or contact me directly at Wael@BarrettFinancial.com
          </p>
        </div>

        {faqs.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3 text-lg">
                {sectionIndex + 1}
              </span>
              {section.category}
            </h2>
            
            <div className="space-y-4">
              {section.questions.map((faq, questionIndex) => {
                const globalIndex = `${sectionIndex}-${questionIndex}`;
                const isOpen = openIndex === globalIndex;
                
                return (
                  <div key={globalIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <button
                      onClick={() => toggleAccordion(globalIndex)}
                      className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                      <svg
                        className={`w-6 h-6 text-blue-600 flex-shrink-0 transform transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isOpen && (
                      <div className="px-6 pb-5 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl shadow-xl p-12 text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-xl mb-8 opacity-90">
            I'm here to help! Schedule a free 30-minute consultation to discuss your unique situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://calendly.com/abualiwael/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition-colors shadow-lg"
            >
              📅 Schedule Free Consultation
            </a>
            <a
              href="mailto:Wael@BarrettFinancial.com"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-lg transition-colors"
            >
              ✉️ Email Me
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_mortgage-mastery/artifacts/y2wa234f_Wael%27s%20Pic.jpg"
              alt="Wael Abdeldayem"
              className="h-16 w-16 rounded-full object-cover border-2 border-white"
            />
            <div className="text-left">
              <h4 className="text-xl font-bold">Wael Abdeldayem</h4>
              <p className="text-gray-400 text-sm">Licensed Mortgage Broker | NMLS #2171794</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Email: Wael@BarrettFinancial.com
          </p>
          <div className="border-t border-gray-800 pt-6 text-xs text-gray-400">
            <p>&copy; 2025 Wael Abdeldayem - Licensed Mortgage Broker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FAQPage;
