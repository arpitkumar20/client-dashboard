import React from 'react';
import { StatCard } from './StatCard';

export const LeadStats = ({ leads }) => {
  const stats = [
    {
      title: "Total Leads",
      value: leads.length,
      colorFrom: "blue-500",
      colorTo: "blue-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Qualified",
      value: leads.filter(lead => lead.status === 'qualified').length,
      colorFrom: "green-500",
      colorTo: "green-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "In Progress",
      value: leads.filter(lead => lead.status === 'in-progress').length,
      colorFrom: "yellow-500",
      colorTo: "yellow-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "New",
      value: leads.filter(lead => lead.status === 'new').length,
      colorFrom: "purple-500",
      colorTo: "purple-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          colorFrom={stat.colorFrom}
          colorTo={stat.colorTo}
          icon={stat.icon}
        />
      ))}
    </div>
  );
};