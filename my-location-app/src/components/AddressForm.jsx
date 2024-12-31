import React, { useState } from 'react';
import { useAddress } from '../context/AddressContext';
import { Home, Briefcase, Users } from 'lucide-react';
import axios from 'axios';

const AddressForm = ({ selectedLocation, onSubmit, onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    type: 'home',
    houseNumber: '',
    street: '',
    area: '',
    landmark: ''
  });

  const addressTypes = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'office', icon: Briefcase, label: 'Office' },
    { id: 'other', icon: Users, label: 'Other' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create the address payload
      const addressPayload = {
        type: formData.type,
        houseNumber: formData.houseNumber,
        street: formData.street,
        area: formData.area,
        landmark: formData.landmark,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        fullAddress: selectedLocation.address
      };

      // Make API call to save address
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/addresses`, 
        addressPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if you're using authentication
            // 'Authorization': `Bearer ${yourAuthToken}`
          }
        }
      );

      if (response.data) {
        console.log('Address saved successfully:', response.data);
        onSubmit(); // Call the onSubmit callback to move to the next step
      }
    } catch (err) {
      console.error('Error saving address:', err);
      setError(err.message || 'Failed to save address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 mb-4">
          {error}
        </div>
      )}
      
      <div className="flex space-x-4">
        {addressTypes.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type: id }))}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              formData.type === id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Icon className="w-6 h-6 mx-auto mb-2" />
            <span className="block text-sm text-center">{label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">House/Flat Number</label>
          <input
            type="text"
            value={formData.houseNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, houseNumber: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Street/Road Name</label>
          <input
            type="text"
            value={formData.street}
            onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Area/Locality</label>
          <input
            type="text"
            value={formData.area}
            onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Landmark (Optional)</label>
          <input
            type="text"
            value={formData.landmark}
            onChange={(e) => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 text-sm text-white rounded transition ${
            isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isSubmitting ? 'Saving...' : 'Save Address'}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;