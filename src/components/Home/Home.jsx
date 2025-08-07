import React, { useState } from "react";
import {
  FaBus,
  FaTicketAlt,
  FaLock,
  FaChevronDown,
  FaChevronUp,
  FaMapMarkedAlt,
  FaArrowRight,
  FaShieldAlt,
  FaClock,
  FaHeadset,
  FaPercent,
} from "react-icons/fa";
import Highlight from "../../Utls/Highlight";
import CTAButton from "../../Utls/Home/Button";
import BusSearch2 from "../../Utls/Home/BusSearch2";
import Amenties from "./Amenties";
import Testimonials from "./Testimonials";
import SearchResults from "../../SearchPage/SearchResults";

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="text-left w-full flex justify-between items-center text-lg font-medium text-gray-800 hover:text-Darkgreen transition-colors duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        {isOpen ? (
          <FaChevronUp className="text-Darkgreen" />
        ) : (
          <FaChevronDown className="text-Darkgreen" />
        )}
      </button>
      {isOpen && (
        <p className="mt-2 text-gray-600 text-sm md:text-base leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  );
}

function PopularRouteCard({ from, to, price, duration, frequency }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{from}</h3>
          <div className="flex items-center text-gray-500 mt-1">
            <FaArrowRight className="mx-2" />
            <span>{to}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-Darkgreen">₹{price}</p>
          <p className="text-sm text-gray-500">starting from</p>
        </div>
      </div>
      <div className="flex justify-between text-sm text-gray-600 mt-4">
        <span>{duration}</span>
        <span>{frequency} daily buses</span>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="w-12 h-12 bg-gradient-to-r from-Darkgreen to-LightGreen rounded-full flex items-center justify-center mb-4">
        <div className="text-xl text-white">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="text-center p-6 bg-white rounded-xl shadow-lg">
      <div className="text-4xl font-bold text-Darkgreen mb-2">{number}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

function Home() {
  const [searchResults, setSearchResults] = useState(null);

  const handleSearchResults = (results) => {
    setSearchResults(results);
    // Scroll to results section
    if (results && results.length > 0) {
      setTimeout(() => {
        document.getElementById('search-results').scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const faqData = [
    {
      question: "How do I book a ticket?",
      answer:
        "Booking a ticket is simple! Just use our intuitive bus search feature at the top of the page, select your preferred route and timing, choose your seat, and complete the secure payment process. You'll receive instant confirmation of your booking.",
    },
    {
      question: "What are the payment options available?",
      answer:
        "We offer multiple secure payment options including credit/debit cards, UPI, net banking, and popular digital wallets. All transactions are protected with industry-standard encryption.",
    },
    {
      question: "Can I cancel my ticket?",
      answer:
        "Yes, you can cancel your ticket through the 'My Bookings' section. Our cancellation policy allows for full refunds if cancelled 24 hours before departure, and partial refunds up to 6 hours before departure. Terms and conditions apply.",
    },
    {
      question: "Is online payment secure?",
      answer:
        "Absolutely! We use industry-leading security measures and encrypted payment gateways to ensure your payment information is always protected. Our platform is regularly audited for security compliance.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "Our customer support team is available 24/7. You can reach us through live chat, email at support@bookmybus.com, or call our toll-free number 1800-XXX-XXXX. We typically respond within minutes!",
    },
  ];

  const popularRoutes = [
    {
      from: "Mumbai",
      to: "Pune",
      price: "500",
      duration: "3 hrs",
      frequency: 50,
    },
    {
      from: "Delhi",
      to: "Agra",
      price: "800",
      duration: "4 hrs",
      frequency: 35,
    },
    {
      from: "Bangalore",
      to: "Chennai",
      price: "1200",
      duration: "6 hrs",
      frequency: 45,
    },
    {
      from: "Hyderabad",
      to: "Bangalore",
      price: "1500",
      duration: "8 hrs",
      frequency: 30,
    },
  ];

  return (
    <div className="font-poppins text-gray-800">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white2 flex flex-col justify-center mt-24 md:mt-16">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex flex-col gap-6 text-center md:text-left max-w-xl">
              <Highlight
                text="Welcome to Book My Bus!"
                className="text-Darkgreen"
              />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                Your Journey, <br />
                <span className="text-Darkgreen">Our Priority</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600">
                Experience comfortable and reliable bus travel across the
                country
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-8">
                <CTAButton
                  active={true}
                  linkto="/searchBuses"
                  className="px-8 py-4"
                >
                  Book Now
                </CTAButton>
                <CTAButton active={false} linkto="/about" className="px-8 py-4">
                  Learn More
                </CTAButton>
              </div>
            </div>
            <div className="w-full md:w-1/2 mt-8 md:mt-0">
              <BusSearch2 onSearchResults={handleSearchResults} />
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Section */}
      {searchResults && (
        <div id="search-results" className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <SearchResults results={searchResults} />
          </div>
        </div>
      )}

      {/* Booking Steps Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Book Your Journey in
              <span className="text-Darkgreen"> 3 Simple Steps</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience hassle-free booking with our streamlined process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <FaMapMarkedAlt />,
                title: "Search Route",
                description:
                  "Enter your source and destination to find available buses",
              },
              {
                icon: <FaTicketAlt />,
                title: "Select Seat",
                description: "Choose your preferred seat and view amenities",
              },
              {
                icon: <FaLock />,
                title: "Secure Payment",
                description: "Pay securely and receive instant confirmation",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-Darkgreen to-LightGreen rounded-full flex items-center justify-center mb-6 mx-auto">
                  <div className="text-2xl text-white">{step.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Routes Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular
              <span className="text-Darkgreen"> Routes</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our most frequently traveled routes with the best deals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {popularRoutes.map((route, index) => (
              <PopularRouteCard key={index} {...route} />
            ))}
          </div>

          <div className="text-center mt-12">
            <CTAButton active={true} linkto="/routes" className="px-8 py-4">
              View All Routes
            </CTAButton>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose
              <span className="text-Darkgreen"> BookMyBus</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience the best in bus travel with our premium services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <FeatureCard
              icon={<FaShieldAlt />}
              title="Secure Booking"
              description="End-to-end encrypted transactions and secure payment gateway"
            />
            <FeatureCard
              icon={<FaClock />}
              title="24/7 Service"
              description="Round-the-clock support for all your travel needs"
            />
            <FeatureCard
              icon={<FaHeadset />}
              title="Expert Support"
              description="Dedicated customer service team to assist you"
            />
            <FeatureCard
              icon={<FaPercent />}
              title="Best Deals"
              description="Regular offers and discounts on popular routes"
            />
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-gradient-to-r from-Darkgreen to-LightGreen py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <StatCard number="10M+" label="Happy Customers" />
            <StatCard number="1000+" label="Bus Partners" />
            <StatCard number="2000+" label="Routes" />
            <StatCard number="24/7" label="Customer Support" />
          </div>
        </div>
      </div>

      {/* Amenities Section */}
      <Amenties />

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked
              <span className="text-Darkgreen"> Questions</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Find quick answers to common questions about our services
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-6">
              {faqData.map((item, index) => (
                <FAQItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop')",
          }}
        ></div>

        {/* Content */}
        <div className="relative py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block bg-white/20 text-white px-6 py-2 rounded-full text-sm font-medium tracking-wide mb-6">
                PREMIUM COMFORT • RELIABLE SERVICE
              </span>
              
              <h2 className="text-5xl font-bold text-white mb-8 leading-tight">
                Your Journey Begins <br />
                With <span className="text-LightGreen">BookMyBus</span>
              </h2>
              
              <p className="text-xl text-white/90 mb-12 leading-relaxed">
                Experience luxury travel with state-of-the-art buses, professional drivers, and 24/7 customer support.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <CTAButton
                  active={true}
                  linkto="/searchBuses"
                  className="bg-LightGreen text-white hover:bg-Darkgreen px-12 py-5 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Book Now
                </CTAButton>
                <CTAButton
                  active={true}
                  linkto="/about"
                  className="bg-white text-Darkgreen hover:bg-gray-100 px-12 py-5 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Learn More
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
