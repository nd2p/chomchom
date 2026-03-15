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
      _id: data._id,
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
   * Post Google ID Token to backend
   * POST /api/auth/google
   */
  loginWithGoogle: async (idToken) => {
    const { data } = await axiosInstance.post(endpoints.auth.google, {
      idToken,
    });

    const user = {
      _id: data.user._id,
      username: data.user.username,
      email: data.user.email,
      role: data.user.role,
    };

    return { user, token: data.accessToken };
  },

  logout: async () => {
    // No server endpoint — token is cleared locally by the auth store.
  },
};
