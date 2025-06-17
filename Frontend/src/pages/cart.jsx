import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import {
  FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft,
  FaHeart, FaSave, FaGift, FaTruck, FaShieldAlt, FaCreditCard,
  FaCheckCircle, FaTimes
} from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingItem, setRemovingItem] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Load cart items from localStorage
  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  };

  useEffect(() => {
    loadCart();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.price || 0) * (item.quantity || 0);
  }, 0);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    const updatedCart = cartItems.map(item =>
      item._id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const removeItem = (productId) => {
    setRemovingItem(productId);

    // Add animation delay
    setTimeout(() => {
      const updatedCart = cartItems.filter(item => item._id !== productId);
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      setRemovingItem(null);
      toast.success('Item removed from cart', {
        position: "top-right",
        autoClose: 2000,
      });
    }, 300);
  };

  const applyPromoCode = () => {
    const validCodes = {
      'SAVE10': 10,
      'WELCOME20': 20,
      'FRESH15': 15
    };

    if (validCodes[promoCode.toUpperCase()]) {
      setDiscount(validCodes[promoCode.toUpperCase()]);
      toast.success(`Promo code applied! ${validCodes[promoCode.toUpperCase()]}% discount`, {
        position: "top-right",
        autoClose: 3000,
      });
      setShowPromoInput(false);
    } else {
      toast.error('Invalid promo code', {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const saveForLater = (item) => {
    // Simulate saving to wishlist
    toast.info('Item saved to wishlist', {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated()) {
      localStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);

    // Simulate a brief loading state
    setTimeout(() => {
      setLoading(false);
      navigate("/checkout");
    }, 500);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
  const discountAmount = (subtotal * discount) / 100;
  const finalTotal = subtotal - discountAmount;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <NavBar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Empty Cart Animation */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center border border-white/20 animate-fade-in-up">
              <div className="mb-8 animate-bounce-slow">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full mb-6">
                  <FaShoppingCart className="text-6xl text-green-600 animate-pulse" />
                </div>
              </div>

              <h2 className="text-4xl font-bold mb-4 text-gray-800 animate-slide-in">
                Your Cart is Empty
              </h2>
              <p className="text-xl text-gray-600 mb-8 animate-slide-in-delayed">
                Looks like you haven't added any delicious items yet!
              </p>

              {/* Suggestions */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 animate-slide-in">
                  <FaTruck className="text-2xl text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-blue-800 font-medium">Free Delivery</p>
                  <p className="text-xs text-blue-600">On orders over AED 100</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 animate-slide-in-delayed">
                  <FaGift className="text-2xl text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-green-800 font-medium">Special Offers</p>
                  <p className="text-xs text-green-600">Daily fresh deals</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 animate-slide-in-delayed-2">
                  <FaShieldAlt className="text-2xl text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-purple-800 font-medium">Quality Assured</p>
                  <p className="text-xs text-purple-600">Fresh & organic</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-delayed-3">
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white px-8 py-4 rounded-2xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25 font-medium"
                >
                  <FaShoppingCart />
                  Start Shopping
                </button>
                <button
                  onClick={() => navigate("/category/fruits")}
                  className="flex items-center justify-center gap-3 border-2 border-green-600 text-green-600 px-8 py-4 rounded-2xl hover:bg-green-50 transition-all duration-300 transform hover:scale-105 font-medium"
                >
                  Browse Fresh Fruits
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavBar />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center animate-slide-in-left">
              <button
                onClick={() => navigate("/")}
                className="flex items-center text-white hover:text-green-200 transition-colors mr-6 group"
              >
                <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                <span>Continue Shopping</span>
              </button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center">
                  <FaShoppingCart className="mr-4" />
                  Shopping Cart
                </h1>
                <p className="text-green-100">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
              </div>
            </div>
            <button
              onClick={clearCart}
              className="flex items-center gap-2 bg-red-500/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-red-500/30 transition-all duration-300 border border-red-400/30 animate-slide-in-right"
            >
              <FaTrash />
              <span className="hidden sm:inline">Clear Cart</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in-up">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaShoppingCart className="mr-3 text-green-600" />
                Cart Items
              </h2>

              <div className="space-y-6">
                {cartItems.map((item, index) => {
                  const itemTotal = item.price * item.quantity;
                  const isRemoving = removingItem === item._id;

                  return (
                    <div
                      key={index}
                      className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${
                        isRemoving ? 'animate-slide-out opacity-0 scale-95' : 'animate-slide-in'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">

                          {/* Product Image Placeholder */}
                          <div className="w-full md:w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-2xl" />
                            ) : (
                              <FaShoppingCart className="text-2xl text-green-600" />
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                            <p className="text-green-600 font-bold text-lg mb-3">AED {item.price.toFixed(2)} each</p>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                                <button
                                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                  className="bg-white hover:bg-gray-50 p-3 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-sm"
                                >
                                  <FaMinus className="text-sm text-gray-600" />
                                </button>
                                <span className="font-bold text-xl px-6 text-gray-800">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                  className="bg-white hover:bg-gray-50 p-3 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-sm"
                                >
                                  <FaPlus className="text-sm text-gray-600" />
                                </button>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveForLater(item)}
                                  className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all duration-200 transform hover:scale-105"
                                >
                                  <FaHeart className="text-sm" />
                                  <span className="hidden sm:inline text-sm">Save</span>
                                </button>
                                <button
                                  onClick={() => removeItem(item._id)}
                                  className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-all duration-200 transform hover:scale-105"
                                >
                                  <FaTrash className="text-sm" />
                                  <span className="hidden sm:inline text-sm">Remove</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">Total</p>
                            <p className="text-2xl font-bold text-gray-800">
                              AED {itemTotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in-up sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaCreditCard className="mr-3 text-green-600" />
                Order Summary
              </h2>

              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold">AED {subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount ({discount}%)</span>
                    <span className="font-semibold">-AED {discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <hr className="border-gray-200" />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-gray-800">Total</span>
                  <span className="text-green-600">AED {finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code Section */}
              <div className="mb-6">
                {!showPromoInput ? (
                  <button
                    onClick={() => setShowPromoInput(true)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 py-3 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border border-blue-200"
                  >
                    <FaGift />
                    Add Promo Code
                  </button>
                ) : (
                  <div className="space-y-3 animate-slide-in">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      />
                      <button
                        onClick={applyPromoCode}
                        className="bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-all duration-200"
                      >
                        Apply
                      </button>
                    </div>
                    <button
                      onClick={() => setShowPromoInput(false)}
                      className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <div className="text-xs text-gray-500">
                      Try: SAVE10, WELCOME20, FRESH15
                    </div>
                  </div>
                )}
              </div>

              {/* Benefits */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6">
                <h3 className="font-bold text-green-800 mb-3 flex items-center">
                  <FaCheckCircle className="mr-2" />
                  Your Benefits
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-green-700">
                    <FaTruck className="mr-2 text-xs" />
                    Free delivery on this order
                  </div>
                  <div className="flex items-center text-green-700">
                    <FaShieldAlt className="mr-2 text-xs" />
                    Quality guarantee
                  </div>
                  <div className="flex items-center text-green-700">
                    <FaGift className="mr-2 text-xs" />
                    Earn 50 reward points
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 rounded-2xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 disabled:opacity-50 transform hover:scale-105 shadow-lg shadow-green-500/25 font-bold text-lg mb-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FaCreditCard />
                    Proceed to Checkout
                  </div>
                )}
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-out {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }

        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
        }

        .animate-slide-in-delayed {
          animation: slide-in 0.8s ease-out forwards;
        }

        .animate-slide-in-delayed-2 {
          animation: slide-in 1s ease-out forwards;
        }

        .animate-slide-in-delayed-3 {
          animation: slide-in 1.2s ease-out forwards;
        }

        .animate-slide-out {
          animation: slide-out 0.3s ease-in forwards;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Cart;
