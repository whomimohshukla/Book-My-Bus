import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import mylogo from "/home/whomimohshukla/Desktop/Project Mine/BookMyBus/src/assets/bookMyBusLogo.jpg";
import CTAButton from "../Utls/Home/Button";

function Nav() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); // Simulating user authentication state

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  // Check login state from localStorage when the component mounts
  useEffect(() => {
    const userLoggedIn = localStorage.getItem("loggedIn") === "true";
    setLoggedIn(userLoggedIn);
  }, []);

  const handleLogin = () => {
    localStorage.setItem("loggedIn", "true"); // Save login state in localStorage
    setLoggedIn(true); // Update local state
    setMobileMenuOpen(false); // Close mobile menu after login
  };

  const handleLogout = () => {
    localStorage.setItem("loggedIn", "false"); // Remove login state from localStorage
    setLoggedIn(false); // Update local state
    setMobileMenuOpen(false); // Close mobile menu after logout
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
            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={toggleMobileMenu}
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

          {/* Links */}
          <div
            className={`${
              isMobileMenuOpen ? "block" : "hidden"
            } lg:flex lg:w-auto lg:order-1 w-full lg:items-center`}
            id="mobile-menu"
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
                >
                  Contact
                </NavLink>
              </li>
            </ul>

            {/* Buttons or Profile Avatar */}
            <div className="flex justify-center items-center space-x-4 mt-4 lg:mt-0">
              {!loggedIn ? (
                <>
                  <CTAButton active="true" linkto="/signup">
                    Sign Up
                  </CTAButton>
                  <CTAButton
                    active="false"
                    linkto="/login"
                    onClick={handleLogin}
                  >
                    Login
                  </CTAButton>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="relative w-10 h-10">
                    <img
                      src="https://via.placeholder.com/40"
                      alt="User Avatar"
                      className="rounded-full w-full h-full border border-gray-300"
                    />
                  </div>
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="text-black hover:text-red-600 font-semibold"
                  >
                    Logout
                  </button>
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
