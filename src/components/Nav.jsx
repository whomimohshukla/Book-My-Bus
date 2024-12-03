import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import mylogo from "/home/whomimohshukla/Desktop/Project Mine/BookMyBus/src/assets/bookMyBusLogo.jpg";
import CTAButton from "../Utls/Home/Button";
import { useAuth } from "../contexts/AuthProvider";

function Nav() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Add isAdmin check
  const isAdmin = user?.role === 'Admin';

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

    // Close mobile menu on scroll   
    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on navigation
  useEffect(() => {
    return () => {
      setMobileMenuOpen(false);
    };
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
    <header className="shadow-lg sticky z-50 top-0 bg-grayWhite">
      <nav className="border-gray-200 ml-14 px-4 lg:px-8 py-3 rounded-full">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link
            to="/"
            className="flex items-center space-x-2 relative rounded-none"
          >
            <img
              src={mylogo}
              alt="Logo"
              style={{ width: "120px", height: "80px" }}
            />
          </Link>

          {/* Hamburger Menu for Mobile */}
          <button
            ref={hamburgerRef}
            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          {/* Navigation Links */}
          <div
            ref={mobileMenuRef}
            className={`${
              isMobileMenuOpen ? "block" : "hidden"
            } lg:flex lg:w-auto lg:order-1 w-full lg:items-center`}
          >
            <ul className="flex flex-col lg:flex-row lg:space-x-6 mt-4 lg:mt-0 mr-40 font-semibold">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block py-2 px-4 transition duration-200 rounded ${
                      isActive ? "text-Darkgreen" : "text-black"
                    } hover:text-customBlue`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `block py-2 px-4 transition duration-200 rounded ${
                      isActive ? "text-Darkgreen" : "text-black"
                    } hover:text-customBlue`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/FAQs"
                  className={({ isActive }) =>
                    `block py-2 px-4 transition duration-200 rounded ${
                      isActive ? "text-Darkgreen" : "text-black"
                    } hover:text-customBlue`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `block py-2 px-4 transition duration-200 rounded ${
                      isActive ? "text-Darkgreen" : "text-black"
                    } hover:text-customBlue`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/blogs"
                  className={({ isActive }) =>
                    `block py-2 px-4 transition duration-200 rounded ${
                      isActive ? "text-Darkgreen" : "text-black"
                    } hover:text-customBlue`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blogs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/support"
                  className={({ isActive }) =>
                    `block py-2 px-4 transition duration-200 rounded ${
                      isActive ? "text-Darkgreen" : "text-black"
                    } hover:text-customBlue`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Support
                </NavLink>
              </li>
            </ul>

            {/* Profile Section */}
            <div className="flex justify-center items-center space-x-4 mt-4 lg:mt-0">
              {!user ? (
                <>
                  <CTAButton active={true} linkto="/signup">
                    Sign Up
                  </CTAButton>
                  <CTAButton active={false} linkto="/login">
                    Login
                  </CTAButton>
                </>
              ) : (
                <div className="relative flex items-center space-x-4">
                  {/* Profile Button */}
                  <button
                    ref={avatarRef}
                    className="flex items-center space-x-3 focus:outline-none group"
                    onClick={toggleDropdown}
                    aria-label="Toggle profile menu"
                  >
                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-Darkgreen to-LightGreen p-[2px] overflow-hidden transition-transform duration-200 hover:scale-105">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white">
                        {user?.image ? (
                          <img
                            src={user.image}
                            alt={`${user?.name}'s Avatar`}
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
                    <div className="hidden lg:block">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-Darkgreen">
                        {user?.name || 'My Account'}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">
                        {user?.email || ''}
                      </p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Enhanced Dropdown Menu */}
                  {isDropdownOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 top-14 w-72 bg-white rounded-xl shadow-lg py-2 z-50 transform opacity-100 scale-100 transition-all duration-200 border border-gray-100"
                    >
                      {/* User Info Section */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-Darkgreen to-LightGreen p-[2px]">
                            <div className="w-full h-full rounded-full overflow-hidden bg-white">
                              {user?.image ? (
                                <img
                                  src={user.image}
                                  alt={`${user?.name}'s Avatar`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-Darkgreen">
                                  <svg
                                    className="w-7 h-7"
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
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {user?.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="px-2 py-2">
                        {/* Show Admin Dashboard only for admin users */}
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-Darkgreen transition-colors duration-150 group"
                            onClick={() => {
                              setDropdownOpen(false);
                              setMobileMenuOpen(false);
                            }}
                          >
                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-Darkgreen/10 group-hover:text-Darkgreen transition-colors duration-150">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">Admin Dashboard</p>
                              <p className="text-xs text-gray-500">Manage system settings</p>
                            </div>
                          </Link>
                        )}

                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-Darkgreen transition-colors duration-150 group"
                          onClick={() => {
                            setDropdownOpen(false);
                            setMobileMenuOpen(false);
                          }}
                        >
                          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-Darkgreen/10 group-hover:text-Darkgreen transition-colors duration-150">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Profile Settings</p>
                            <p className="text-xs text-gray-500">Manage your account details</p>
                          </div>
                        </Link>

                        <Link
                          to="/bookings"
                          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-Darkgreen transition-colors duration-150 group"
                          onClick={() => {
                            setDropdownOpen(false);
                            setMobileMenuOpen(false);
                          }}
                        >
                          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-Darkgreen/10 group-hover:text-Darkgreen transition-colors duration-150">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">My Bookings</p>
                            <p className="text-xs text-gray-500">View your travel history</p>
                          </div>
                        </Link>
                      </div>

                      {/* Logout Section */}
                      <div className="border-t border-gray-100 px-2 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm w-full text-left text-red-600 hover:bg-red-50 transition-colors duration-150 group"
                        >
                          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Sign Out</p>
                            <p className="text-xs text-red-400">Securely logout from your account</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
