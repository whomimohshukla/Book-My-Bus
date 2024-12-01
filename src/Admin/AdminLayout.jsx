import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaBus, FaRoute, FaCalendarAlt, FaCity, FaUserTie } from 'react-icons/fa';

const AdminLayout = () => {
  const menuItems = [
    { path: '/admin/buses', icon: <FaBus />, label: 'Buses' },
    { path: '/admin/operators', icon: <FaUserTie />, label: 'Operators' },
    { path: '/admin/routes', icon: <FaRoute />, label: 'Routes' },
    { path: '/admin/schedules', icon: <FaCalendarAlt />, label: 'Schedules' },
    { path: '/admin/cities', icon: <FaCity />, label: 'Cities' },
  ];
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 bg-blue-600">
          <h1 className="text-white text-xl font-bold">BookMyBus Admin</h1>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
