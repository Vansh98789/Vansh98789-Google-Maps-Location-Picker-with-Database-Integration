import { useState, useCallback } from 'react';

export const useGeocoding = () => {
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAddressFromCoordinates = useCallback(async (latitude, longitude) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === 'OK') {
        const addressResult = data.results[0];
        setAddress({
          formatted_address: addressResult.formatted_address,
          address_components: addressResult.address_components
        });
      } else {
        throw new Error('Failed to get address');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCoordinatesFromAddress = useCallback(async (addressString) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressString)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === 'OK') {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      } else {
        throw new Error('Failed to get coordinates');
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    address,
    error,
    loading,
    getAddressFromCoordinates,
    getCoordinatesFromAddress
  };
};