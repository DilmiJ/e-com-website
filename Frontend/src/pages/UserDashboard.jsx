import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../components/AuthContext';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../../Axios/api';
import OrderStatusNotification from '../components/OrderStatusNotification';
import {
  FaUser, FaShoppingBag, FaEdit, FaEye, FaSignOutAlt, FaMapMarkerAlt,
  FaPhone, FaEnvelope, FaSave, FaTimes, FaHeart, FaCreditCard,
  FaShoppingCart, FaStar, FaGift, FaClock, FaCheckCircle
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userOrders, setUserOrders] = useState([]);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const { user, token, logout } = useAuth();

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
    if (activeTab === 'orders') {
      fetchUserOrders();
    }
  }, [user, activeTab]);

  // Auto-refresh orders every 30 seconds when on orders tab
  useEffect(() => {
    if (activeTab === 'orders' && token) {
      const interval = setInterval(() => {
        fetchUserOrders();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [activeTab, token]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/my-orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Store previous orders for comparison
      setPreviousOrders(userOrders);
      setUserOrders(response.data);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // In a real app, you'd have an endpoint to update user profile
      toast.success('Profile updated successfully!');
      setEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-purple-100 text-purple-800',
      'shipped': 'bg-indigo-100 text-indigo-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaUser },
    { id: 'profile', label: 'Profile', icon: FaEdit },
    { id: 'orders', label: 'My Orders', icon: FaShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: FaHeart },
    { id: 'settings', label: 'Settings', icon: FaCreditCard }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavBar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-6 md:mb-0 animate-slide-in-left">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold border-4 border-white/30 shadow-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                    <FaCheckCircle className="text-white text-xs" />
                  </div>
                </div>
                <div className="ml-6">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                  </h1>
                  <p className="text-green-100 text-lg">{user?.email}</p>
                  <p className="text-green-200 text-sm mt-1">Member since 2024</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-right">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <FaShoppingBag className="text-2xl mb-2 mx-auto" />
                  <p className="text-sm text-green-100">Total Orders</p>
                  <p className="text-xl font-bold">{userOrders.length}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <FaHeart className="text-2xl mb-2 mx-auto" />
                  <p className="text-sm text-green-100">Wishlist</p>
                  <p className="text-xl font-bold">12</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500/20 backdrop-blur-sm text-white rounded-xl hover:bg-red-500/30 transition-all duration-300 border border-red-400/30 hover:scale-105"
                >
                  <FaSignOutAlt />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">

          {/* Navigation Tabs */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl mb-8 border border-white/20 animate-fade-in-up">
            <div className="p-2">
              <nav className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                          : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <Icon className={`${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 animate-fade-in-up">
            <div className="p-8">

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-slide-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
                    <p className="text-gray-600">Manage your account and track your orders</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm">Total Orders</p>
                          <p className="text-3xl font-bold">{userOrders.length}</p>
                        </div>
                        <FaShoppingBag className="text-3xl text-blue-200" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm">Completed</p>
                          <p className="text-3xl font-bold">{userOrders.filter(order => order.status === 'delivered').length}</p>
                        </div>
                        <FaCheckCircle className="text-3xl text-green-200" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm">Wishlist Items</p>
                          <p className="text-3xl font-bold">12</p>
                        </div>
                        <FaHeart className="text-3xl text-purple-200" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100 text-sm">Rewards Points</p>
                          <p className="text-3xl font-bold">1,250</p>
                        </div>
                        <FaStar className="text-3xl text-orange-200" />
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <FaClock className="mr-3 text-green-600" />
                        Recent Orders
                      </h3>
                      <div className="space-y-3">
                        {userOrders.slice(0, 3).map((order) => (
                          <div key={order._id} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                            <div>
                              <p className="font-medium text-gray-800">Order #{order._id.slice(-6)}</p>
                              <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        ))}
                        {userOrders.length === 0 && (
                          <p className="text-gray-500 text-center py-4">No recent orders</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <FaGift className="mr-3 text-green-600" />
                        Special Offers
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                          <h4 className="font-bold mb-1">Free Delivery!</h4>
                          <p className="text-sm text-green-100">On orders above AED 100</p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                          <h4 className="font-bold mb-1">Weekend Special</h4>
                          <p className="text-sm text-blue-100">20% off on fresh fruits</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="animate-slide-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Profile Information</h2>
                    <p className="text-gray-600">Manage your personal information and preferences</p>
                  </div>

                  <div className="flex justify-center mb-8">
                    <button
                      onClick={() => setEditingProfile(!editingProfile)}
                      className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg ${
                        editingProfile
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/25'
                          : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/25'
                      }`}
                    >
                      {editingProfile ? <FaTimes /> : <FaEdit />}
                      {editingProfile ? 'Cancel Editing' : 'Edit Profile'}
                    </button>
                  </div>

                  {editingProfile ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-8 animate-fade-in">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 mb-3">
                            <FaUser className="inline mr-2 text-green-600" />
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                            required
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 mb-3">
                            <FaEnvelope className="inline mr-2 text-green-600" />
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                            required
                            placeholder="Enter your email"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 mb-3">
                            <FaPhone className="inline mr-2 text-green-600" />
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                            placeholder="+971 50 123 4567"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 mb-3">
                            <FaMapMarkerAlt className="inline mr-2 text-green-600" />
                            Address
                          </label>
                          <input
                            type="text"
                            value={profileData.address}
                            onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                            placeholder="Street, City, Country"
                          />
                        </div>
                      </div>
                      <div className="flex justify-center gap-6 pt-6">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 transform hover:scale-105 shadow-lg shadow-green-500/25"
                        >
                          <FaSave />
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingProfile(false)}
                          className="flex items-center gap-3 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                        >
                          <FaTimes />
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border-l-4 border-blue-500 transform hover:scale-105 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <div className="bg-blue-500 p-3 rounded-full">
                              <FaUser className="text-white text-xl" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-blue-600 mb-1">Full Name</p>
                              <p className="text-lg font-bold text-gray-800">{user?.name || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border-l-4 border-green-500 transform hover:scale-105 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <div className="bg-green-500 p-3 rounded-full">
                              <FaEnvelope className="text-white text-xl" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-green-600 mb-1">Email Address</p>
                              <p className="text-lg font-bold text-gray-800">{user?.email || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border-l-4 border-purple-500 transform hover:scale-105 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <div className="bg-purple-500 p-3 rounded-full">
                              <FaPhone className="text-white text-xl" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-purple-600 mb-1">Phone Number</p>
                              <p className="text-lg font-bold text-gray-800">{profileData.phone || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border-l-4 border-orange-500 transform hover:scale-105 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <div className="bg-orange-500 p-3 rounded-full">
                              <FaMapMarkerAlt className="text-white text-xl" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-orange-600 mb-1">Address</p>
                              <p className="text-lg font-bold text-gray-800">{profileData.address || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">My Orders</h2>
                    <button
                      onClick={fetchUserOrders}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      🔄 Refresh
                    </button>
                  </div>
                  
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                  ) : userOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <FaShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">No orders found</p>
                      <p className="text-sm text-gray-400 mt-2">Start shopping to see your orders here!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map((order) => (
                        <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-medium text-gray-900">Order #{order._id.slice(-8)}</h3>
                              <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          
                          <div className="border-t pt-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm text-gray-600">
                                  {order.items?.length || 0} item(s)
                                </p>
                                <p className="font-medium">AED {order.total?.toFixed(2)}</p>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowOrderModal(true);
                                }}
                                className="flex items-center gap-2 px-3 py-1 text-sm text-green-600 hover:text-green-700"
                              >
                                <FaEye />
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="animate-slide-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">My Wishlist</h2>
                    <p className="text-gray-600">Save your favorite items for later</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Sample wishlist items */}
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div key={item} className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 border border-gray-100">
                        <div className="bg-gray-200 rounded-xl h-40 mb-4 flex items-center justify-center">
                          <FaShoppingCart className="text-4xl text-gray-400" />
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">Product Name {item}</h3>
                        <p className="text-green-600 font-bold text-lg mb-4">AED 25.99</p>
                        <div className="flex gap-2">
                          <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300">
                            Add to Cart
                          </button>
                          <button className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300">
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Empty state */}
                  <div className="text-center py-12">
                    <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-600 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500">Start adding items you love!</p>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="animate-slide-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Account Settings</h2>
                    <p className="text-gray-600">Manage your preferences and security</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                          <FaCreditCard className="mr-3 text-green-600" />
                          Payment Methods
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <span>**** **** **** 1234</span>
                            <span className="text-sm text-gray-500">Visa</span>
                          </div>
                          <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-green-500 hover:text-green-600 transition-all duration-300">
                            + Add New Card
                          </button>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span>Email Notifications</span>
                            <input type="checkbox" className="toggle" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>SMS Notifications</span>
                            <input type="checkbox" className="toggle" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Order Updates</span>
                            <input type="checkbox" className="toggle" defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Security</h3>
                        <div className="space-y-4">
                          <button className="w-full p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all duration-300">
                            Change Password
                          </button>
                          <button className="w-full p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all duration-300">
                            Enable Two-Factor Auth
                          </button>
                          <button className="w-full p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-300">
                            Delete Account
                          </button>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Privacy</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span>Profile Visibility</span>
                            <select className="border border-gray-300 rounded-lg px-3 py-1">
                              <option>Public</option>
                              <option>Private</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Data Sharing</span>
                            <input type="checkbox" className="toggle" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Order Details - #{selectedOrder._id.slice(-8)}
                </h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Order Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Order Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <strong>Order ID:</strong>
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        #{selectedOrder._id.slice(-8)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong>Status:</strong>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status.toUpperCase()}
                      </span>
                    </div>
                    <p><strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                    <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod?.toUpperCase() || 'COD'}</p>
                    <p><strong>Total Amount:</strong> <span className="text-lg font-bold text-green-600">AED {selectedOrder.total?.toFixed(2)}</span></p>
                  </div>
                </div>

                {/* Delivery Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Delivery Information</h3>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {selectedOrder.userInfo?.name || user?.name || 'N/A'}</p>
                    <p><strong>Phone:</strong> {selectedOrder.userInfo?.phone || 'N/A'}</p>
                    <p><strong>Address:</strong> {selectedOrder.userInfo?.address || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Order Status Timeline */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Order Status Timeline</h3>
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status, index) => {
                    const isActive = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(selectedOrder.status) >= index;
                    const isCurrent = selectedOrder.status === status;
                    return (
                      <div key={status} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCurrent ? 'bg-green-600 text-white' :
                          isActive ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {index + 1}
                        </div>
                        <span className={`text-xs mt-1 ${isCurrent ? 'font-bold text-green-600' : 'text-gray-500'}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Product</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Quantity</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Price</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">AED {item.price?.toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">AED {(item.quantity * item.price)?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="3" className="px-4 py-2 text-sm font-medium text-gray-900 text-right">Total:</td>
                        <td className="px-4 py-2 text-sm font-bold text-green-600">AED {selectedOrder.total?.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowOrderModal(false);
                    fetchUserOrders(); // Refresh orders to get latest status
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Refresh Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Status Notifications */}
      <OrderStatusNotification orders={userOrders} previousOrders={previousOrders} />

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

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }

        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        /* Toggle Switch Styles */
        .toggle {
          appearance: none;
          width: 3rem;
          height: 1.5rem;
          background-color: #e5e7eb;
          border-radius: 9999px;
          position: relative;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .toggle:checked {
          background-color: #10b981;
        }

        .toggle::before {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 1.25rem;
          height: 1.25rem;
          background-color: white;
          border-radius: 50%;
          transition: transform 0.3s;
        }

        .toggle:checked::before {
          transform: translateX(1.5rem);
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
