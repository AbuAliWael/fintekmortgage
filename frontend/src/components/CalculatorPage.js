import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculatorAPI } from '@/lib/api';

const CalculatorPage = () => {
  const navigate = useNavigate();
  const [calcType, setCalcType] = useState('payment');
  const [paymentData, setPaymentData] = useState({
    loan_amount: '',
    loan_term_years: '30',
    down_payment: '',
    property_value: '',
    property_tax_annual: '',
    home_insurance_annual: '',
    hoa_monthly: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Market rates (should match landing page rates)
  const marketRates = {
    30: 6.19, // 30-year fixed
    15: 5.65, // 15-year fixed
    20: 5.90  // 20-year fixed (interpolated)
  };
  
  // Get current market rate based on loan term
  const getCurrentRate = () => {
    return marketRates[paymentData.loan_term_years] || 6.19;
  };

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const effectiveRate = parseFloat(getEffectiveRate());
      const response = await calculatorAPI.payment({
        loan_amount: parseFloat(paymentData.loan_amount),
        interest_rate: effectiveRate,
        loan_term_years: parseInt(paymentData.loan_term_years),
        down_payment: parseFloat(paymentData.down_payment) || 0,
        property_value: parseFloat(paymentData.property_value) || parseFloat(paymentData.loan_amount),
        property_tax_annual: parseFloat(paymentData.property_tax_annual) || 0,
        home_insurance_annual: parseFloat(paymentData.home_insurance_annual) || 0,
        hoa_monthly: parseFloat(paymentData.hoa_monthly) || 0
      });
      setResult({
        ...response.data,
        applied_rate: effectiveRate,
        base_rate: marketRates[paymentData.loan_term_years],
        points_cost: parseFloat(calculatePointsCost()),
        points_used: ratePoints
      });
    } catch (error) {
      console.error('Calculation error:', error);
      alert('Error calculating. Please check your inputs.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-blue-600">MortgageMaster Calculator</h1>
            <button onClick={() => navigate('/')} className="text-gray-700 hover:text-blue-600">
              ← Back to Home
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Mortgage Payment Calculator</h2>
          <p className="text-sm text-gray-600 mb-6">Calculate your estimated monthly payment using current market rates</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Loan Information</h3>
              
              {/* Rate Display Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Current Market Rate</h4>
                <div className="text-2xl font-bold text-blue-600">
                  {getEffectiveRate()}%
                  {ratePoints > 0 && (
                    <span className="text-sm text-green-600 ml-2">
                      (with {ratePoints} point{ratePoints > 1 ? 's' : ''})
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Base rate: {marketRates[paymentData.loan_term_years]}% for {paymentData.loan_term_years}-year fixed*
                </p>
                <p className="text-xs text-gray-500 mt-2 italic">
                  *Rate shown is the national average as of today. Your actual rate may vary based on credit score, 
                  loan-to-value ratio, property location, and other factors. This calculator provides an estimate only.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount</label>
                  <input
                    type="number"
                    value={paymentData.loan_amount}
                    onChange={(e) => setPaymentData({...paymentData, loan_amount: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 300000"
                    data-testid="calc-loan-amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term</label>
                  <select
                    value={paymentData.loan_term_years}
                    onChange={(e) => setPaymentData({...paymentData, loan_term_years: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    data-testid="calc-loan-term"
                  >
                    <option value="15">15 years ({marketRates[15]}%)</option>
                    <option value="20">20 years (~{marketRates[20]}%)</option>
                    <option value="30">30 years ({marketRates[30]}%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment</label>
                  <input
                    type="number"
                    value={paymentData.down_payment}
                    onChange={(e) => setPaymentData({...paymentData, down_payment: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional"
                    data-testid="calc-down-payment"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    💡 Put down 20%+ to avoid PMI (Private Mortgage Insurance)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Value</label>
                  <input
                    type="number"
                    value={paymentData.property_value}
                    onChange={(e) => setPaymentData({...paymentData, property_value: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Required for PMI calculation"
                    data-testid="calc-property-value"
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-4">Rate Buydown Option</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800 mb-3">
                  <strong>💰 Lower Your Rate with Points:</strong> You can pay "points" upfront to reduce your interest rate. 
                  Each point costs 1% of your loan amount and typically reduces your rate by 0.25%.
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buy Down Rate (Points): {ratePoints}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.5"
                    value={ratePoints}
                    onChange={(e) => setRatePoints(parseFloat(e.target.value))}
                    className="w-full"
                    data-testid="points-slider"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>0 points</span>
                    <span>1.5 points</span>
                    <span>3 points</span>
                  </div>
                </div>
                {ratePoints > 0 && (
                  <div className="mt-3 p-3 bg-white rounded border border-green-300">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">Points Cost:</span>
                      <span className="font-semibold text-green-700">${calculatePointsCost().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">Rate Reduction:</span>
                      <span className="font-semibold text-green-700">-{(ratePoints * 0.25).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">New Rate:</span>
                      <span className="font-bold text-green-700">{getEffectiveRate()}%</span>
                    </div>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-4">Additional Costs (Optional)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Tax (Annual)</label>
                  <input
                    type="number"
                    value={paymentData.property_tax_annual}
                    onChange={(e) => setPaymentData({...paymentData, property_tax_annual: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Home Insurance (Annual)</label>
                  <input
                    type="number"
                    value={paymentData.home_insurance_annual}
                    onChange={(e) => setPaymentData({...paymentData, home_insurance_annual: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HOA Fees (Monthly)</label>
                  <input
                    type="number"
                    value={paymentData.hoa_monthly}
                    onChange={(e) => setPaymentData({...paymentData, hoa_monthly: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <button
                onClick={handleCalculate}
                disabled={loading || !paymentData.loan_amount}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400"
                data-testid="calc-submit-button"
              >
                {loading ? 'Calculating...' : 'Calculate Payment'}
              </button>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Results</h3>
              {result ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="text-sm text-gray-600 mb-1">Estimated Monthly Payment</div>
                    <div className="text-4xl font-bold text-blue-600">${result.monthly_payment.toLocaleString()}</div>
                    <p className="text-xs text-gray-600 mt-2">
                      Using {result.applied_rate}% rate {result.points_used > 0 ? `(${result.points_used} point${result.points_used > 1 ? 's' : ''} buydown)` : '(base market rate)'}
                    </p>
                  </div>
                  
                  {/* Points Cost if applicable */}
                  {result.points_used > 0 && (
                    <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-green-800 mb-2">💰 Rate Buydown Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Points Purchased:</span>
                          <span className="font-semibold">{result.points_used}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Upfront Cost:</span>
                          <span className="font-semibold text-green-700">${result.points_cost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Rate Reduction:</span>
                          <span className="font-semibold">-{(result.points_used * 0.25).toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between border-t border-green-200 pt-2 mt-2">
                          <span className="text-gray-700">Original Rate:</span>
                          <span>{result.base_rate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-semibold">Your Rate:</span>
                          <span className="font-bold text-green-700">{result.applied_rate}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* PMI Warning if applicable */}
                  {result.has_pmi && (
                    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4" data-testid="pmi-warning">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-bold text-yellow-800">⚠️ Private Mortgage Insurance (PMI) Required</h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p className="font-semibold">Your down payment is less than 20% ({result.down_payment_percent}%)</p>
                            <p className="mt-1">This means you'll pay <strong>${result.monthly_pmi.toLocaleString()}/month</strong> in PMI until you reach 22% equity.</p>
                            <p className="mt-2 text-xs">
                              💡 <strong>Tip:</strong> With a 20% down payment (${(result.property_value * 0.20).toLocaleString()}), you can eliminate PMI and save approximately ${(result.total_pmi).toLocaleString()} over the loan term!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Principal & Interest</span>
                      <span className="font-semibold">${result.monthly_principal_interest.toLocaleString()}</span>
                    </div>
                    {result.has_pmi && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mortgage Insurance (PMI)</span>
                        <span className="font-semibold text-yellow-700">${result.monthly_pmi.toLocaleString()}</span>
                      </div>
                    )}
                    {result.monthly_tax > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property Tax</span>
                        <span className="font-semibold">${result.monthly_tax.toLocaleString()}</span>
                      </div>
                    )}
                    {result.monthly_insurance > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Home Insurance</span>
                        <span className="font-semibold">${result.monthly_insurance.toLocaleString()}</span>
                      </div>
                    )}
                    {result.monthly_hoa > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">HOA Fees</span>
                        <span className="font-semibold">${result.monthly_hoa.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Property Value</span>
                      <span className="font-semibold">${result.property_value.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Loan Amount</span>
                      <span className="font-semibold">${result.total_loan_amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Interest Paid</span>
                      <span className="font-semibold">${result.total_interest.toLocaleString()}</span>
                    </div>
                    {result.has_pmi && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total PMI Paid (estimated)</span>
                        <span className="font-semibold text-yellow-700">${result.total_pmi.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Amount Paid</span>
                      <span className="font-semibold">${(result.total_paid + (result.total_pmi || 0)).toLocaleString()}</span>
                    </div>
                    {result.down_payment > 0 && (
                      <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                        <span className="text-gray-600">Down Payment</span>
                        <span className="font-semibold text-green-600">${result.down_payment.toLocaleString()} ({result.down_payment_percent}%)</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-12 text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500">Enter loan details and click Calculate to see results</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Rate Disclaimers */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Important Rate Information & Disclaimers</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <p>
                <strong>Rate Accuracy:</strong> The rates displayed are national averages current as of today and are subject to change without notice. 
                Your actual rate will be determined based on multiple factors and may be higher or lower than the rate shown.
              </p>
              <p>
                <strong>Factors Affecting Your Rate:</strong> Your actual mortgage rate depends on your credit score, loan-to-value ratio (LTV), 
                debt-to-income ratio (DTI), property location, property type, loan amount, loan purpose (purchase vs. refinance), 
                occupancy type (primary, second home, investment), documentation type, and current market conditions.
              </p>
              <p>
                <strong>APR:</strong> The interest rates shown do not reflect the Annual Percentage Rate (APR), which includes interest plus 
                certain closing costs and fees. APR will be higher than the interest rate shown and will be disclosed at application.
              </p>
              <p>
                <strong>Points Buydown:</strong> Discount points are optional and allow you to pay upfront to reduce your interest rate. 
                One point equals 1% of your loan amount. The value of buying down your rate depends on how long you plan to keep the loan. 
                Consult with your loan officer to determine if buying points makes sense for your situation.
              </p>
              <p>
                <strong>Estimates Only:</strong> This calculator provides estimates for informational and educational purposes only. 
                It does not constitute a loan offer, rate quote, or guarantee of terms. All mortgage applications are subject to credit approval, 
                property appraisal, and underwriting guidelines.
              </p>
              <p>
                <strong>Lender Rights:</strong> The lender reserves the right to modify or withdraw any loan program, rate, or terms without prior notice. 
                Additional terms and conditions apply.
              </p>
              <p className="pt-2 border-t border-gray-200 mt-3">
                <strong>For Accurate Quote:</strong> Contact Wael Abdeldayem (NMLS #2171794) for a personalized rate quote based on your specific financial situation. 
                Rates and terms can be locked once you begin the application process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
