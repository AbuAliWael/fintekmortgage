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

        {/* Copyright */}
        <div className="text-center mt-8 pt-6 border-t border-gray-300">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Wael Abdeldayem - Licensed Mortgage Broker. All rights reserved.
            <br />
            NMLS #2171794 | Barrett Financial Group, L.L.C.
          </p>
        </div>

      </div>
    </div>
  );
};

export default ComplianceFooter;
