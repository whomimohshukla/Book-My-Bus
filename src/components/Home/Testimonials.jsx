import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

function TestimonialCard({ name, message, avatar, rating, designation }) {
  return (
    <div className="bg-white shadow-lg hover:shadow-xl rounded-xl p-8 mx-4 my-6 transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        {/* Quote Icon */}
        <div className="absolute -top-12 left-0 w-10 h-10 bg-gradient-to-r from-Darkgreen to-LightGreen rounded-full flex items-center justify-center">
          <FaQuoteLeft className="text-white text-xl" />
        </div>
        
        {/* Avatar and Personal Info */}
        <div className="flex items-center mb-6">
          <div className="relative">
            <img
              src={avatar}
              alt={`${name}'s avatar`}
              className="w-16 h-16 rounded-full object-cover border-4 border-LightGreen"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-Darkgreen to-LightGreen rounded-full flex items-center justify-center text-white text-xs font-bold">
              {rating}
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            <p className="text-sm text-gray-600">{designation}</p>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={index < rating ? "text-yellow-400" : "text-gray-300"}
            />
          ))}
        </div>

        {/* Testimonial Message */}
        <p className="text-gray-600 text-base leading-relaxed italic">
          "{message}"
        </p>
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
        "I've been using BookMyBus for all my travel needs, and I couldn't be happier! The booking process is seamless, and the journey comfort is exceptional. The staff is always courteous and professional.",
      avatar: "/home/whomimohshukla/Desktop/Project Mine/BookMyBus/src/assets/random2.jpg",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      designation: "Business Traveler",
      message:
        "As a frequent business traveler, reliability is crucial for me. BookMyBus has never disappointed. Their punctuality and comfortable buses make every journey pleasant. The online booking system is very user-friendly.",
      avatar: "/home/whomimohshukla/Desktop/Project Mine/BookMyBus/src/assets/random2.jpg",
      rating: 5
    },
    {
      name: "Michael Chen",
      designation: "Student",
      message:
        "The student discounts and flexible booking options are perfect for my budget. The buses are always clean and well-maintained. The WiFi on board helps me stay productive during my travels.",
      avatar: "/home/whomimohshukla/Desktop/Project Mine/BookMyBus/src/assets/random2.jpg",
      rating: 4
    },
    {
      name: "Emily Williams",
      designation: "Family Traveler",
      message:
        "Traveling with family can be challenging, but BookMyBus makes it easy. The spacious seating and entertainment options keep everyone comfortable and happy throughout the journey.",
      avatar: "/home/whomimohshukla/Desktop/Project Mine/BookMyBus/src/assets/random2.jpg",
      rating: 5
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
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
      <div className="w-3 h-3 bg-LightGreen rounded-full mt-8"></div>
    )
  };

  return (
    <div className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our
            <span className="text-Darkgreen"> Passengers Say</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover why thousands of travelers choose BookMyBus for their journeys
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="max-w-7xl mx-auto">
          <Slider {...settings}>
            {testimonialsData.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                designation={testimonial.designation}
                message={testimonial.message}
                avatar={testimonial.avatar}
                rating={testimonial.rating}
              />
            ))}
          </Slider>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-gray-600 text-lg mb-8">
            Join thousands of satisfied travelers who trust BookMyBus
          </p>
          <button className="bg-gradient-to-r from-Darkgreen to-LightGreen text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transform hover:scale-[0.98] transition-all duration-300 shadow-lg">
            Book Your Journey Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
