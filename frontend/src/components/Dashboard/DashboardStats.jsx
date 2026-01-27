import React from 'react';

const DashboardStats = ({ title, value, change, icon }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-surface-dark rounded-lg shadow-lg">
      <span className="material-symbols-outlined text-4xl">{icon}</span>
      <h2 className="text-lg font-bold mt-2">{title}</h2>
      <p className="text-xl font-semibold mt-1">{value}</p>
      <p className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? `+${change}%` : `${change}%`}
      </p>
    </div>
  );
};

export default DashboardStats;