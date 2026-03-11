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
   * TODO: Replace with real API call
   * POST /auth/register
   */
  register: async (payload) => {
    await delay(1500);
    return {
      user: { id: '2', name: payload.name, email: payload.email, provider: 'email' },
      token: 'mock-token-register',
    };
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
