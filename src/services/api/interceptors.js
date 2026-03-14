import { axiosInstance } from './axios';

let requestInterceptorId;

export function setupInterceptors({ getToken } = {}) {
  if (requestInterceptorId !== undefined) {
    axiosInstance.interceptors.request.eject(requestInterceptorId);
  }

  requestInterceptorId = axiosInstance.interceptors.request.use((config) => {
    if (!config?.requiresAuth) return config;

    const token = getToken?.();
    if (!token) return config;

    if (typeof config.headers?.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token}`);
      return config;
    }

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
    return config;
  });

  return () => {
    if (requestInterceptorId !== undefined) {
      axiosInstance.interceptors.request.eject(requestInterceptorId);
      requestInterceptorId = undefined;
    }
  };
}
