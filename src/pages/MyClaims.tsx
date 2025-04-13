import React, { useEffect, useState } from 'react';
import api from '../lib/axios';
import { format } from 'date-fns';
import { useAuthStore } from '../stores/auth';

interface Claim {
  claim_id: number;
  item_id: number;
  user_id: number;
  status: string;
  created_at: string;
  item: {
    name: string;
    description: string;
    type: string;
  };
}

const MyClaims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        if (user) {
          const response = await api.get(`/claims/user/${user.user_id}`);
          setClaims(response.data);
        }
      } catch (error) {
        console.error('Error fetching claims:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Claims</h1>
      <div className="space-y-4">
        {claims.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">You haven't made any claims yet.</p>
          </div>
        ) : (
          claims.map((claim) => (
            <div key={claim.claim_id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{claim.item.name}</h2>
                  <p className="text-gray-600 mb-2">{claim.item.description}</p>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Claimed on: {format(new Date(claim.created_at), 'PPP')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyClaims;