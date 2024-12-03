import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import mylogo from "/home/whomimohshukla/Desktop/Project Mine/BookMyBus/src/assets/bookMyBusLogo.jpg";
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
  const isAdmin = user?.role === 'Admin';

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
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
      <nav className="mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link to="/" className="flex items-center space-x-2 relative">
            <img
              src={mylogo}
              alt="Logo"
              className="w-[120px] h-[80px] object-contain"
            />
          </Link>

          {/* Hamburger Menu for Mobile */}
          <button
            ref={hamburgerRef}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-neutral-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              />
            </svg>
          </button>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/FAQs"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
                }`
              }
            >
              FAQs
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
                }`
              }
            >
              Contact
            </NavLink>
            <NavLink
              to="/blogs"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
                }`
              }
            >
              Blogs
            </NavLink>
            <NavLink
              to="/support"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
                }`
              }
            >
              Support
            </NavLink>
          </div>

          {/* Mobile Menu */}
          <div
            ref={mobileMenuRef}
            className={`lg:hidden fixed inset-x-0 top-[96px] transition-all duration-300 transform ${
              isMobileMenuOpen 
                ? 'translate-x-0 opacity-100' 
                : 'translate-x-full opacity-0'
            } max-h-[calc(100vh-96px)] overflow-y-auto`}
          >
            <div className="bg-white shadow-lg rounded-b-2xl border-t border-neutral-100">
              <div className="px-4 py-3 space-y-1">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
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
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
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
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
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
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
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
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
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
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Support
                </NavLink>
              </div>

              {!user ? (
                <div className="px-4 py-3 border-t border-neutral-100">
                  <div className="grid gap-2 pb-4">
                    <CTAButton active={true} linkto="/signup" className="w-full">
                      Sign Up
                    </CTAButton>
                    <CTAButton active={false} linkto="/login" className="w-full">
                      Login
                    </CTAButton>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Profile Section */}
          <div className="flex justify-center items-center space-x-4">
            {!user ? (
              <div className="flex items-center space-x-3">
                <CTAButton active={true} linkto="/signup">
                  Sign Up
                </CTAButton>
                <CTAButton active={false} linkto="/login">
                  Login
                </CTAButton>
              </div>
            ) : (
              <div className="relative flex items-center space-x-4">
                {/* Profile Button - Simplified */}
                <button
                  ref={avatarRef}
                  className="flex items-center space-x-2 focus:outline-none group"
                  onClick={toggleDropdown}
                  aria-label="Toggle profile menu"
                >
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-Darkgreen to-LightGreen p-[2px] overflow-hidden transition-transform duration-200 hover:scale-105">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white">
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-Darkgreen">
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </button>

                {/* Enhanced Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 top-14 w-72 bg-white rounded-xl shadow-2xl py-3 z-50 transform transition-all duration-200 ease-out border border-neutral-100"
                  >
                    {/* Profile Header */}
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 p-[2px] shadow-lg">
                          <div className="w-full h-full rounded-full overflow-hidden bg-white">
                            {user?.image ? (
                              <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary-50">
                                <svg className="w-7 h-7 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-neutral-800 truncate">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-sm text-neutral-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {/* Admin Dashboard */}
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 group"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-100 text-primary-600 mr-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                          </span>
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 group"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-100 text-primary-600 mr-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </span>
                        Profile Settings
                      </Link>

                      <Link
                        to="/bookings"
                        className="flex items-center px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 group"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-100 text-primary-600 mr-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </span>
                        My Bookings
                      </Link>

                      <div className="border-t border-neutral-100 my-2"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-error-600 hover:bg-error-50 group"
                      >
                        <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-error-100 text-error-600 mr-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
