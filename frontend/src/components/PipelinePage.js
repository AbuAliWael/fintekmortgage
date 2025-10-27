import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pipelineAPI } from '@/lib/api';

const PipelinePage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [pipeline, setPipeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPipeline();
  }, []);

  const loadPipeline = async () => {
    setLoading(true);
    try {
      const response = await pipelineAPI.getAll();
      setPipeline(response.data);
    } catch (error) {
      console.error('Error loading pipeline:', error);
    }
    setLoading(false);
  };

  const stages = [
    'application', 'pre_approval', 'property_search', 'offer_made',
    'under_contract', 'appraisal', 'underwriting', 'clear_to_close', 'closed'
  ];

  const getDealsByStage = (stage) => {
    return pipeline.filter(deal => deal.stage === stage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-blue-600">MortgageMaster CRM</h1>
              <div className="flex space-x-4">
                <button onClick={() => navigate('/dashboard')} className="text-gray-700 hover:text-blue-600">Dashboard</button>
                <button onClick={() => navigate('/leads')} className="text-gray-700 hover:text-blue-600">Leads</button>
                <button onClick={() => navigate('/pipeline')} className="text-blue-600 font-medium">Pipeline</button>
                <button onClick={() => navigate('/partners')} className="text-gray-700 hover:text-blue-600">Partners</button>
              </div>
            </div>
            <button onClick={onLogout} className="text-gray-700 hover:text-red-600">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Pipeline</h2>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-4" style={{ minWidth: 'max-content' }}>
              {stages.map((stage) => {
                const deals = getDealsByStage(stage);
                const stageValue = deals.reduce((sum, deal) => sum + deal.loan_amount, 0);
                
                return (
                  <div key={stage} className="bg-gray-100 rounded-lg p-4" style={{ minWidth: '280px' }}>
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 capitalize">{stage.replace('_', ' ')}</h3>
                      <p className="text-sm text-gray-600">{deals.length} deals • ${stageValue.toLocaleString()}</p>
                    </div>
                    <div className="space-y-3">
                      {deals.map((deal) => (
                        <div key={deal.id} className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="font-medium text-gray-900">${deal.loan_amount.toLocaleString()}</div>
                          <div className="text-sm text-gray-600 mt-1">Probability: {deal.probability}%</div>
                          {deal.notes && <div className="text-xs text-gray-500 mt-1">{deal.notes}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelinePage;
