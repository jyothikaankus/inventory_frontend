import React, { useEffect, useState } from 'react';
import api from '../lib/axios';
import { format } from 'date-fns';

interface Item {
  item_id: number;
  name: string;
  description: string;
  category: string;
  location: string;
  type: 'lost' | 'found';
  date_lost_or_found: string;
}

const ItemsList = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/items');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleClaim = async (itemId: number) => {
    try {
      await api.post('/claims', { item_id: itemId });
      // Refresh the items list
      const response = await api.get('/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error claiming item:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Items List</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 ? (
          <div className="col-span-full text-center text-gray-600">
            No items available.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.item_id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                  <p className="text-gray-600 mb-2">{item.description}</p>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Category:</span> {item.category}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Location:</span> {item.location}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Date:</span>{' '}
                  {format(new Date(item.date_lost_or_found), 'PPP')}
                </p>
              </div>
              <button
                onClick={() => handleClaim(item.item_id)}
                className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Claim Item
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ItemsList;