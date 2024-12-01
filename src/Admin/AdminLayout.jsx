import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaBus, FaRoute, FaCalendarAlt, FaCity, FaUserTie, FaBars, FaTimes } from 'react-icons/fa';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: '/admin/buses', icon: <FaBus className="w-5 h-5" />, label: 'Buses' },
    { path: '/admin/operators', icon: <FaUserTie className="w-5 h-5" />, label: 'Operators' },
    { path: '/admin/routes', icon: <FaRoute className="w-5 h-5" />, label: 'Routes' },
    { path: '/admin/schedules', icon: <FaCalendarAlt className="w-5 h-5" />, label: 'Schedules' },
    { path: '/admin/cities', icon: <FaCity className="w-5 h-5" />, label: 'Cities' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[#E7F6E7]">
      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#4CAF50] text-white"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 bg-[#4CAF50] shadow-xl
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-[#66BB6A]">
            <Link to="/admin" className="flex items-center space-x-3">
              <FaBus className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-xl font-bold text-white font-poppins">BookMyBus</h1>
                <p className="text-sm text-[#E8F5E9] font-roboto">Admin Portal</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 overflow-y-auto">
            <div className="px-4 mb-6">
              <p className="text-xs uppercase tracking-wider text-[#E8F5E9] font-roboto">Management</p>
            </div>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-6 py-3 mb-1 mx-2 rounded-lg
                    transition-all duration-200 group
                    ${isActive 
                      ? 'bg-[#388E3C] text-white shadow-lg' 
                      : 'text-white hover:bg-[#388E3C] hover:text-white'
                    }
                  `}
                >
                  <span className={`
                    mr-3 transition-transform duration-200
                    ${isActive ? 'transform scale-110' : 'group-hover:scale-110'}
                  `}>
                    {item.icon}
                  </span>
                  <span className="font-roboto">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-[#66BB6A]">
            <div className="flex items-center space-x-3 px-2">
              <div className="w-10 h-10 rounded-full bg-[#388E3C] flex items-center justify-center">
                <FaUserTie className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white font-roboto">Admin User</p>
                <p className="text-xs text-[#E8F5E9] font-roboto">admin@bookmybus.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-[#E7F6E7] relative">
          {/* Overlay for mobile when sidebar is open */}
          {isSidebarOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={toggleSidebar}
            />
          )}
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
