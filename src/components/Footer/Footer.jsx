import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaDiscord, FaTwitter, FaFacebookF, FaMapMarkerAlt, FaPhone, FaEnvelope, FaBus, FaClock, FaHeadset } from "react-icons/fa";
import mylogo from "/home/whomimohshukla/Desktop/Project Mine/BookMyBus/src/assets/bookMyBusLogo.jpg";

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-Darkgreen to-LightGreen py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-gray-100">Stay updated with our latest offers and news</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 w-full md:w-64 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-LightGreen"
              />
              <button className="bg-white text-Darkgreen px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-100 transition duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <img src={mylogo} alt="BookMyBus Logo" className="w-12 h-12 rounded-full" />
              <span className="text-2xl font-bold text-white">BookMyBus</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your trusted partner for comfortable and reliable bus travel. Experience seamless booking and journey with us.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/Mimohshukla00" target="_blank" rel="noreferrer" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-Darkgreen transition duration-300">
                <FaGithub className="text-gray-300 hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-Darkgreen transition duration-300">
                <FaDiscord className="text-gray-300 hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-Darkgreen transition duration-300">
                <FaTwitter className="text-gray-300 hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-Darkgreen transition duration-300">
                <FaFacebookF className="text-gray-300 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-LightGreen transition duration-300 flex items-center">
                  <FaBus className="mr-2" /> About Us
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-gray-400 hover:text-LightGreen transition duration-300 flex items-center">
                  <FaHeadset className="mr-2" /> FAQs
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-LightGreen transition duration-300 flex items-center">
                  <FaClock className="mr-2" /> Latest News
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-LightGreen transition duration-300 flex items-center">
                  <FaEnvelope className="mr-2" /> Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Our Policies</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/privacyPolicy" className="text-gray-400 hover:text-LightGreen transition duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/termsAndConditions" className="text-gray-400 hover:text-LightGreen transition duration-300">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/TicketPolicies" className="text-gray-400 hover:text-LightGreen transition duration-300">
                  Ticket Policies
                </Link>
              </li>
              <li>
                <Link to="/refunds" className="text-gray-400 hover:text-LightGreen transition duration-300">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-LightGreen" />
                <span>Bengla Road Suite, Dhaka 1209</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-LightGreen" />
                <span>+44 45678908</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-LightGreen" />
                <span>example@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} BookMyBus. All Rights Reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <a href="#" className="text-gray-400 hover:text-LightGreen text-sm">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-LightGreen text-sm">
                    License
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-LightGreen text-sm">
                    API
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
