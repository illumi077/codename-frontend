export default {
  server: {
    proxy: {
      '/api': 'https://your-backend-url.onrender.com', // Proxy API calls to your backend
    },
  },
};