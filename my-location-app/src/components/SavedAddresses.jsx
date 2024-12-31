import React, { useEffect, useState } from 'react';
import { Home, Briefcase, Users, Star, Trash2, MapPin, Search } from 'lucide-react';
import { useAddress } from '../context/AddressContext';
import { addressService } from '../services/api';

const iconMap = {
  home: Home,
  office: Briefcase,
  family: Users
};

export default function SavedAddresses({ onSelectAddress }) {
  const { state, dispatch } = useAddress();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const response = await addressService.getAllAddresses();
        dispatch({ type: 'SET_ADDRESSES', payload: response.data });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch addresses' });
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await addressService.deleteAddress(id);
      dispatch({ type: 'DELETE_ADDRESS', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete address' });
    }
  };

  const handleToggleFavorite = async (id, currentStatus) => {
    try {
      const response = await addressService.toggleFavorite(id, !currentStatus);
      dispatch({ type: 'UPDATE_ADDRESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update favorite status' });
    }
  };

  const filteredAddresses = state.addresses.filter(address => 
    address.street_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAddresses = [...filteredAddresses].sort((a, b) => {
    // Sort by favorite status first
    if (a.is_favorite !== b.is_favorite) {
      return b.is_favorite ? 1 : -1;
    }
    // Then sort by creation date
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search saved addresses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-4">Loading addresses...</div>
      ) : sortedAddresses.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          {searchTerm ? 'No addresses match your search' : 'No saved addresses yet'}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedAddresses.map((address) => {
            const Icon = iconMap[address.label] || Home;
            return (
              <div
                key={address.id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Icon className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium">{address.house_number}</p>
                      <p className="text-sm text-gray-600">{address.street_address}</p>
                      <p className="text-sm text-gray-500">{address.area}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleFavorite(address.id, address.is_favorite)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          address.is_favorite ? 'text-yellow-400 fill-current' : 'text-gray-400'
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="p-1 hover:bg-gray-100 rounded text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onSelectAddress(address)}
                  className="mt-3 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Select for Delivery
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}