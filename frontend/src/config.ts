const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  isProduction: import.meta.env.PROD,
};

export default config; 