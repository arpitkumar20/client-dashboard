import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

export const StatCard = ({ title, value, change, trend, icon: Icon, sparklineData = [] }) => {
  const isPositive = trend === 'up';
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <div className="flex items-center mt-2">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            <div className={`flex items-center ml-3 px-2 py-1 rounded-full text-xs font-medium ${
              isPositive 
                ? 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300' 
                : 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300'
            }`}>
              {isPositive ? (
                <ArrowUpIcon className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDownIcon className="w-3 h-3 mr-1" />
              )}
              {Math.abs(change)}%
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
      
      {sparklineData.length > 0 && (
        <div className="mt-4">
          <div className="flex items-end space-x-1 h-6">
            {sparklineData.map((point, index) => (
              <div
                key={index}
                className={`flex-1 rounded-t ${isPositive ? 'bg-green-200' : 'bg-red-200'}`}
                style={{ height: `${(point / Math.max(...sparklineData)) * 100}%` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};