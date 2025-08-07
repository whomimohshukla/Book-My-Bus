import React, { useState } from "react";
import { FaCalendar, FaUser, FaSearch, FaTags } from "react-icons/fa";

const blogPosts = [
  {
    id: 1,
    title: "Top 10 Tourist Destinations in India by Bus",
    excerpt: "Discover the most beautiful places in India that you can easily reach by bus...",
    category: "Travel Guide",
    author: "Priya Singh",
    date: "2024-01-15",
    image: "https://source.unsplash.com/random/800x600/?india,tourism",
    readTime: "5 min read",
    tags: ["Travel", "Tourism", "India", "Bus Journey"],
  },
  {
    id: 2,
    title: "How to Plan a Budget-Friendly Bus Trip",
    excerpt: "Learn the best tips and tricks for planning an economical bus journey...",
    category: "Travel Tips",
    author: "Rahul Kumar",
    date: "2024-01-12",
    image: "https://source.unsplash.com/random/800x600/?bus,travel",
    readTime: "4 min read",
    tags: ["Budget Travel", "Planning", "Tips"],
  },
  {
    id: 3,
    title: "Safety Measures During Bus Travel",
    excerpt: "Essential safety guidelines and precautions for a secure bus journey...",
    category: "Safety",
    author: "Anjali Sharma",
    date: "2024-01-10",
    image: "https://source.unsplash.com/random/800x600/?safety,bus",
    readTime: "6 min read",
    tags: ["Safety", "Guidelines", "Travel Tips"],
  },
  {
    id: 4,
    title: "Most Scenic Bus Routes in India",
    excerpt: "Explore the most beautiful bus routes that offer breathtaking views...",
    category: "Routes",
    author: "Arun Patel",
    date: "2024-01-08",
    image: "https://source.unsplash.com/random/800x600/?landscape,mountains",
    readTime: "7 min read",
    tags: ["Scenic Routes", "Nature", "Photography"],
  },
];

function BlogCard({ post }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
      />
      <div className="p-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
          <span className="bg-Darkgreen/10 text-Darkgreen px-3 py-1 rounded-full">
            {post.category}
          </span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-Darkgreen transition-colors">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <FaUser className="text-Darkgreen" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaCalendar className="text-Darkgreen" />
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full hover:bg-Darkgreen hover:text-white transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Blogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(blogPosts.map((post) => post.category))];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white2 pt-40 md:pt-28 px-4 pb-12 font-poppins">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Travel <span className="text-Darkgreen">Blogs</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover travel tips, destinations, and stories from fellow travelers
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-Darkgreen/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <FaTags className="text-Darkgreen" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-Darkgreen/20"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* No Results Message */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-600">No blogs found matching your criteria</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Blogs;
