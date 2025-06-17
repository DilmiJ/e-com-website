import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import api from "../../Axios/api";
import {
  FaBox, FaShoppingCart, FaUsers, FaChartBar, FaCog, FaSignOutAlt,
  FaPlus, FaEdit, FaTrash, FaEye, FaTags, FaClipboardList, FaUserShield,
  FaDollarSign, FaArrowUp, FaBell, FaCalendarAlt, FaDownload, FaSearch
} from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const openInventoryModal = () => setIsOpen(true);
  const closeInventoryModal = () => setIsOpen(false);

  useEffect(() => {
    if (!isAuthenticated() || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchDashboardStats();
  }, [isAuthenticated, user, navigate]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Fetch dashboard statistics
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        api.get('/products'),
        api.get('/orders'),
        api.get('/users')
      ]);

      const products = productsRes.data || [];
      const orders = ordersRes.data || [];
      const users = usersRes.data || [];

      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const recentOrders = orders.slice(0, 5);
      const lowStockProducts = products.filter(product => (product.stock || 0) < 10);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue,
        recentOrders,
        lowStockProducts
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <NavBar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavBar />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div className="animate-slide-in-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center">
                <FaUserShield className="mr-4" />
                Admin Dashboard
              </h1>
              <p className="text-green-100 text-lg">Welcome back, {user?.name}! Manage your store efficiently.</p>
            </div>
            <div className="hidden md:flex items-center gap-4 animate-slide-in-right">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <FaCalendarAlt className="text-2xl mb-2 mx-auto" />
                <p className="text-sm text-green-100">Today</p>
                <p className="text-lg font-bold">{new Date().toLocaleDateString()}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-red-500/30 transition-all duration-300 border border-red-400/30"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in-up transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalProducts}</p>
                <p className="text-green-600 text-sm mt-1">📦 In inventory</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-2xl">
                <FaBox className="text-3xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in-up transform hover:scale-105 transition-all duration-300" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
                <p className="text-green-600 text-sm mt-1">🛒 All time</p>
              </div>
              <div className="bg-green-100 p-4 rounded-2xl">
                <FaShoppingCart className="text-3xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in-up transform hover:scale-105 transition-all duration-300" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                <p className="text-green-600 text-sm mt-1">👥 Registered</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-2xl">
                <FaUsers className="text-3xl text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in-up transform hover:scale-105 transition-all duration-300" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-800">AED {stats.totalRevenue.toFixed(2)}</p>
                <p className="text-green-600 text-sm mt-1">💰 All time</p>
              </div>
              <div className="bg-orange-100 p-4 rounded-2xl">
                <FaDollarSign className="text-3xl text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">

          {/* Management Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in-up">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaCog className="mr-3 text-green-600" />
                Quick Actions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={openInventoryModal}
                  className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
                >
                  <FaBox className="text-3xl mb-3 mx-auto" />
                  <h3 className="font-bold text-lg mb-2">Manage Inventory</h3>
                  <p className="text-blue-100 text-sm">Products & Categories</p>
                </button>

                <button
                  onClick={() => navigate("/admin/orders")}
                  className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25"
                >
                  <FaShoppingCart className="text-3xl mb-3 mx-auto" />
                  <h3 className="font-bold text-lg mb-2">Orders</h3>
                  <p className="text-green-100 text-sm">Track & Manage</p>
                </button>

                <button
                  onClick={() => navigate("/admin/users")}
                  className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25"
                >
                  <FaUsers className="text-3xl mb-3 mx-auto" />
                  <h3 className="font-bold text-lg mb-2">Users</h3>
                  <p className="text-purple-100 text-sm">Customer Management</p>
                </button>

                <button
                  onClick={() => navigate("/admin/analytics")}
                  className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/25"
                >
                  <FaChartBar className="text-3xl mb-3 mx-auto" />
                  <h3 className="font-bold text-lg mb-2">Analytics</h3>
                  <p className="text-orange-100 text-sm">Reports & Insights</p>
                </button>

                <button
                  onClick={() => navigate("/admin/settings")}
                  className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-2xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/25"
                >
                  <FaCog className="text-3xl mb-3 mx-auto" />
                  <h3 className="font-bold text-lg mb-2">Settings</h3>
                  <p className="text-indigo-100 text-sm">Store Configuration</p>
                </button>

                <button
                  onClick={() => window.open('/admin/reports', '_blank')}
                  className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-2xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-teal-500/25"
                >
                  <FaDownload className="text-3xl mb-3 mx-auto" />
                  <h3 className="font-bold text-lg mb-2">Reports</h3>
                  <p className="text-teal-100 text-sm">Export Data</p>
                </button>
              </div>
            </div>
          </div>

          {/* Notifications & Alerts */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in-up">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaBell className="mr-3 text-red-600" />
                Alerts
              </h3>

              <div className="space-y-4">
                {stats.lowStockProducts.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h4 className="font-bold text-red-800 mb-2">Low Stock Alert</h4>
                    <p className="text-red-600 text-sm mb-2">
                      {stats.lowStockProducts.length} products running low
                    </p>
                    <button className="text-red-600 text-sm font-medium hover:underline">
                      View Details →
                    </button>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-bold text-blue-800 mb-2">New Orders</h4>
                  <p className="text-blue-600 text-sm mb-2">
                    {stats.recentOrders.length} orders need attention
                  </p>
                  <button
                    onClick={() => navigate("/admin/orders")}
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    Manage Orders →
                  </button>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h4 className="font-bold text-green-800 mb-2">System Status</h4>
                  <p className="text-green-600 text-sm mb-2">All systems operational</p>
                  <div className="flex items-center text-green-600 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Online
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">

          {/* Recent Orders */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <FaClipboardList className="mr-3 text-green-600" />
                Recent Orders
              </h3>
              <button
                onClick={() => navigate("/admin/orders")}
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                View All →
              </button>
            </div>

            <div className="space-y-4">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order, index) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-lg mr-4">
                        <FaShoppingCart className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Order #{order._id?.slice(-6)}</p>
                        <p className="text-sm text-gray-600">{order.user?.name || 'Customer'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">AED {order.totalAmount?.toFixed(2)}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FaShoppingCart className="text-4xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent orders</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in-up">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <FaArrowUp className="mr-3 text-green-600" />
              Performance Overview
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <FaBox className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Products</p>
                    <p className="text-sm text-gray-600">Total inventory</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
                  <p className="text-sm text-green-600">+12% this month</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <FaShoppingCart className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Orders</p>
                    <p className="text-sm text-gray-600">Total processed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
                  <p className="text-sm text-green-600">+8% this month</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg mr-4">
                    <FaUsers className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Customers</p>
                    <p className="text-sm text-gray-600">Active users</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
                  <p className="text-sm text-green-600">+15% this month</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-green-800">Revenue Growth</p>
                    <p className="text-sm text-green-600">This month vs last month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-800">+23%</p>
                    <p className="text-sm text-green-600">AED {stats.totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeInventoryModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Manage Inventory
                  </Dialog.Title>
                  <div className="mt-4 flex flex-col gap-4">
                    <button
                      onClick={() => {
                        closeInventoryModal();
                        navigate("/admin/categories"); // ✅ Navigate here
                      }}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      ➕ Manage Categories
                    </button>
                    <button
                      onClick={() => {
                        closeInventoryModal();
                        navigate("/admin/products"); // ✅ Hook up later
                      }}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      📦 Manage Products
                    </button>
                    <button
                      onClick={() => {
                        closeInventoryModal();
                        navigate("/admin/orders");
                      }}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      📋 Manage Orders
                    </button>
                    <button
                      onClick={() => {
                        closeInventoryModal();
                        navigate("/admin/users");
                      }}
                      className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      👥 Manage Users
                    </button>
                    <button
                      onClick={closeInventoryModal}
                      className="w-full mt-2 text-gray-500 hover:text-red-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

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

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
