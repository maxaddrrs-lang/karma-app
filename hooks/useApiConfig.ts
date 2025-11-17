import { useContext } from 'react';
import { ApiConfigContext } from '../context/ApiConfigContext';

export const useApiConfig = () => {
  const context = useContext(ApiConfigContext);
  if (context === undefined) {
    throw new Error('useApiConfig must be used within an ApiConfigProvider');
  }
  return context;
};
