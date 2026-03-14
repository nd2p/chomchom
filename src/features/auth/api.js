import { axiosInstance } from '../../services/api/axios';
import { endpoints } from '../../services/api/endpoints';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const authApi = {
  /**
   * TODO: Replace with real API call
   * POST /auth/login
   */
  login: async (payload) => {
    const { data } = await axiosInstance.post(endpoints.auth.login, {
      email: payload.email,
      password: payload.password,
    });

    const user = {
      username: data.username,
      email: data.email,
      role: data.role,
    };

    return { user, token: data.token };
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

  logout: async () => {
    // No server endpoint — token is cleared locally by the auth store.
  },
};
