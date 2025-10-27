import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsAPI } from '@/lib/api';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await analyticsAPI.dashboard();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-blue-600">MortgageMaster CRM</h1>
              <div className="flex space-x-4">
                <button onClick={() => navigate('/dashboard')} className="text-blue-600 font-medium" data-testid="nav-dashboard">Dashboard</button>
                <button onClick={() => navigate('/leads')} className="text-gray-700 hover:text-blue-600" data-testid="nav-leads">Leads</button>
                <button onClick={() => navigate('/pipeline')} className="text-gray-700 hover:text-blue-600" data-testid="nav-pipeline">Pipeline</button>
                <button onClick={() => navigate('/partners')} className="text-gray-700 hover:text-blue-600" data-testid="nav-partners">Partners</button>
              </div>
            </div>
            <button onClick={onLogout} className="text-gray-700 hover:text-red-600" data-testid="logout-button">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h2>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Total Leads</div>
              <div className="text-3xl font-bold text-blue-600">{analytics?.leads?.total || 0}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">New Leads</div>
              <div className="text-3xl font-bold text-green-600">{analytics?.leads?.new || 0}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Pipeline Deals</div>
              <div className="text-3xl font-bold text-purple-600">{analytics?.pipeline?.total_deals || 0}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Pipeline Value</div>
              <div className="text-3xl font-bold text-indigo-600">${(analytics?.pipeline?.total_value || 0).toLocaleString()}</div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button onClick={() => navigate('/leads')} className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-3 px-4 rounded-lg">
              View Leads
            </button>
            <button onClick={() => navigate('/pipeline')} className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium py-3 px-4 rounded-lg">
              Manage Pipeline
            </button>
            <button onClick={() => navigate('/partners')} className="bg-green-50 hover:bg-green-100 text-green-700 font-medium py-3 px-4 rounded-lg">
              Partners
            </button>
            <button onClick={() => navigate('/calculator')} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-3 px-4 rounded-lg">
              Calculator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
