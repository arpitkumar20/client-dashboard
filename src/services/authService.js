import axios from 'axios';

const API_BASE_URL = 'http://34.238.181.131:5600';

const authService = {
  login: async (user_name, password) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/client/login`,
        {
          user_name,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },
};

export default authService;