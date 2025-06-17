import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import HeroSlider from "../components/HeroSlider";
import Footer from "../components/Footer";
import api from "../../Axios/api";
import { toast, ToastContainer } from "react-toastify";
import ProductCard from "../components/ProductCard";
import {
  FaArrowRight, FaShoppingCart, FaTruck, FaLeaf, FaShieldAlt,
  FaClock, FaStar, FaGift, FaPercent
} from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch {
      toast.error("Failed to load products");
    }
  };

  const getProductsBySubcategory = (subcategoryName) =>
    products.filter(
      (product) =>
        product.subcategory?.toLowerCase() === subcategoryName?.toLowerCase()
    );

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  const handleSubcategoryClick = (categoryName, subcategoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}/${encodeURIComponent(subcategoryName)}`);
  };



  return (
    <div className="relative">
      {/* Sticky Top Nav */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <NavBar />

        {/* Category Mega Menu */}
        <div
          className="relative bg-white border-t border-green-400"
          onMouseLeave={() => {
            setHoveredIndex(null);
            setShowMegaMenu(false);
          }}
        >
          <div className="flex justify-start px-4 space-x-6 py-3 overflow-x-auto text-sm font-semibold text-gray-800">
            {categories.map((cat, index) => (
              <div
                key={cat._id}
                className="relative group"
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  setShowMegaMenu(true);
                }}
              >
                <button
                  onClick={() => handleCategoryClick(cat.name)}
                  className="hover:text-green-600 whitespace-nowrap px-2 py-1 transition-colors"
                >
                  {cat.name}
                  {cat.subcategories?.length > 0 && (
                    <span className="ml-1 text-xs">▾</span>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Mega Dropdown Modal */}
          {showMegaMenu &&
            hoveredIndex !== null &&
            categories[hoveredIndex]?.subcategories?.length > 0 && (
              <div className="absolute w-full left-0 bg-gray-50 border-t border-green-300 shadow-lg z-40">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-6 max-h-72 overflow-y-auto">
                  {categories[hoveredIndex].subcategories.map((subcat, subIndex) => (
                    <button
                      key={subIndex}
                      onClick={() => handleSubcategoryClick(categories[hoveredIndex].name, subcat)}
                      className="flex items-center justify-center text-center bg-white rounded-lg shadow hover:shadow-md hover:bg-green-50 cursor-pointer p-4 transition-all duration-200 group"
                    >
                      <span className="text-sm text-gray-700 font-medium group-hover:text-green-600">
                        {subcat}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-4 py-8">
        <HeroSlider />
      </div>



      {/* Featured Categories Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600">Discover fresh products in every category</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategoryClick(cat.name)}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  <FaShoppingCart className="text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {cat.subcategories?.length || 0} items
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Special Offers Banner */}
      <div className="bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center text-white">
            <div className="flex items-center justify-center mb-3">
              <FaStar className="text-3xl text-yellow-300 mr-2" />
              <h2 className="text-2xl md:text-3xl font-bold">Special Deals & Offers</h2>
              <FaStar className="text-3xl text-yellow-300 ml-2" />
            </div>
            <p className="text-lg text-green-100 mb-4">
              Don't miss out on our amazing deals and fresh product offers!
            </p>
            <div className="flex justify-center items-center gap-8 mb-6">
              <div className="flex items-center text-white">
                <FaTruck className="text-2xl text-yellow-300 mr-2" />
                <div>
                  <h3 className="font-bold text-sm">Free Delivery</h3>
                  <p className="text-green-100 text-xs">On orders over AED 100</p>
                </div>
              </div>
              <div className="flex items-center text-white">
                <FaLeaf className="text-2xl text-yellow-300 mr-2" />
                <div>
                  <h3 className="font-bold text-sm">Fresh Products</h3>
                  <p className="text-green-100 text-xs">100% Organic & Natural</p>
                </div>
              </div>
              <div className="flex items-center text-white">
                <FaGift className="text-2xl text-yellow-300 mr-2" />
                <div>
                  <h3 className="font-bold text-sm">Daily Deals</h3>
                  <p className="text-green-100 text-xs">New offers every day</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center"
            >
              <FaShoppingCart className="mr-2" />
              Explore All Deals
            </button>
          </div>
        </div>
      </div>

      {/* Product Listing by Category/Subcategory */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          {categories.map((cat) => (
            <div key={cat._id} className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{cat.name}</h2>
                  <p className="text-gray-600">Fresh and quality products</p>
                </div>
                <button
                  onClick={() => handleCategoryClick(cat.name)}
                  className="flex items-center text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  View All <FaArrowRight className="ml-2" />
                </button>
              </div>

              {cat.subcategories?.map((subcat, index) => {
                const filteredProducts = getProductsBySubcategory(subcat);

                if (filteredProducts.length === 0) return null;

                return (
                  <div key={index} className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-700">
                        {subcat}
                      </h3>
                      <button
                        onClick={() => handleSubcategoryClick(cat.name, subcat)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                      >
                        View All
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <div className="flex gap-6 w-max pb-4">
                        {filteredProducts.slice(0, 8).map((product) => (
                          <ProductCard key={product._id} product={product} />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Call to Action Section */}
      <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-32 right-1/3 w-12 h-12 bg-white rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white font-medium mb-6">
              <FaStar className="mr-2 text-yellow-300" />
              Join 10,000+ Happy Customers
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Experience Fresh Grocery Shopping?
            </h2>
            <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us for their daily grocery needs.
              Fast delivery, fresh products, and unbeatable prices.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-2">10K+</div>
                <div className="text-green-100 text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-2">2-4h</div>
                <div className="text-green-100 text-sm">Delivery Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-2">100%</div>
                <div className="text-green-100 text-sm">Fresh Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-2">24/7</div>
                <div className="text-green-100 text-sm">Customer Support</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/products')}
                className="bg-white text-green-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center"
              >
                <FaShoppingCart className="mr-2" />
                Start Shopping Now
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-green-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <FaArrowRight className="mr-2" />
                View My Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Home;