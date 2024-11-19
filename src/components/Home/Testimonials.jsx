import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function TestimonialCard({ name, message, avatar }) {
  return (
    <div className="bg-white shadow-2xl rounded-lg p-8 text-center mx-auto w-full max-w-md my-4 min-h-[350px]">
      {" "}
      {/* Card width and height adjusted */}
      <img
        src={avatar}
        alt={`${name}'s avatar`}
        className="w-20 h-20 rounded-full mx-auto mb-6"
      />
      <p className="text-gray-600 text-base italic mb-4">"{message}"</p>
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
    </div>
  );
}

function Testimonials() {
  const testimonialsData = [
    {
      name: "John Doe",
      message:
        "Booking was a breeze, and the journey was comfortable from start to finish. Truly a service I can trust!",
      avatar:
        "/home/whomimohshukla/Desktop/Project Mine/BookMyBus/src/assets/random2.jpg",
    },
    {
      name: "Jane Smith",
      message:
        "Reliable and easy to use. I recommend this service to all my friends and family!",
      avatar: "path/to/avatar2.jpg",
    },
    {
      name: "Michael Brown",
      message:
        "Excellent customer service and timely buses. Made my travel stress-free and enjoyable!",
      avatar: "path/to/avatar3.jpg",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // For mobile screens, only 1 testimonial card should show
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // Disable the previous and next arrows
    responsive: [
      {
        breakpoint: 640, // Small screens like phones
        settings: {
          slidesToShow: 1, // Show only 1 testimonial card on mobile
        },
      },
      {
        breakpoint: 768, // Medium screens like tablets
        settings: {
          slidesToShow: 1, // Show only 1 testimonial card on tablets as well
        },
      },
      {
        breakpoint: 1024, // Larger screens like laptops
        settings: {
          slidesToShow: 3, // Show 3 testimonials on larger screens
        },
      },
    ],
  };

  return (
    <div className="font-poppins mt-20">
      {/* Heading and Subheading Outside Card Section */}
      <div className="text-center">
        <h2 className="text-2xl mb-14 md:text-4xl font-bold text-gray-800">
          Trusted by Travelers Like You
        </h2>
        <p className="mt-4 text-base md:text-lg text-grayText px-4 md:px-0">
          Discover why travelers rely on us for their journeys. Here’s what our
          happy passengers have to say!
        </p>
      </div>

      {/* Testimonial Slider Section with a different background */}
      <div className="bg-blue-100 p-8 md:p-16 rounded-lg bg-white2 shadow-lg mt-8">
        {" "}
        {/* Responsive padding */}
        <Slider {...settings}>
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              message={testimonial.message}
              avatar={testimonial.avatar}
            />
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Testimonials;
