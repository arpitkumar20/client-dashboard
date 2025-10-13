import axios from 'axios';

const API_BASE_URL = 'http://34.238.181.131:5600';




const clientService = {
  getClientById: async (id) => {
    if (!id) { 
      console.error('No client ID provided to getClientById');
      return null;
    }
    const url = `${API_BASE_URL}/client/${id}`;
    try {
      console.log('GET client request URL:', url);
      const response = await axios.get(url);
      console.log('GET client response:', response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Get client by ID error:', error.response.data);
      } else {
        console.error('Get client by ID error:', error.message);
      }
      throw error;
    }
  },

  updateClient: async (id, formData) => {
    try {
      // Debug: log all FormData entries and URL
      const url = `${API_BASE_URL}/client/${id}`;
      console.log('Calling updateClient with PUT:', url);
      if (formData && typeof formData.forEach === 'function') {
        console.log('FormData being sent to updateClient:');
        formData.forEach((value, key) => {
          console.log(key, value);
        });
      }
      const response = await axios.put(url, formData);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Update client error response:', error.response.data);
      }
      console.error('Update client error:', error);
      throw error;
    }
  },
};

export default clientService;
