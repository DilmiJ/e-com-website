import { FaShoppingCart, FaUser, FaSignOutAlt, FaUserCog, FaSearch, FaBars, FaTimes, FaHeart, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const NavBar = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  // Update cart count from localStorage
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalItems);
  };

  useEffect(() => {
    updateCartCount();

    // Listen for cart updates
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality here
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-green-600 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <FaMapMarkerAlt className="text-xs" />
              <span>Deliver to Dubai, UAE</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>Free delivery on orders over AED 100</span>
            <span>|</span>
            <span>24/7 Customer Support</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="bg-green-600 text-white p-2 rounded-lg mr-3 group-hover:bg-green-700 transition-colors">
              <FaShoppingCart className="text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-600 group-hover:text-green-700 transition-colors">
                Barakat
              </h1>
              <p className="text-xs text-gray-500">Fresh Groceries</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands, categories..."
                  className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-gray-700 placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaSearch />
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Navigation Items */}
          <div className="hidden lg:flex items-center space-x-6">

            {/* Wishlist */}
            <button className="flex flex-col items-center text-gray-600 hover:text-green-600 transition-colors group">
              <FaHeart className="text-xl mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs">Wishlist</span>
            </button>

            {/* User Account */}
            {isAuthenticated() ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaUser className="text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Hi, {user?.name}</p>
                    <p className="text-xs text-gray-500">My Account</p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      <FaUser className="mr-3" />
                      My Account
                    </button>
                    {isAdmin() && (
                      <button
                        onClick={() => navigate("/admin")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                      >
                        <FaUserCog className="mr-3" />
                        Admin Panel
                      </button>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt className="mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex flex-col items-center text-gray-600 hover:text-green-600 transition-colors group"
              >
                <div className="bg-gray-100 p-2 rounded-full group-hover:bg-green-100 transition-colors">
                  <FaUser className="text-lg group-hover:text-green-600" />
                </div>
                <span className="text-xs mt-1">Sign In</span>
              </button>
            )}

            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative flex flex-col items-center text-gray-600 hover:text-green-600 transition-colors group"
            >
              <div className="relative bg-green-600 text-white p-2 rounded-full group-hover:bg-green-700 transition-colors">
                <FaShoppingCart className="text-lg" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">Cart</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-gray-600 hover:text-green-600 transition-colors"
          >
            {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-2 rounded-lg"
              >
                <FaSearch />
              </button>
            </form>

            {/* Mobile Navigation Items */}
            <div className="space-y-3">
              <button className="flex items-center w-full text-left text-gray-600 hover:text-green-600 transition-colors">
                <FaHeart className="mr-3" />
                Wishlist
              </button>

              {isAuthenticated() ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full text-left text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <FaUser className="mr-3" />
                    My Account
                  </button>
                  {isAdmin() && (
                    <button
                      onClick={() => {
                        navigate("/admin");
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full text-left text-gray-600 hover:text-green-600 transition-colors"
                    >
                      <FaUserCog className="mr-3" />
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full text-left text-red-600 hover:text-red-700 transition-colors"
                  >
                    <FaSignOutAlt className="mr-3" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full text-left text-gray-600 hover:text-green-600 transition-colors"
                >
                  <FaUser className="mr-3" />
                  Sign In
                </button>
              )}

              <button
                onClick={() => {
                  navigate("/cart");
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full text-left text-gray-600 hover:text-green-600 transition-colors"
              >
                <FaShoppingCart className="mr-3" />
                Cart {cartCount > 0 && `(${cartCount})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
