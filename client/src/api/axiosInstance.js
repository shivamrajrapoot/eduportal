// client/src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = window.__accessToken__;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // proxy use karo — hardcoded URL nahi
        const res = await axios.get('/api/auth/refresh', {
          withCredentials: true,
        });

        const newToken = res.data.data.accessToken;
        window.__accessToken__ = newToken;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);

      } catch (err) {
        window.__accessToken__ = null;
        // commented line hata diya — AuthContext handle karta hai
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;