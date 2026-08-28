import axios from 'axios';

export const getApiErrorMessage = (error: unknown, fallback = 'Something went wrong. Please try again.') => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.response?.data?.errorSources?.[0]?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
};

// Get the base URL from environment variables, fallback to localhost for development
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor (e.g. for handling 401s centrally)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        window.dispatchEvent(new Event('facep:unauthorized'));
      }
    }
    return Promise.reject(error);
  },
);
