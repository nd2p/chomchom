import { axiosInstance } from './axios';

export function setupInterceptors() {
  axiosInstance.interceptors.request.use((config) => config);
}
