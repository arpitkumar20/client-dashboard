import React, { useState, useEffect } from 'react';
import { Menu } from '@headlessui/react';
import { BellIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useNavigate } from 'react-router-dom'; // ✅ Add this line

export const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useDarkMode();
  const navigate = useNavigate(); // ✅ Initialize navigate
  const [notifications] = useState([
    { id: 1, message: 'New appointment scheduled', time: '5 minutes ago' },
    { id: 2, message: 'Lead status updated', time: '10 minutes ago' },
    { id: 3, message: 'System maintenance scheduled', time: '1 hour ago' },
  ]);
  const [profileUrl, setProfileUrl] = useState(null);
  const [fullName, setFullName] = useState('Admin User');
  const [role, setRole] = useState('Hospital Administrator');

  useEffect(() => {
    // Get profile_url from localStorage
    const clientDetails = localStorage.getItem('clientDetails');
    if (clientDetails) {
      try {
        const parsed = JSON.parse(clientDetails);
        const client = parsed?.data?.client;
        if (client) {
          setProfileUrl(client.profile_url);
          setFullName(client.full_name || 'Admin User');
          setRole(client.role || 'Hospital Administrator');
        }
      } catch (e) {
        console.error('Error parsing clientDetails for Navbar:', e);
      }
    }
  }, []);

  // ✅ Function to handle navigation
  const goToProfileSettings = () => {
    navigate('/profile-settings');
  };

  const goToAccountPreferences = () => {
    navigate('/account-preferences');
  };

  const handleSignOut = () => {
    // Clear auth tokens and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('clientDetails');
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo / Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Client Admin Panel
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* 🌙 Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? (
              <SunIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <MoonIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* 🔔 Notifications */}
          <Menu as="div" className="relative">
            <Menu.Button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <BellIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 transform translate-x-1/2 -translate-y-1/2"></span>
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Notifications
                </h3>
                {notifications.map((notification) => (
                  <Menu.Item key={notification.id}>
                    <div className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Menu>

          {/* 👤 Profile Dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              {profileUrl ? (
                <img
                  src={profileUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-blue-600"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">AD</span>
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {fullName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {role}
                </p>
              </div>
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div className="py-1">
                {/* Profile Settings */}
                <Menu.Item>
                  <button
                    onClick={goToProfileSettings}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile Settings
                  </button>
                </Menu.Item>

                {/* Account Preferences */}
                <Menu.Item>
                  <button
                    onClick={goToAccountPreferences}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Account Preferences
                  </button>
                </Menu.Item>

                {/* Sign Out */}
                <Menu.Item>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign Out
                  </button>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </nav>
  );
};
