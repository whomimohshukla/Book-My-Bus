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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-800 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div style={{ backgroundColor: '#0A4D3C' }} className="rounded-2xl shadow-xl p-6 sm:p-10 mb-8 transform hover:scale-[1.02] transition-all duration-300 border border-[#0E6D56]/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-white font-poppins mb-2">Welcome to BookMyBus Admin</h1>
              <p className="text-[#4AE3B5] font-roboto">Manage your bus service operations efficiently</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-[#073D2F] text-[#4AE3B5] shadow-lg border border-[#0E6D56]/30">
                <FaClock className="mr-2" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 hover:bg-white/20 transform hover:scale-105 transition-all duration-300">
              <dt className="text-sm font-medium text-emerald-100 truncate font-roboto">{stat.name}</dt>
              <dd className="mt-1 text-3xl font-semibold text-white font-poppins">{stat.value}</dd>
              <dd className="mt-2">
                <span className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-emerald-300' : 'text-red-400'}`}>
                  {stat.change}
                </span>
              </dd>
            </div>
          ))}
        </div>

        {/* Quick Access Grid */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6 font-poppins">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {quickLinks.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/20 transition-all duration-300 group transform hover:scale-105"
              >
                <div className={`p-4 rounded-xl shadow-lg ${item.color} transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-3`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <span className="mt-3 text-sm font-medium text-white font-roboto">{item.name}</span>
                <p className="mt-1 text-xs text-emerald-200 text-center font-roboto">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6 font-poppins">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'New city Mumbai added', time: '5 minutes ago', type: 'city' },
              { action: 'Route Delhi-Mumbai updated', time: '1 hour ago', type: 'route' },
              { action: 'New bus operator registered', time: '2 hours ago', type: 'operator' },
              { action: 'Schedule updated for Route #123', time: '3 hours ago', type: 'schedule' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 hover:bg-white/10 rounded-xl transition-all duration-300 group transform hover:scale-[1.02]">
                <div className={`p-2 rounded-full ${
                  activity.type === 'operator' ? 'bg-purple-200/20 text-purple-300' :
                  activity.type === 'route' ? 'bg-emerald-200/20 text-emerald-300' :
                  activity.type === 'city' ? 'bg-purple-200/20 text-purple-300' :
                  'bg-orange-200/20 text-orange-300'
                }`}>
                  {activity.type === 'operator' ? <FaUsers className="h-5 w-5" /> :
                   activity.type === 'route' ? <FaRoute className="h-5 w-5" /> :
                   activity.type === 'city' ? <FaCity className="h-5 w-5" /> :
                   <FaClock className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white font-roboto group-hover:text-emerald-200 transition-colors duration-300">{activity.action}</p>
                  <p className="text-sm text-emerald-200/70 font-roboto">{activity.time}</p>
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
