import React from 'react';

const ComplianceFooter = () => {
  return (
    <div className="bg-gray-100 border-t-4 border-blue-600 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* NMLS and Licensing */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 flex-shrink-0">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="#0066CC"/>
                <path d="M50 15L85 35V65L50 85L15 65V35L50 15Z" fill="#FFD700" stroke="#000" strokeWidth="2"/>
                <text x="50" y="58" fontSize="32" fontWeight="bold" fill="#0066CC" textAnchor="middle">⌂</text>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Licensed Mortgage Broker</h3>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Wael Abdeldayem</strong> | NMLS #2171794
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Barrett Financial Group, L.L.C.</strong>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Licensed by the New Jersey Department of Banking and Insurance
              </p>
              <p className="text-xs text-gray-500">
                New Jersey Residential Mortgage Broker License
              </p>
            </div>
          </div>
        </div>

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
