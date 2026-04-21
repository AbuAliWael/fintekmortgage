import React from 'react';

const ComplianceFooter = () => {
  return (
    <div className="bg-gray-100 border-t-4 border-blue-600 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Important Disclosures */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
          <h4 className="font-bold text-gray-900 mb-3 text-sm">IMPORTANT DISCLOSURES</h4>
          <div className="space-y-2 text-xs text-gray-700">
            <p>
              <strong>Rate and Payment Estimates:</strong> All interest rates, monthly payments, and debt-to-income ratios displayed are estimates only and subject to change without notice. Actual rates and terms will be determined based on credit history, income verification, property appraisal, and other underwriting factors at the time of formal application.
            </p>
            <p>
              <strong>Mortgage Insurance:</strong> FHA loans require both upfront and annual mortgage insurance premiums (MIP) regardless of down payment amount. Conventional loans require private mortgage insurance (PMI) when down payment is less than 20%. PMI can typically be removed once 20% equity is achieved. VA loans do not require mortgage insurance but have a funding fee.
            </p>
            <p>
              <strong>Equal Housing Opportunity:</strong> We are committed to providing equal professional service to all persons without regard to race, color, religion, sex, handicap, familial status, or national origin.
            </p>
            <p>
              <strong>Licensing:</strong> This is not a commitment to lend. All loans are subject to credit approval and property appraisal. Programs, rates, terms, and conditions are subject to change without notice. Other restrictions may apply.
            </p>
          </div>
        </div>

        {/* Privacy and Additional Info */}
        <div className="text-xs text-gray-600">
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Fair Lending Notice</h5>
            <p>
              We do business in accordance with the Federal Fair Housing Law and the Equal Credit Opportunity Act. It is illegal to discriminate against any person because of race, color, religion, national origin, sex, marital status, age, or because they receive public assistance or exercised a right under the Consumer Credit Protection Act.
            </p>
          </div>
        </div>

        {/* Contact + CTA */}
        <div className="text-center mt-6 py-4 bg-blue-600 rounded-lg">
          <p className="text-white font-semibold text-sm mb-1">Ready to get pre-approved? Same-day results.</p>
          <p className="text-blue-100 text-sm">
            <a href="tel:+19173040234" className="underline font-bold text-white">📞 (917) 304-0234</a>
            &nbsp;·&nbsp;
            <a href="https://calendly.com/abualiwael/30min" target="_blank" rel="noopener noreferrer" className="underline font-bold text-white">📅 Book Free Call</a>
            &nbsp;·&nbsp;
            <a href="/apply" className="underline font-bold text-white">Apply Online</a>
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center mt-6 pt-6 border-t border-gray-300">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Wael Abdeldayem - Licensed Mortgage Broker. All rights reserved.
            <br />
            NMLS #2171794 | Barrett Financial Group, L.L.C. | Equal Housing Lender 🏠
          </p>
        </div>

      </div>
    </div>
  );
};

export default ComplianceFooter;
