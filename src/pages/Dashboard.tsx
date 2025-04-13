import React, { useEffect, useState } from 'react';
import api from '../lib/axios';
import { Package, Search, CheckCircle } from 'lucide-react';
import logo from './logo.svg';
interface Stats {
  totalItems: number;
  totalLost: number;
  totalFound: number;
  totalClaims: number;
}

function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalItems: 0,
    totalLost: 0,
    totalFound: 0,
    totalClaims: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [itemsResponse, claimsResponse] = await Promise.all([
          api.get('/items'),
          api.get('/claims')
        ]);

        const items = itemsResponse.data;
        const claims = claimsResponse.data;

        setStats({
          totalItems: items.length,
          totalLost: items.filter((item: any) => item.type === 'lost').length,
          totalFound: items.filter((item: any) => item.type === 'found').length,
          totalClaims: claims.length
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-500" />
            
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalItems}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Search className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lost Items</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalLost}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Found Items</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalFound}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Claims</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalClaims}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;