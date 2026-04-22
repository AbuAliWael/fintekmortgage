import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ReferralLanding() {
  const { realtorName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Store referral source for lead tagging
    if (realtorName) {
      sessionStorage.setItem('referral_source', realtorName);
      sessionStorage.setItem('referral_type', 'realtor');
    }
    // Immediately redirect to pre-qual form
    navigate('/get-started', { replace: true });
  }, [realtorName, navigate]);

  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center">
      <p className="text-white text-lg">Loading your pre-qualification form...</p>
    </div>
  );
}
