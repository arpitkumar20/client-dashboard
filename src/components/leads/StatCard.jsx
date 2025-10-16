import React from 'react';

export const StatCard = ({ 
  title, 
  value, 
  colorFrom = 'blue-500', 
  colorTo = 'blue-600',
  icon 
}) => {
  return (
    <div className={`bg-gradient-to-r from-${colorFrom} to-${colorTo} text-white px-4 py-2 rounded-lg shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
        {icon && (
          <div className="text-white/80">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};