import axios from 'axios';

const API_BASE_URL = 'http://34.238.181.131:5600';

// Get token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    console.log('🔑 Using token from localStorage:', token.substring(0, 20) + '...');
    return token;
  } else {
    console.warn('❌ No token found in localStorage, using fallback token');
    // Fallback to your working token from the curl command
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUxMzAxY2UwLTU2OTItNDViMC05ZGQzLTUzZjZjMTRjNTg2MCIsImVtYWlsIjoiUHJpeWFuc2h1QGdtYWlsLmNvbSIsInJvbGUiOiJDbGllbnQgQWRtaW4iLCJwcm9maWxlX3VybCI6Imh0dHBzOi8vcmFpc2luZy1kZXYtYnVja2V0LnMzLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL2RldmVsb3BtZW50LzUxMzAxY2UwLTU2OTItNDViMC05ZGQzLTUzZjZjMTRjNTg2MC9sb2dvLzAxLmpwZyIsImZ1bGxfbmFtZSI6IlByaXlhbnNodSIsImlhdCI6MTc2MDYxMjM5NSwiZXhwIjoxNzYwNjk4Nzk1fQ.B0S21_DPnSMxmHByRHeZ8h1HE0hSELNy_DY4OcR_Dls';
  }
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const leadService = {
  // Get all leads
  getAllLeads: async () => {
    try {
      console.log('🔍 Fetching leads from:', API_BASE_URL + '/lead');
      const response = await apiClient.get('/lead');
      console.log('✅ Raw API response:', response.data);
      
      // Handle the API response structure: { data: [...], message: "...", status: true }
      if (response.data && response.data.data) {
        return response.data.data; // Return the actual leads array
      } else if (Array.isArray(response.data)) {
        return response.data; // Fallback if API returns array directly
      } else {
        console.warn('Unexpected API response structure:', response.data);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching leads:', error);
      throw error;
    }
  },

  // Create new lead
  createLead: async (leadData) => {
    try {
      console.log('🔍 Creating lead with data:', leadData);
      const response = await apiClient.post('/lead', leadData);
      console.log('✅ Lead created successfully:', response.data);
      
      // Handle the API response structure
      if (response.data && response.data.data) {
        return response.data.data; // Return the created lead data
      } else {
        return response.data; // Fallback
      }
    } catch (error) {
      console.error('❌ Error creating lead:', error);
      throw error;
    }
  },

  // Update lead
  updateLead: async (leadId, leadData) => {
    try {
      console.log('🔍 Updating lead:', leadId, 'with data:', leadData);
      const response = await apiClient.put(`/lead/${leadId}`, leadData);
      console.log('✅ Lead updated successfully:', response.data);
      
      // Handle the API response structure
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        return response.data;
      }
    } catch (error) {
      console.error('❌ Error updating lead:', error);
      throw error;
    }
  },

  // Delete lead
  deleteLead: async (leadId) => {
    try {
      console.log('🔍 Deleting lead:', leadId);
      const response = await apiClient.delete(`/lead/${leadId}`);
      console.log('✅ Lead deleted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting lead:', error);
      throw error;
    }
  },

  // Update lead status
  updateLeadStatus: async (leadId, status) => {
    try {
      console.log('🔍 Updating lead status:', leadId, 'to:', status);
      const response = await apiClient.put(`/lead/${leadId}`, { status });
      console.log('✅ Lead status updated successfully:', response.data);
      
      // Handle the API response structure
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        return response.data;
      }
    } catch (error) {
      console.error('❌ Error updating lead status:', error);
      throw error;
    }
  }
};