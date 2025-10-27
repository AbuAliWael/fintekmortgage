import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { partnerAPI } from '@/lib/api';

const PartnersPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    setLoading(true);
    try {
      const response = await partnerAPI.getAll();
      setPartners(response.data);
    } catch (error) {
      console.error('Error loading partners:', error);
    }
    setLoading(false);
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
                <button onClick={() => navigate('/pipeline')} className="text-gray-700 hover:text-blue-600">Pipeline</button>
                <button onClick={() => navigate('/partners')} className="text-blue-600 font-medium">Partners</button>
              </div>
            </div>
            <button onClick={onLogout} className="text-gray-700 hover:text-red-600">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Referral Partners</h2>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : partners.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No referral partners yet. Add partners to track referrals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <div key={partner.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
                    <p className="text-sm text-gray-600">{partner.company}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${partner.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {partner.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {partner.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {partner.phone}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{partner.total_referrals}</div>
                      <div className="text-xs text-gray-600">Total Referrals</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{partner.total_closed}</div>
                      <div className="text-xs text-gray-600">Closed Deals</div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <span className="text-xs text-gray-500 capitalize">{partner.type}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnersPage;
