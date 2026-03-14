import { axiosInstance } from '../../services/api/axios';
import { endpoints } from '../../services/api/endpoints';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const authApi = {
  /**
   * TODO: Replace with real API call
   * POST /auth/login
   */
  login: async (payload) => {
    await delay(1500);
    return {
      user: { id: '1', name: 'Reader', email: payload.email, provider: 'email' },
      token: 'mock-token-email',
    };
  },

  /**
   * POST /api/auth/register
   * Body: { username, email, password }
   */
  register: async (payload) => {
    const { data } = await axiosInstance.post(endpoints.auth.register, {
      username: payload.username,
      email: payload.email,
      password: payload.password,
    });
    return data;
  },

  /**
   * TODO: Integrate expo-auth-session + Google OAuth
   */
  loginWithGoogle: async () => {
    await delay(1500);
    return {
      user: { id: '3', name: 'Google User', email: 'user@gmail.com', provider: 'google' },
      token: 'mock-token-google',
    };
  },

  /**
   * TODO: POST /auth/logout
   */
  logout: async () => {
    await delay(300);
  },
};
