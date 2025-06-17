import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import api from "../../Axios/api";
import {
  FaCreditCard, FaMoneyBillWave, FaShoppingCart, FaUser, FaMapMarkerAlt,
  FaPhone, FaLock, FaCheckCircle, FaTruck, FaShieldAlt, FaGift,
  FaArrowLeft, FaSpinner, FaCheck, FaTimes
} from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userData, setUserData] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAuth();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      localStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/login");
      return;
    }

    // Check cart
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (storedCart.length === 0) {
      toast.error("Your cart is empty. Please add items before checkout.");
      navigate("/cart");
      return;
    }

    setCartItems(storedCart);

    // Pre-fill user data if available
    if (user) {
      setUserData(prev => ({
        ...prev,
        name: user.name || ""
      }));
    }
  }, [navigate, isAuthenticated, user]);

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.price || 0) * (item.quantity || 0);
  }, 0);

  const validateForm = () => {
    const newErrors = {};

    if (!userData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!userData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!userData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(userData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!isAuthenticated()) {
      alert("Please log in to place an order.");
      navigate("/login");
      return;
    }

    setLoading(true);

    const orderData = {
      items: cartItems,
      total,
      userInfo: userData,
      paymentMethod,
    };

    try {
      const response = await api.post("/orders", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrderSuccess(true);
      setOrderId(response.data.order._id);
      localStorage.removeItem("cart");
      window.dispatchEvent(new CustomEvent('cartUpdated'));

      toast.success("Order placed successfully! 🎉", {
        position: "top-center",
        autoClose: 5000,
      });

      // Auto redirect after 5 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 5000);

    } catch (err) {
      console.error("Order placement error:", err);
      const errorMessage = err.response?.data?.message || "Failed to place order. Please try again.";
      toast.error(`❌ ${errorMessage}`, {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Success Page Component
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <NavBar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/20 animate-fade-in-up">

              {/* Success Animation */}
              <div className="mb-8 animate-bounce-slow">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-lg">
                  <FaCheckCircle className="text-6xl text-white animate-pulse" />
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-800 mb-4 animate-slide-in">
                Order Placed Successfully! 🎉
              </h1>

              <p className="text-xl text-gray-600 mb-6 animate-slide-in-delayed">
                Thank you for your order! We'll prepare your fresh groceries with care.
              </p>

              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 mb-8 animate-slide-in-delayed-2">
                <h3 className="font-bold text-green-800 mb-3">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Order ID:</span>
                    <span className="font-mono font-bold text-green-800">#{orderId.slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Total Amount:</span>
                    <span className="font-bold text-green-800">AED {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Payment Method:</span>
                    <span className="font-bold text-green-800">Cash on Delivery</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 rounded-2xl p-4 animate-slide-in">
                  <FaTruck className="text-2xl text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-blue-800 font-medium">Fast Delivery</p>
                  <p className="text-xs text-blue-600">Within 2-4 hours</p>
                </div>
                <div className="bg-green-50 rounded-2xl p-4 animate-slide-in-delayed">
                  <FaShieldAlt className="text-2xl text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-green-800 font-medium">Quality Assured</p>
                  <p className="text-xs text-green-600">Fresh & organic</p>
                </div>
                <div className="bg-purple-50 rounded-2xl p-4 animate-slide-in-delayed-2">
                  <FaGift className="text-2xl text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-purple-800 font-medium">Reward Points</p>
                  <p className="text-xs text-purple-600">+50 points earned</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-delayed-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white px-8 py-4 rounded-2xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25 font-medium"
                >
                  <FaUser />
                  View Orders
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center justify-center gap-3 border-2 border-green-600 text-green-600 px-8 py-4 rounded-2xl hover:bg-green-50 transition-all duration-300 transform hover:scale-105 font-medium"
                >
                  Continue Shopping
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                Redirecting to dashboard in 5 seconds...
              </p>
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
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center animate-slide-in-left">
                <button
                  onClick={() => navigate("/cart")}
                  className="flex items-center text-white hover:text-green-200 transition-colors mr-6 group"
                >
                  <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                  <span>Back to Cart</span>
                </button>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center">
                    <FaShoppingCart className="mr-4" />
                    Secure Checkout
                  </h1>
                  <p className="text-green-100">Complete your order safely and securely</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 animate-slide-in-right">
                <FaLock className="text-green-200" />
                <span className="text-green-100 text-sm">SSL Secured</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">{/* Progress Steps */}
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full font-bold">
                  1
                </div>
                <span className="ml-2 text-green-600 font-medium">Order Review</span>
              </div>
              <div className="w-16 h-1 bg-green-600 rounded"></div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full font-bold">
                  2
                </div>
                <span className="ml-2 text-green-600 font-medium">Delivery Info</span>
              </div>
              <div className="w-16 h-1 bg-green-600 rounded"></div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full font-bold">
                  3
                </div>
                <span className="ml-2 text-green-600 font-medium">Payment</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in-up mb-6">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <FaShoppingCart className="text-green-600" />
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-slide-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-2xl" />
                            ) : (
                              <FaShoppingCart className="text-green-600 text-xl" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">{item.name}</h4>
                            <p className="text-green-600 font-semibold">AED {item.price.toFixed(2)} each</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-800">
                            AED {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                      <span className="font-semibold">AED {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Service Fee</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <hr className="border-green-200" />
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span className="text-gray-800">Total Amount</span>
                      <span className="text-green-600">AED {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Checkout Form Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in-up sticky top-4">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <FaUser className="text-green-600" />
                  Delivery Information
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      <FaUser className="inline mr-2 text-green-600" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white ${
                        errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm animate-shake flex items-center gap-1">
                        <FaTimes className="text-xs" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Delivery Address */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      <FaMapMarkerAlt className="inline mr-2 text-green-600" />
                      Delivery Address *
                    </label>
                    <textarea
                      name="address"
                      value={userData.address}
                      onChange={handleInputChange}
                      rows="4"
                      className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white resize-none ${
                        errors.address ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="Enter your complete delivery address including building, street, area, and landmarks"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm animate-shake flex items-center gap-1">
                        <FaTimes className="text-xs" />
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      <FaPhone className="inline mr-2 text-green-600" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white ${
                        errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="+971 50 123 4567"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm animate-shake flex items-center gap-1">
                        <FaTimes className="text-xs" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 mb-4">
                      <FaCreditCard className="inline mr-2 text-green-600" />
                      Payment Method
                    </label>

                    <div className="space-y-3">
                      <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        paymentMethod === "cod"
                          ? 'border-green-500 bg-green-50 shadow-lg shadow-green-500/25'
                          : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-4 w-5 h-5 text-green-600"
                        />
                        <FaMoneyBillWave className="text-green-600 mr-3 text-xl" />
                        <div>
                          <span className="font-bold text-gray-800">Cash on Delivery</span>
                          <p className="text-sm text-gray-600">Pay when you receive your order</p>
                        </div>
                        {paymentMethod === "cod" && (
                          <FaCheckCircle className="ml-auto text-green-600 text-xl" />
                        )}
                      </label>

                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-2xl cursor-not-allowed opacity-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          disabled
                          className="mr-4 w-5 h-5"
                        />
                        <FaCreditCard className="text-gray-400 mr-3 text-xl" />
                        <div>
                          <span className="font-bold text-gray-500">Credit/Debit Card</span>
                          <p className="text-sm text-gray-400">Coming Soon</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                    <div className="flex items-center gap-3">
                      <FaLock className="text-blue-600 text-xl" />
                      <div>
                        <h4 className="font-bold text-blue-800">Secure Checkout</h4>
                        <p className="text-sm text-blue-600">Your information is protected with SSL encryption</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="space-y-4 pt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 rounded-2xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg shadow-green-500/25 font-bold text-lg"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-3">
                          <FaSpinner className="animate-spin" />
                          Placing Order...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <FaCheckCircle />
                          Place Order - AED {total.toFixed(2)}
                        </div>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/cart")}
                      className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                      Back to Cart
                    </button>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-2 pt-4 text-center">
                    <div className="text-xs text-gray-500">
                      <FaShieldAlt className="mx-auto mb-1 text-green-600" />
                      <span>Secure</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <FaTruck className="mx-auto mb-1 text-green-600" />
                      <span>Fast Delivery</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <FaCheckCircle className="mx-auto mb-1 text-green-600" />
                      <span>Quality</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <ToastContainer
        position="top-center"
        autoClose={5000}
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

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
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

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Checkout;
