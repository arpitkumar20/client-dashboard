import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { LineChartCard } from '../components/charts/LineChartCard';
import { PieChartCard } from '../components/charts/PieChartCard';
import { BarChartCard } from '../components/charts/BarChartCard';
import { StatCard } from '../components/ui/StatCard';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { chartData } from '../data/mockData';

const analyticsData = {
  revenue: [
    { month: 'Jan', revenue: 12500 },
    { month: 'Feb', revenue: 15200 },
    { month: 'Mar', revenue: 18100 },
    { month: 'Apr', revenue: 16800 },
    { month: 'May', revenue: 21500 },
    { month: 'Jun', revenue: 19200 },
    { month: 'Jul', revenue: 25400 },
    { month: 'Aug', revenue: 23100 },
    { month: 'Sep', revenue: 28500 },
    { month: 'Oct', revenue: 26200 },
    { month: 'Nov', revenue: 32100 },
    { month: 'Dec', revenue: 35800 }
  ],
  customerGrowth: [
    { month: 'Jan', new: 45, returning: 120 },
    { month: 'Feb', new: 52, returning: 135 },
    { month: 'Mar', new: 61, returning: 142 },
    { month: 'Apr', new: 58, returning: 158 },
    { month: 'May', new: 67, returning: 171 },
    { month: 'Jun', new: 73, returning: 185 }
  ],
  departmentPerformance: [
    { department: 'Sales', performance: 92 },
    { department: 'Marketing', performance: 87 },
    { department: 'Support', performance: 95 },
    { department: 'Operations', performance: 89 },
    { department: 'Finance', performance: 91 }
  ]
};

export const Analytics = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'leads', 'appointments']);

  const sparklineData = [65, 78, 90, 85, 98, 87, 105, 98, 112, 89, 95, 108];

  const kpiData = [
    {
      title: 'Total Revenue',
      value: '$284.5K',
      change: 18.2,
      trend: 'up',
      icon: CurrencyDollarIcon
    },
    {
      title: 'Customer Acquisition',
      value: '1,247',
      change: 12.4,
      trend: 'up',
      icon: UsersIcon
    },
    {
      title: 'Conversion Rate',
      value: '23.7%',
      change: 2.1,
      trend: 'up',
      icon: ArrowTrendingUpIcon
    },
    {
      title: 'Avg. Session Duration',
      value: '4m 32s',
      change: -5.3,
      trend: 'down',
      icon: CalendarDaysIcon
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Insights</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your business performance and key metrics</p>
        </div>
        <div className="flex space-x-3">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button
            variant="secondary"
            className="flex items-center space-x-2"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
            <span>Filters</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <StatCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            trend={kpi.trend}
            icon={kpi.icon}
            sparklineData={sparklineData}
          />
        ))}
      </div>

      {/* Revenue and Customer Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartCard
          title="Revenue Trends"
          data={analyticsData.revenue}
          dataKey="revenue"
          color="#10B981"
        />
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Growth</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">New Customers</p>
                <p className="text-2xl font-bold text-blue-600">+73</p>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                This month
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Returning Customers</p>
                <p className="text-2xl font-bold text-green-600">185</p>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active this month
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Retention Rate</p>
                <p className="text-2xl font-bold text-purple-600">89.2%</p>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                +2.1% vs last month
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance and Conversion Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartCard
          title="Department Performance"
          data={analyticsData.departmentPerformance}
          dataKey="performance"
          color="#8B5CF6"
        />
        <PieChartCard
          title="Traffic Sources"
          data={[
            { name: 'Organic Search', value: 42, color: '#3B82F6' },
            { name: 'Direct', value: 28, color: '#10B981' },
            { name: 'Social Media', value: 18, color: '#F59E0B' },
            { name: 'Email', value: 8, color: '#EF4444' },
            { name: 'Referrals', value: 4, color: '#8B5CF6' }
          ]}
        />
      </div>

      {/* Detailed Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Detailed Metrics</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-white">User Engagement</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Page Views</span>
                  <span className="font-medium text-gray-900 dark:text-white">24,567</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Unique Visitors</span>
                  <span className="font-medium text-gray-900 dark:text-white">8,942</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Bounce Rate</span>
                  <span className="font-medium text-gray-900 dark:text-white">32.1%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Session Duration</span>
                  <span className="font-medium text-gray-900 dark:text-white">4m 32s</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Sales Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Sales</span>
                  <span className="font-medium text-gray-900 dark:text-white">$284,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg Order Value</span>
                  <span className="font-medium text-gray-900 dark:text-white">$1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</span>
                  <span className="font-medium text-gray-900 dark:text-white">23.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Sales Growth</span>
                  <span className="font-medium text-green-600">+18.2%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Customer Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">New Customers</span>
                  <span className="font-medium text-gray-900 dark:text-white">73</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Customer Lifetime Value</span>
                  <span className="font-medium text-gray-900 dark:text-white">$5,842</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Retention Rate</span>
                  <span className="font-medium text-gray-900 dark:text-white">89.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Churn Rate</span>
                  <span className="font-medium text-red-600">2.1%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals and Targets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Goals</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Revenue Target</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">85% achieved</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">New Customers</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">92% achieved</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Appointments</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">78% achieved</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Content</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Service Overview Page</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">2,847 views</p>
              </div>
              <span className="text-sm font-medium text-green-600">+12%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Pricing Information</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">1,954 views</p>
              </div>
              <span className="text-sm font-medium text-green-600">+8%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Contact Form</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">1,432 conversions</p>
              </div>
              <span className="text-sm font-medium text-green-600">+15%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};