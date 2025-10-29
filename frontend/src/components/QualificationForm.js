import React, { useState } from 'react';

const QualificationForm = ({ loanType = 'conventional' }) => {
  const [formData, setFormData] = useState({
    creditScore: '',
    income2023: '',
    income2024: '',
    incomeYTD2025: '',
    monthlyDebts: '',
    purchasePrice: '',
    downPayment: '',
    propertyTax: '',
    homeInsurance: '',
    hasEmploymentHistory: true
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/qualify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          loanType
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        alert('Error calculating qualification. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error calculating qualification. Please try again.');
    }
    
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      creditScore: '',
      income2023: '',
      income2024: '',
      incomeYTD2025: '',
      monthlyDebts: '',
      purchasePrice: '',
      downPayment: '',
      propertyTax: '',
      homeInsurance: '',
      hasEmploymentHistory: true
    });
    setResult(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">See If You Qualify</h3>
      
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Credit Score */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estimated Credit Score *
            </label>
            <select
              name="creditScore"
              value={formData.creditScore}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select your credit score range</option>
              <option value="750">Excellent (750+)</option>
              <option value="700">Very Good (700-749)</option>
              <option value="660">Good (660-699)</option>
              <option value="620">Fair (620-659)</option>
              <option value="580">Poor (580-619)</option>
              <option value="550">Below 580</option>
            </select>
          </div>

          {/* Employment History */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="hasEmploymentHistory"
                checked={formData.hasEmploymentHistory}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">
                I have at least 2 years of employment history
              </span>
            </label>
          </div>

          {/* Income Information */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                2023 W2 Income *
              </label>
              <input
                type="number"
                name="income2023"
                value={formData.income2023}
                onChange={handleChange}
                required
                placeholder="$75,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                2024 W2 Income *
              </label>
              <input
                type="number"
                name="income2024"
                value={formData.income2024}
                onChange={handleChange}
                required
                placeholder="$80,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                2025 YTD Income *
              </label>
              <input
                type="number"
                name="incomeYTD2025"
                value={formData.incomeYTD2025}
                onChange={handleChange}
                required
                placeholder="$70,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Monthly Debts */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Total Monthly Debt Payments *
            </label>
            <input
              type="number"
              name="monthlyDebts"
              value={formData.monthlyDebts}
              onChange={handleChange}
              required
              placeholder="$500"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Include car loans, credit cards, student loans, personal loans, etc.
            </p>
          </div>

          {/* Purchase Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Purchase Price *
              </label>
              <input
                type="number"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                required
                placeholder="$400,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Down Payment *
              </label>
              <input
                type="number"
                name="downPayment"
                value={formData.downPayment}
                onChange={handleChange}
                required
                placeholder="$80,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Property Costs */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Monthly Property Tax (Estimate) *
              </label>
              <input
                type="number"
                name="propertyTax"
                value={formData.propertyTax}
                onChange={handleChange}
                required
                placeholder="$500"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Monthly Home Insurance (Estimate) *
              </label>
              <input
                type="number"
                name="homeInsurance"
                value={formData.homeInsurance}
                onChange={handleChange}
                required
                placeholder="$150"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing Your Qualification...' : 'Check My Qualification'}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Results Display */}
          <div className={`p-6 rounded-xl ${
            result.qualified 
              ? 'bg-green-50 border-2 border-green-500' 
              : 'bg-yellow-50 border-2 border-yellow-500'
          }`}>
            <h4 className={`text-2xl font-bold mb-4 ${
              result.qualified ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {result.qualified ? '✅ Great News!' : '⚠️ Alternative Options Available'}
            </h4>
            <p className={`text-lg mb-4 ${
              result.qualified ? 'text-green-700' : 'text-yellow-700'
            }`}>
              {result.message}
            </p>
          </div>

          {/* Financial Summary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h5 className="text-lg font-bold text-gray-900 mb-4">Your Financial Summary</h5>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Calculated Monthly Income</p>
                <p className="text-2xl font-bold text-blue-600">${result.calculations?.monthlyIncome?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Monthly Housing Payment</p>
                <p className="text-2xl font-bold text-gray-900">${result.calculations?.totalHousingPayment?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Debt-to-Income Ratio (DTI)</p>
                <p className={`text-2xl font-bold ${
                  result.calculations?.dti <= 45 ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {result.calculations?.dti}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Down Payment Percentage</p>
                <p className="text-2xl font-bold text-gray-900">{result.calculations?.downPaymentPercent}%</p>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          {result.recommendations && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
              <h5 className="text-lg font-bold text-blue-900 mb-3">💡 Expert Recommendations</h5>
              <div className="text-blue-800 whitespace-pre-line">
                {result.recommendations}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={resetForm}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Check Another Scenario
            </button>
            <a
              href="https://calendly.com/waelabdali/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
            >
              📅 Schedule Consultation
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualificationForm;
