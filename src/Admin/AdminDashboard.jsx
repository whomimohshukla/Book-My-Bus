import React from 'react';
import { Link } from 'react-router-dom';
import { FaBus, FaCity, FaRoute, FaUsers, FaTicketAlt, FaClock, FaChartLine, FaCog } from 'react-icons/fa';

const AdminDashboard = () => {
  const stats = [
    { id: 1, name: 'Total Bookings', value: '1,234', change: '+12%', changeType: 'increase' },
    { id: 2, name: 'Active Routes', value: '45', change: '+5%', changeType: 'increase' },
    { id: 3, name: 'Total Cities', value: '28', change: '+3%', changeType: 'increase' },
    { id: 4, name: 'Active Users', value: '892', change: '+25%', changeType: 'increase' },
  ];

  const quickLinks = [
    { name: 'City Management', icon: FaCity, href: '/admin/cities', color: 'bg-blue-500', description: 'Manage cities and locations' },
    { name: 'Bus Management', icon: FaBus, href: '/admin/buses', color: 'bg-yellow-500', description: 'Manage bus fleet' },
    { name: 'Route Management', icon: FaRoute, href: '/admin/routes', color: 'bg-indigo-500', description: 'Configure bus routes' },
    { name: 'Schedule Management', icon: FaClock, href: '/admin/schedules', color: 'bg-red-500', description: 'Set bus schedules' },
    { name: 'Operator Management', icon: FaUsers, href: '/admin/operators', color: 'bg-purple-500', description: 'Manage bus operators' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-800 pt-20 md:pt-24 lg:pt-28 py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Welcome Section */}
        <div style={{ backgroundColor: '#0A4D3C' }} 
          className="rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 transform hover:scale-[1.01] transition-all duration-300 border border-[#0E6D56]/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-poppins mb-2">Welcome to BookMyBus Admin</h1>
              <p className="text-sm sm:text-base text-[#4AE3B5] font-roboto">Manage your bus service operations efficiently</p>
            </div>
            <div className="w-full sm:w-auto">
              <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium bg-[#073D2F] text-[#4AE3B5] shadow-lg border border-[#0E6D56]/30">
                <FaClock className="mr-2" />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: window.innerWidth > 640 ? 'long' : 'short',
                  year: 'numeric',
                  month: window.innerWidth > 640 ? 'long' : 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat) => (
            <div key={stat.id} 
              className="bg-white/10 backdrop-blur-lg rounded-lg sm:rounded-xl shadow-xl p-4 sm:p-6 hover:bg-white/20 transform hover:scale-[1.02] transition-all duration-300">
              <dt className="text-xs sm:text-sm font-medium text-emerald-100 truncate font-roboto">{stat.name}</dt>
              <dd className="mt-1 text-xl sm:text-2xl lg:text-3xl font-semibold text-white font-poppins">{stat.value}</dd>
              <dd className="mt-2">
                <span className={`text-xs sm:text-sm font-medium ${stat.changeType === 'increase' ? 'text-emerald-300' : 'text-red-400'}`}>
                  {stat.change}
                </span>
              </dd>
            </div>
          ))}
        </div>

        {/* Quick Access Grid */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg sm:rounded-xl shadow-xl p-4 sm:p-6 lg:p-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 font-poppins">Quick Access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {quickLinks.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex flex-col items-center p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/20 transition-all duration-300 group transform hover:scale-[1.02]"
              >
                <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg ${item.color} transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-3`}>
                  <item.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <span className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-white font-roboto text-center">{item.name}</span>
                <p className="mt-1 text-[10px] sm:text-xs text-emerald-200 text-center font-roboto hidden sm:block">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg sm:rounded-xl shadow-xl p-4 sm:p-6 lg:p-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 font-poppins">Recent Activity</h2>
          <div className="space-y-3 sm:space-y-4">
            {[
              { action: 'New city Mumbai added', time: '5 minutes ago', type: 'city' },
              { action: 'Route Delhi-Mumbai updated', time: '1 hour ago', type: 'route' },
              { action: 'New bus operator registered', time: '2 hours ago', type: 'operator' },
              { action: 'Schedule updated for Route #123', time: '3 hours ago', type: 'schedule' },
            ].map((activity, index) => (
              <div key={index} 
                className="flex items-center space-x-3 p-2 sm:p-3 hover:bg-white/10 rounded-lg sm:rounded-xl transition-all duration-300 group transform hover:scale-[1.01]">
                <div className={`p-2 rounded-full ${
                  activity.type === 'operator' ? 'bg-purple-200/20 text-purple-300' :
                  activity.type === 'route' ? 'bg-emerald-200/20 text-emerald-300' :
                  activity.type === 'city' ? 'bg-purple-200/20 text-purple-300' :
                  'bg-orange-200/20 text-orange-300'
                }`}>
                  {activity.type === 'operator' ? <FaUsers className="h-4 w-4 sm:h-5 sm:w-5" /> :
                   activity.type === 'route' ? <FaRoute className="h-4 w-4 sm:h-5 sm:w-5" /> :
                   activity.type === 'city' ? <FaCity className="h-4 w-4 sm:h-5 sm:w-5" /> :
                   <FaClock className="h-4 w-4 sm:h-5 sm:w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-white font-roboto group-hover:text-emerald-200 transition-colors duration-300 truncate">
                    {activity.action}
                  </p>
                  <p className="text-xs sm:text-sm text-emerald-200/70 font-roboto">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
