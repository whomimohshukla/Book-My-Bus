import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaQuoteLeft, FaStar, FaUserCircle } from "react-icons/fa";

function TestimonialCard({ name, message, rating, designation }) {
  return (
    <div className="bg-white shadow-lg hover:shadow-xl rounded-xl p-8 mx-4 my-8 transition-all duration-300 transform hover:-translate-y-2 relative">
      {/* Decorative Elements */}
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-Darkgreen to-LightGreen rounded-full flex items-center justify-center shadow-lg">
        <FaQuoteLeft className="text-white text-xl" />
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-r from-Darkgreen/5 to-LightGreen/5 rounded-full -z-10"></div>
      
      {/* Content */}
      <div className="pt-6">
        {/* Avatar and Personal Info */}
        <div className="flex items-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-Darkgreen to-LightGreen flex items-center justify-center">
              <FaUserCircle className="text-4xl text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-Darkgreen to-LightGreen rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
              {rating}
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-bold text-gray-800">{name}</h3>
            <p className="text-sm text-gray-600 mt-1">{designation}</p>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={index < rating ? "text-yellow-400" : "text-gray-300"}
              size={18}
            />
          ))}
        </div>

        {/* Testimonial Message */}
        <div className="relative">
          <p className="text-gray-600 text-base leading-relaxed">
            "{message}"
          </p>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-Darkgreen/10 to-LightGreen/10 rounded-full -z-10"></div>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  const testimonialsData = [
    {
      name: "John Doe",
      designation: "Regular Traveler",
      message:
        "BookMyBus has transformed my travel experience! The booking process is seamless, and the journey comfort is exceptional. I particularly love their punctual service and clean buses.",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      designation: "Business Traveler",
      message:
        "As a frequent business traveler, I rely on BookMyBus for their consistency and professionalism. Their online booking system is intuitive, and the travel experience is always premium.",
      rating: 5
    },
    {
      name: "Michael Chen",
      designation: "Student",
      message:
        "The student discounts are amazing! I love how they make travel affordable without compromising on quality. The onboard WiFi and comfortable seating make every journey enjoyable.",
      rating: 4
    },
    {
      name: "Emily Williams",
      designation: "Family Traveler",
      message:
        "Traveling with my family is now stress-free thanks to BookMyBus. The spacious seating and entertainment options keep everyone comfortable throughout the journey.",
      rating: 5
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ],
    customPaging: (i) => (
      <div className="w-3 h-3 bg-gradient-to-r from-Darkgreen to-LightGreen rounded-full mt-8 transition-all duration-300 hover:scale-110"></div>
    )
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-r from-Darkgreen/5 to-LightGreen/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-Darkgreen/5 to-LightGreen/5 rounded-full translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-Darkgreen/10 to-LightGreen/10 px-4 py-2 rounded-full mb-4">
            <FaStar className="text-Darkgreen" />
            <span className="text-Darkgreen font-medium">Customer Reviews</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our
            <span className="text-Darkgreen"> Passengers Say</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join thousands of satisfied travelers who choose BookMyBus for their journeys
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="max-w-7xl mx-auto">
          <Slider {...settings}>
            {testimonialsData.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                {...testimonial}
              />
            ))}
          </Slider>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <p className="text-gray-600 text-lg mb-8">
            Experience the comfort and reliability that our customers love
          </p>
          <button className="bg-gradient-to-r from-Darkgreen to-LightGreen text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[0.98] transition-all duration-300">
            Book Your Journey Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
