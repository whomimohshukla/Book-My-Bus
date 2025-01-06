import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import mylogo from "../assets/bookMyBusLogo.jpg";
import CTAButton from "../Utls/Home/Button";
import { useAuth } from "../contexts/AuthProvider";

function Nav() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Add isAdmin check
  const isAdmin = user?.role === 'admin';

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
      // Only close mobile menu on scroll, not dropdown
      if (isMobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  // Close dropdown and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !avatarRef.current?.contains(event.target)
      ) {
        setDropdownOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !hamburgerRef.current?.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    return () => setMobileMenuOpen(false);
  }, [navigate]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
    if (isDropdownOpen) setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-lg' 
          : 'bg-grayWhite'
      }`}
    >
      <nav className="mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link to="/" className="flex items-center space-x-2 relative">
            <img
              src={mylogo}
              alt="Logo"
              className="w-[80px] h-[50px] sm:w-[120px] sm:h-[80px] object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? 'text-Darkgreen' : 'text-gray-700 hover:text-Darkgreen'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? 'text-Darkgreen' : 'text-gray-700 hover:text-Darkgreen'
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/FAQs"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? 'text-Darkgreen' : 'text-gray-700 hover:text-Darkgreen'
                }`
              }
            >
              FAQs
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? 'text-Darkgreen' : 'text-gray-700 hover:text-Darkgreen'
                }`
              }
            >
              Contact
            </NavLink>
            <NavLink
              to="/blogs"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? 'text-Darkgreen' : 'text-gray-700 hover:text-Darkgreen'
                }`
              }
            >
              Blogs
            </NavLink>
            <NavLink
              to="/support"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? 'text-Darkgreen' : 'text-gray-700 hover:text-Darkgreen'
                }`
              }
            >
              Support
            </NavLink>
          </div>

          {/* Mobile Menu Button - Hamburger */}
          <button
            ref={hamburgerRef}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {user ? (
              <div className="w-8 h-8 rounded-full bg-Darkgreen text-white flex items-center justify-center text-sm font-medium">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            ) : (
              <div className={`w-6 h-5 flex flex-col justify-between transition-all duration-300 ${isMobileMenuOpen ? 'transform' : ''}`}>
                <span className={`w-full h-0.5 bg-gray-600 rounded-full transform transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}></span>
                <span className={`w-full h-0.5 bg-gray-600 rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}></span>
                <span className={`w-full h-0.5 bg-gray-600 rounded-full transform transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}></span>
              </div>
            )}
          </button>

          {/* Mobile Menu */}
          <div
            ref={mobileMenuRef}
            className={`lg:hidden fixed inset-x-0 top-[68px] sm:top-[96px] transition-all duration-300 transform ${
              isMobileMenuOpen 
                ? 'translate-x-0 opacity-100' 
                : 'translate-x-full opacity-0'
            } max-h-[calc(100vh-68px)] sm:max-h-[calc(100vh-96px)] overflow-y-auto`}
          >
            <div className="bg-white shadow-lg rounded-b-2xl border-t border-neutral-100">
              {user ? (
                <>
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-Darkgreen text-white flex items-center justify-center text-lg font-medium">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <Link
                      to="/profile"
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-Darkgreen rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-Darkgreen rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/bookings"
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-Darkgreen rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link
                      to="/emergency"
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-Darkgreen rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      QuickHelp
                    </Link>
                  </div>
                </>
              ) : (
                <div className="px-4 py-3 border-b border-neutral-100">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-Darkgreen bg-white border border-Darkgreen rounded-md hover:bg-gray-50 transition-all duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-Darkgreen to-LightGreen rounded-md shadow-sm hover:shadow transition-all duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}

              <div className="px-4 py-3 space-y-1">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'text-Darkgreen bg-gray-100' 
                        : 'text-gray-700 hover:text-Darkgreen hover:bg-gray-100'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `block w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'text-Darkgreen bg-gray-100' 
                        : 'text-gray-700 hover:text-Darkgreen hover:bg-gray-100'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </NavLink>
                <NavLink
                  to="/FAQs"
                  className={({ isActive }) =>
                    `block w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'text-Darkgreen bg-gray-100' 
                        : 'text-gray-700 hover:text-Darkgreen hover:bg-gray-100'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQs
                </NavLink>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `block w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'text-Darkgreen bg-gray-100' 
                        : 'text-gray-700 hover:text-Darkgreen hover:bg-gray-100'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </NavLink>
                <NavLink
                  to="/blogs"
                  className={({ isActive }) =>
                    `block w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'text-Darkgreen bg-gray-100' 
                        : 'text-gray-700 hover:text-Darkgreen hover:bg-gray-100'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blogs
                </NavLink>
                <NavLink
                  to="/support"
                  className={({ isActive }) =>
                    `block w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'text-Darkgreen bg-gray-100' 
                        : 'text-gray-700 hover:text-Darkgreen hover:bg-gray-100'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Support
                </NavLink>
              </div>
              {user && (
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          {!user ? (
            <div className="hidden lg:flex items-center space-x-3">
              <CTAButton active={false} linkto="/login">
                Login
              </CTAButton>
              <CTAButton active={true} linkto="/signup">
                Sign Up
              </CTAButton>
            </div>
          ) : (
            <div className="hidden lg:flex items-center space-x-3 relative">
              <div 
                ref={avatarRef}
                className="w-10 h-10 rounded-full bg-Darkgreen text-white flex items-center justify-center text-lg font-medium cursor-pointer hover:bg-Darkgreen/90 transition-colors"
                onClick={toggleDropdown}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>

              {/* Desktop Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-Darkgreen transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-Darkgreen transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/bookings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-Darkgreen transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link
                      to="/emergency"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-Darkgreen transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      QuickHelp
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Nav;
