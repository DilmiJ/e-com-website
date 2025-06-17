import { FaShoppingCart, FaUser, FaSignOutAlt, FaUserCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const NavBar = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
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

  return (
    <nav className="bg-green-600 text-white px-6 py-3 flex justify-between items-center">
      <div
        className="font-extrabold text-2xl cursor-pointer"
        onClick={() => navigate("/")}
      >
        Barakat
      </div>

      <div className="w-1/2">
        <input
          type="text"
          placeholder="What are you looking for?"
          className="w-full p-2 rounded text-black"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Authentication Section */}
        {isAuthenticated() ? (
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="flex items-center gap-2">
              <FaUser className="text-white" />
              <span className="text-white">Hi, {user?.name}</span>
            </div>

            {/* User Dashboard Link */}
            <button
              className="flex items-center gap-1 text-white hover:underline"
              onClick={() => navigate("/dashboard")}
            >
              <FaUser />
              <span>My Account</span>
            </button>

            {/* Admin Dashboard Link */}
            {isAdmin() && (
              <button
                className="flex items-center gap-1 text-white hover:underline"
                onClick={() => navigate("/admin")}
              >
                <FaUserCog />
                <span>Admin</span>
              </button>
            )}

            {/* Logout */}
            <button
              className="flex items-center gap-1 text-white hover:underline"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <button
            className="flex items-center gap-1 text-white hover:underline"
            onClick={() => navigate("/login")}
          >
            <FaUser />
            <span>Sign In</span>
          </button>
        )}

        {/* Cart */}
        <button
          className="relative flex items-center gap-1"
          onClick={() => navigate("/cart")}
        >
          <FaShoppingCart className="text-white" />
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-xs rounded-full px-1">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
