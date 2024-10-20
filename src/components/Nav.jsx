import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import mylogo from "/home/whomimohshukla/Desktop/Book mY bus/Frontend/src/assets/Book My Ticket (1).png";
import CTAButton from "../Utls/Home/Button";

function Nav() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div>
      <header className="shadow-lg sticky z-50 top-0">
        <nav className="border-gray-200 ml-14 px-4 lg:px-8 py-3 rounded-full">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <Link
              to="/"
              className="flex items-center space-x-2  relative rounded-none"
            >
              {/* Logo */}
              {/* <img
                src={mylogo}
                alt="Logo"
                style={{ width: "70px", height: "70px" }} // Adjust width and maintain aspect ratio
              /> */}
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
              <ul className="flex flex-col lg:flex-row lg:space-x-6 mt-4 lg:mt-0 mr-80 font-semibold">
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
                    to="/Blogs"
                    className={({ isActive }) =>
                      `block py-2 px-4 transition duration-200 rounded ${
                        isActive ? "text-Darkgreen" : "text-black"
                      } hover:text-customBlue`
                    }
                  >
                    Blogs
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

              {/* Buttons */}
              <div className="flex justify-center items-center space-x-4 mt-4 lg:mt-0">
                <CTAButton active="true" linkto="/signup">
                  Sign Up
                </CTAButton>
                <CTAButton active="false" linkto="/login">
                  Login
                </CTAButton>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Nav;
