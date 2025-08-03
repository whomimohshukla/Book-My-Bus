import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaDiscord, FaTwitter, FaFacebookF, FaMapMarkerAlt, FaPhone, FaEnvelope, FaBus, FaClock, FaHeadset, FaBlog, FaPaperPlane } from "react-icons/fa";
import mylogo from "../../assets/bookMyBusLogo.jpg";

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-Darkgreen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-LightGreen/10 rounded-2xl p-8 md:p-12 border border-white/10">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-12">
                {/* Content */}
                <div className="text-center md:text-left max-w-md">
                  <span className="inline-block bg-white/10 text-white px-4 py-1 rounded-full text-sm font-medium tracking-wide mb-4">
                    NEWSLETTER
                  </span>
                  <h3 className="text-3xl font-bold text-white mb-3">
                    Stay Updated with BookMyBus
                  </h3>
                  <p className="text-white/80 text-lg">
                    Get exclusive offers, travel tips, and latest updates directly in your inbox
                  </p>
                </div>
                
                {/* Subscribe Form */}
                <div className="w-full md:w-auto">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 max-w-md mx-auto md:max-w-none">
                    <div className="relative flex-grow">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-12 py-4 rounded-xl sm:rounded-r-none bg-white/10 border border-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
                      />
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <FaEnvelope className="text-white/60" />
                      </div>
                    </div>
                    <button className="group bg-white rounded-xl sm:rounded-l-none text-Darkgreen font-semibold hover:bg-gray-50 transition-all duration-300">
                      <div className="px-8 py-4 flex items-center justify-center">
                        <span className="mr-2">Subscribe</span>
                        <FaPaperPlane className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                      </div>
                    </button>
                  </div>
                  <p className="text-white/60 text-sm mt-3 text-center md:text-left">
                    *We promise to never spam you or share your email
                  </p>
                </div>
              </div>
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
                <Link to="/support" className="text-gray-400 hover:text-LightGreen transition duration-300 flex items-center">
                  <FaHeadset className="mr-2" /> Support
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-400 hover:text-LightGreen transition duration-300 flex items-center">
                  <FaBlog className="mr-2" /> Blog
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-LightGreen transition duration-300 flex items-center">
                  <FaBus className="mr-2" /> Book Now
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-LightGreen transition duration-300 flex items-center">
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
                <span>BookMyBus, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-LightGreen" />
                <span>+91 7233091999</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-LightGreen" />
                <span>bookMyBus@gmail.com</span>
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
                  <Link to="/support" className="text-gray-400 hover:text-LightGreen text-sm">
                    Support
                  </Link>
                </li>
                <li>
                  <Link to="/termsAndConditions" className="text-gray-400 hover:text-LightGreen text-sm">
                    License
                  </Link>
                </li>
                <li>
                  <Link to="/blogs" className="text-gray-400 hover:text-LightGreen text-sm">
                    Blog
                  </Link>
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
