import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  InformationCircleIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Leads', path: '/leads', icon: UserGroupIcon },
  { name: 'Appointments', path: '/appointments', icon: CalendarDaysIcon },
  { name: 'Information Feed', path: '/info-feed', icon: InformationCircleIcon },
  { name: 'User Access', path: '/users', icon: UsersIcon },
  { name: 'Reports', path: '/reports', icon: DocumentTextIcon },
  { name: 'Integrations', path: '/integrations', icon: PuzzlePieceIcon },
  { name: 'Support', path: '/support', icon: ChatBubbleLeftRightIcon },
  { name: 'Analytics', path: '/analytics', icon: ChartBarIcon }
];

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">NISAA</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            )}
          </svg>
        </button>
      </div>
      
      <nav className="mt-4 px-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-3 mb-1 text-sm font-medium rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="ml-3 transition-all duration-200">{item.name}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};