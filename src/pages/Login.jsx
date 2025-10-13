import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/solid';

const Login = () => {
  const [user_name, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authService.login(user_name, password);
      // Debug: log the full login response
      console.log('Full login API response:', data);
      // Store all client details in localStorage
      // Log the full login API response data
      console.log('Login API response data:', data);
      let clientId = null;
      if (data && typeof data === 'object') {
        // Extract clientId from the login response
        clientId = data && data.data && data.data.client && data.data.client.id;
        if (!clientId) {
          // Fallback: try to extract from clientDetails if present
          const clientDetails = localStorage.getItem('clientDetails');
          if (clientDetails) {
            try {
              const parsed = JSON.parse(clientDetails);
              clientId = parsed && parsed.data && parsed.data.client && parsed.data.client.id;
              if (clientId) {
                console.log('Extracted clientId from clientDetails fallback:', clientId);
              }
            } catch (e) {
              console.error('Error parsing clientDetails for clientId fallback:', e);
            }
          }
        }
        if (clientId) {
          localStorage.setItem('clientId', clientId);
          console.log('ClientId saved to localStorage:', clientId);
        } else {
          console.warn('clientId not found in login response or clientDetails:', data);
        }
      }
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      // Try to show backend error message if available
      const apiMsg = err?.response?.data?.message || 'Invalid username or password. Please try again.';
      setError(apiMsg);
      console.error('Login error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center">
          <div className="bg-blue-600 dark:bg-blue-500 rounded-full p-3 mb-2">
            <LockClosedIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">Sign in to your account</h2>
          <p className="text-gray-500 dark:text-gray-300 text-sm">Enter your credentials to access the dashboard</p>
        </div>
        {error && <p className="text-red-500 text-center font-medium">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">User Name</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                id="user_name"
                value={user_name}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your user name"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;