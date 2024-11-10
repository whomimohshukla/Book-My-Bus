import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaDiscord, FaTwitter, FaFacebookF } from "react-icons/fa";
import mylogo from "/home/whomimohshukla/Desktop/Project Mine/BookMyBus/src/assets/bookMyBusLogo.jpg"

function Footer() {
  return (
    <footer className="bg-blue text-white2 p-8">
      <div className="container mx-auto max-w-screen-xl">
        {/* Main Footer Content in Flex Layout */}
        <div className="flex flex-wrap justify-between items-start py-16 space-y-6 md:space-y-0">
          {/* Company Description Section */}
          <div className="w-full md:w-1/3 space-y-4">
            <img
             src={mylogo}
              alt="Company Logo"
              className="w-24 h-auto mb-4"
            />
            <p className="text-sm">
              Delectus culpa laboriosam debitis saepe. Commodi earum minus ut
              obcaecati veniam deserunt est!
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://github.com/Mimohshukla00"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-yellow-300"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-yellow-300"
              >
                <FaDiscord size={20} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-yellow-300"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-yellow-300"
              >
                <FaFacebookF size={20} />
              </a>
            </div>
          </div>

          {/* Useful Links Section */}
          <div className="w-full md:w-1/4 space-y-2">
            <h2 className="mb-4 text-xl font-semibold text-Darkgreen">
              Useful Links
            </h2>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-Darkgreen">
                  About
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-Darkgreen">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-Darkgreen">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-Darkgreen">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies Section */}
          <div className="w-full md:w-1/4 space-y-2">
            <h2 className="mb-4 text-xl font-semibold text-Darkgreen">Policies</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="hover:text-Darkgreen">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-Darkgreen">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/ticket-policies" className="hover:text-Darkgreen">
                  Ticket Policies
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-Darkgreen">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="w-full md:w-1/4 space-y-2">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Contact Info
            </h2>
            <p className="text-sm">Bengla Road Suite, Dhaka 1209</p>
            <p className="text-sm">+44 45678908</p>
            <p className="text-sm">example@gmail.com</p>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <hr className="my-6 border-gray-700" />
        <div className="flex flex-col md:flex-row justify-between items-center">
          <span className="text-sm text-gray-500">
            © 2024 BookMyBus. All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
