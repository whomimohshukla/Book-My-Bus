import React from "react";
import { useParams } from "react-router-dom";
import { FaCalendar, FaUser, FaClock, FaTags, FaShare, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

// This would typically come from an API or database
const blogPosts = {
  1: {
    id: 1,
    title: "Top 10 Tourist Destinations in India by Bus",
    content: `
      India is a land of diverse cultures, landscapes, and experiences. Traveling by bus offers a unique perspective and allows you to truly immerse yourself in the country's beauty. Here are our top 10 destinations that you can easily explore by bus:

      1. Manali, Himachal Pradesh
      Nestled in the mountains, Manali offers breathtaking views and adventure sports. The journey through winding mountain roads is an experience in itself.

      2. Goa
      Known for its beaches and vibrant culture, Goa is well-connected by luxury buses from major cities. The overnight journey is comfortable and economical.

      3. Jaipur, Rajasthan
      The Pink City's rich history and architecture make it a must-visit destination. Modern Volvo buses make the journey comfortable even in Rajasthan's heat.

      4. Rishikesh, Uttarakhand
      The yoga capital of India is easily accessible by bus. The route offers stunning views of the Himalayas and the Ganges.

      5. Ooty, Tamil Nadu
      This hill station is famous for its tea plantations. The bus journey through the Nilgiri mountains is unforgettable.

      Tips for Your Journey:
      - Book tickets in advance during peak season
      - Choose air-conditioned buses for long journeys
      - Keep some snacks and water handy
      - Don't forget to take breaks during long journeys
      - Carry motion sickness medication if needed

      Best Time to Travel:
      - Mountains: March to June
      - Beaches: November to February
      - Heritage Sites: October to March

      Remember to check the weather conditions and book your tickets accordingly. Happy traveling!
    `,
    category: "Travel Guide",
    author: "Priya Singh",
    date: "2024-01-15",
    image: "https://source.unsplash.com/random/1200x600/?india,tourism",
    readTime: "5 min read",
    tags: ["Travel", "Tourism", "India", "Bus Journey"],
    authorImage: "https://source.unsplash.com/random/100x100/?portrait",
    authorBio: "Priya is a travel enthusiast who has explored India extensively by bus. She loves sharing her experiences and tips with fellow travelers.",
  },
  // Add more blog posts as needed
};

function BlogPost() {
  const { id } = useParams();
  const post = blogPosts[id];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl text-gray-600">Blog post not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white2 py-12 px-4 font-poppins">
      <div className="container mx-auto max-w-4xl">
        {/* Header Image */}
        <div className="rounded-xl overflow-hidden shadow-lg mb-8">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Post Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <span className="bg-Darkgreen/10 text-Darkgreen px-4 py-1 rounded-full">
              {post.category}
            </span>
            <span className="flex items-center space-x-2 text-gray-500">
              <FaClock />
              <span>{post.readTime}</span>
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center justify-between text-gray-500">
            <div className="flex items-center space-x-4">
              <img
                src={post.authorImage}
                alt={post.author}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">{post.author}</p>
                <div className="flex items-center space-x-2 text-sm">
                  <FaCalendar />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FaFacebook className="text-blue-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FaTwitter className="text-blue-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FaLinkedin className="text-blue-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center space-x-4 mb-8">
          <FaTags className="text-Darkgreen" />
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-Darkgreen hover:text-white transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Author Bio */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-start space-x-4">
            <img
              src={post.authorImage}
              alt={post.author}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                About {post.author}
              </h3>
              <p className="text-gray-600">{post.authorBio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPost;
