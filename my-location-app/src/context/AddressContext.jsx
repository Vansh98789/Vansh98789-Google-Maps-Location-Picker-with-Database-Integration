import React, { createContext, useContext, useReducer } from 'react';

const AddressContext = createContext();

const initialState = {
  addresses: [],
  selectedAddress: null,
  loading: false,
  error: null
};

function addressReducer(state, action) {
  switch (action.type) {
    case 'SET_ADDRESSES':
      return { ...state, addresses: action.payload, loading: false };
    case 'SET_SELECTED_ADDRESS':
      return { ...state, selectedAddress: action.payload };
    case 'ADD_ADDRESS':
      return { ...state, addresses: [action.payload, ...state.addresses] };
    case 'UPDATE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.map(addr =>
          addr.id === action.payload.id ? action.payload : addr
        )
      };
    case 'DELETE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.filter(addr => addr.id !== action.payload)
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export function AddressProvider({ children }) {
  const [state, dispatch] = useReducer(addressReducer, initialState);

  return (
    <AddressContext.Provider value={{ state, dispatch }}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
}