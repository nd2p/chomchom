import { axiosInstance } from './axios';

let requestInterceptorId;

export function setupInterceptors({ getToken } = {}) {
  if (requestInterceptorId !== undefined) {
    axiosInstance.interceptors.request.eject(requestInterceptorId);
  }

  requestInterceptorId = axiosInstance.interceptors.request.use((config) => {
    if (!config?.requiresAuth) return config;

    const token = getToken?.();

    if (!token) {
      console.warn(`[API] Missing auth token for: ${config.url}`);
      return config;
    }

    config.headers = config.headers || {};
    const authHeader = `Bearer ${token}`;

    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', authHeader);
    } else {
      config.headers.Authorization = authHeader;
    }

    return config;
  });

  return () => {
    if (requestInterceptorId !== undefined) {
      axiosInstance.interceptors.request.eject(requestInterceptorId);
      requestInterceptorId = undefined;
    }
  };
}
