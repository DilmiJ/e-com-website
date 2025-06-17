import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import api from '../../../Axios/api';
import {
  FaEye, FaTrash, FaSearch, FaFilter, FaShoppingCart, FaArrowLeft,
  FaUser, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaCreditCard,
  FaCheck, FaTimes, FaExclamationTriangle, FaSync, FaDownload
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    if (isAdmin()) {
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/admin/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(response.data);
      toast.success(`Loaded ${response.data.length} orders`);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await api.put(`/orders/admin/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      toast.success('Order status updated');
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await api.delete(`/orders/admin/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(orders.filter(order => order._id !== orderId));
      setShowOrderModal(false);
      setDeleteConfirm(null);
      toast.success("Order deleted successfully! 🗑️");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete order");
    }
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(s => s.value === status);
    return option ? option.color : 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = orders.filter(order => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      order._id.toLowerCase().includes(search) ||
      order.userId?.name?.toLowerCase().includes(search) ||
      order.userId?.email?.toLowerCase().includes(search);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });

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

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <NavBar />
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-white/20">
            <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">This page is restricted to administrators only.</p>
            <button
              onClick={() => navigate('/admin')}
              className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300"
            >
              Go to Dashboard
            </button>
          </div>
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
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center text-white hover:text-green-200 transition-colors mb-4 group"
              >
                <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center">
                <FaShoppingCart className="mr-4" />
                Order Management
              </h1>
              <p className="text-green-100 text-lg">Track and manage all customer orders</p>
            </div>
            <div className="hidden md:block animate-slide-in-right">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <FaShoppingCart className="text-3xl mb-2 mx-auto" />
                <p className="text-sm text-green-100">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Controls Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in-up mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by ID, name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 appearance-none bg-white min-w-[150px]"
                >
                  <option value="all">All Status</option>
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchOrders}
                className="bg-blue-100 text-blue-600 px-4 py-3 rounded-xl hover:bg-blue-200 transition-colors flex items-center gap-2 font-medium"
              >
                <FaSync />
                Refresh
              </button>
              <button
                onClick={() => window.print()}
                className="bg-green-100 text-green-600 px-4 py-3 rounded-xl hover:bg-green-200 transition-colors flex items-center gap-2 font-medium"
              >
                <FaDownload />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <div
                key={order._id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in-up transform hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-xl mr-4">
                      <FaShoppingCart className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">#{order._id.slice(-8)}</h3>
                      <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {statusOptions.find(s => s.value === order.status)?.label || order.status}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <FaUser className="text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      {order.userInfo?.name || order.userId?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaPhone className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {order.userInfo?.phone || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaCreditCard className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {order.paymentMethod || 'COD'}
                    </span>
                  </div>
                </div>

                {/* Order Total */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4 border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-medium">Total Amount</span>
                    <span className="text-xl font-bold text-green-800">AED {order.total?.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    {order.items?.length || 0} items
                  </div>
                </div>

                {/* Status Update */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    disabled={updatingStatus}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowOrderModal(true);
                    }}
                    className="flex-1 bg-blue-100 text-blue-600 px-3 py-2 rounded-xl hover:bg-blue-200 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <FaEye />
                    View Details
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(order)}
                    className="bg-red-100 text-red-600 px-3 py-2 rounded-xl hover:bg-red-200 transition-colors flex items-center justify-center"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No orders found' : 'No orders yet'}
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Orders will appear here when customers place them'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-8 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-xl mr-4">
                    <FaShoppingCart className="text-green-600 text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Order #{selectedOrder._id.slice(-8)}
                    </h2>
                    <p className="text-gray-600">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="bg-gray-100 text-gray-600 p-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Customer Information */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                    <FaUser className="mr-3" />
                    Customer Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FaUser className="text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm text-blue-600">Name</p>
                        <p className="font-semibold text-blue-800">
                          {selectedOrder.userInfo?.name || selectedOrder.userId?.name || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm text-blue-600">Phone</p>
                        <p className="font-semibold text-blue-800">
                          {selectedOrder.userInfo?.phone || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="text-blue-600 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-blue-600">Address</p>
                        <p className="font-semibold text-blue-800">
                          {selectedOrder.userInfo?.address || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Information */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                    <FaShoppingCart className="mr-3" />
                    Order Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-green-600 mr-3" />
                      <div>
                        <p className="text-sm text-green-600">Order Date</p>
                        <p className="font-semibold text-green-800">
                          {formatDate(selectedOrder.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaCreditCard className="text-green-600 mr-3" />
                      <div>
                        <p className="text-sm text-green-600">Payment Method</p>
                        <p className="font-semibold text-green-800">
                          {selectedOrder.paymentMethod || 'Cash on Delivery'}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-green-300">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-green-700 font-medium">Total Amount</span>
                        <span className="text-2xl font-bold text-green-800">
                          AED {selectedOrder.total?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-600">Status</span>
                        <select
                          value={selectedOrder.status}
                          onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                          disabled={updatingStatus}
                          className="px-3 py-1 rounded-xl text-sm border border-green-300 focus:ring-2 focus:ring-green-500"
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <FaShoppingCart className="mr-3 text-gray-600" />
                    Order Items ({selectedOrder.items?.length || 0})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Product</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Quantity</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Unit Price</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="bg-green-100 p-2 rounded-lg mr-3">
                                <FaShoppingCart className="text-green-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-600">Product ID: {item._id?.slice(-6) || 'N/A'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-800">
                            AED {item.price?.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 font-bold text-green-600">
                            AED {(item.quantity * item.price)?.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gradient-to-r from-green-50 to-emerald-50">
                      <tr>
                        <td colSpan="3" className="px-6 py-4 text-right text-lg font-bold text-green-800">
                          Grand Total:
                        </td>
                        <td className="px-6 py-4 text-xl font-bold text-green-800">
                          AED {selectedOrder.total?.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex gap-4 justify-end">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setDeleteConfirm(selectedOrder);
                    setShowOrderModal(false);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25 font-medium flex items-center gap-2"
                >
                  <FaTrash />
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border border-white/20">
            <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <FaExclamationTriangle className="text-red-600 text-2xl mx-auto mt-1" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Delete Order
            </h3>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete order <strong>#{deleteConfirm._id.slice(-8)}</strong>?
              This action cannot be undone.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteOrder(deleteConfirm._id)}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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

export default OrderManagement;
