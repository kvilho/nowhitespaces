import authService from '../services/authService';

export const getHeaders = () => {
  const token = authService.getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}; 