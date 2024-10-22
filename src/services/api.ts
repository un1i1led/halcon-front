import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useNotificationStore } from '../stores/notificationStore';

interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

interface ErrorResponseData {
  message: string;
  code?: string;
}

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000/api/';
const isDevelopment = import.meta.env?.MODE === 'development';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (isDevelopment) {
      console.log('🚀 Request:', config);
    }

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    useNotificationStore.getState().addNotification({
      type: 'error',
      message: 'Failed to send request',
      duration: 5000,
    });
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (isDevelopment) {
      console.log('✅ Response:', response);
    }

    // Optional: Show success notification for specific endpoints or methods
    if (response.config.method !== 'get') {
      useNotificationStore.getState().addNotification({
        type: 'success',
        message: response.data?.message || 'Operation successful',
        duration: 3000,
      });
    }

    return response;
  },
  async (error: AxiosError): Promise<ApiError> => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken && originalRequest) {
          // Implement your token refresh logic here
          // const newToken = await refreshTokenApi(refreshToken);
          // localStorage.setItem('token', newToken);
          // return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        useNotificationStore.getState().addNotification({
          type: 'error',
          message: 'Session expired. Please log in again.',
          duration: 5000,
        });
        console.error(refreshError);
      }
    }

    const responseData = error.response?.data as ErrorResponseData;
    const apiError: ApiError = {
      message: responseData?.message || 'An unexpected error occurred',
      code: responseData?.code,
      status: error.response?.status,
    };

    useNotificationStore.getState().addNotification({
      type: 'error',
      message: apiError.message,
      duration: 5000,
    });

    if (isDevelopment) {
      console.error('❌ Response Error:', apiError);
    }

    return Promise.reject(apiError);
  }
);

export default api;