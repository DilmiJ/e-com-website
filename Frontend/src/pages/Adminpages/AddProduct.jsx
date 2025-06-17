import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import api from "../../../Axios/api";
import {
  FaBox, FaPlus, FaEdit, FaTrash, FaEye, FaArrowLeft, FaSearch,
  FaFilter, FaImage, FaTimes, FaCheck, FaExclamationTriangle,
  FaDollarSign, FaWarehouse, FaTags, FaSave
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ProductInventory = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    price: "",
    offer: "",
    description: "",
    subcategoryId: "",
  });
  const [base64Images, setBase64Images] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewProduct, setViewProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const getSubcategories = () => {
    const selectedCategory = categories.find(cat => cat._id === selectedMainCategory);
    return selectedCategory?.subcategories || [];
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMainCategoryChange = (e) => {
    const mainCatId = e.target.value;
    setSelectedMainCategory(mainCatId);
    setForm({ ...form, subcategoryId: "" });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    const readers = files.map(file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }));

    Promise.all(readers)
      .then(setBase64Images)
      .catch(() => toast.error("Image processing error"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const payload = { ...form, mainCategoryId: selectedMainCategory, images: base64Images };

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product added");
      }
      fetchProducts();
      handleCancel();
    } catch {
      toast.error("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      offer: product.offer,
      description: product.description,
      subcategoryId: product.subcategory,
    });
    setSelectedMainCategory(product.mainCategoryId);
    setBase64Images(product.images);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted successfully! 🗑️");
      fetchProducts();
      setDeleteConfirm(null);
    } catch {
      toast.error("Error deleting product");
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.mainCategoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCancel = () => {
    setForm({ name: "", quantity: "", price: "", offer: "", description: "", subcategoryId: "" });
    setSelectedMainCategory("");
    setBase64Images([]);
    setEditingProduct(null);
    setShowForm(false);
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
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center text-white hover:text-green-200 transition-colors mb-4 group"
              >
                <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center">
                <FaBox className="mr-4" />
                Product Management
              </h1>
              <p className="text-green-100 text-lg">Manage your product inventory and catalog</p>
            </div>
            <div className="hidden md:block animate-slide-in-right">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <FaBox className="text-3xl mb-2 mx-auto" />
                <p className="text-sm text-green-100">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
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
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 appearance-none bg-white min-w-[150px]"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25 flex items-center gap-2 font-medium"
            >
              <FaPlus />
              Add Product
            </button>
          </div>
        </div>

        {/* Add/Edit Product Form */}
        {showForm && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 animate-fade-in-up mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FaBox className="mr-3 text-green-600" />
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={handleCancel}
                className="bg-gray-100 text-gray-600 p-3 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    <FaTags className="inline mr-2 text-green-600" />
                    Main Category *
                  </label>
                  <select
                    value={selectedMainCategory}
                    onChange={handleMainCategoryChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                    required
                  >
                    <option value="">Select Main Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Subcategory *
                  </label>
                  <select
                    name="subcategoryId"
                    value={form.subcategoryId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                    required
                  >
                    <option value="">Select Subcategory</option>
                    {getSubcategories().map((sub, idx) => (
                      <option key={idx} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    <FaDollarSign className="inline mr-2 text-green-600" />
                    Price (AED) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="0.00"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    <FaWarehouse className="inline mr-2 text-green-600" />
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="0"
                    value={form.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Offer (Optional)
                  </label>
                  <input
                    type="text"
                    name="offer"
                    placeholder="e.g., 20% OFF"
                    value={form.offer}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Description *
                </label>
                <textarea
                  name="description"
                  placeholder="Enter product description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  <FaImage className="inline mr-2 text-green-600" />
                  Product Images (Max 3)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 transition-colors"
                />

                {base64Images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {base64Images.map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={img}
                          alt={`Preview ${i + 1}`}
                          className="w-full h-24 object-cover rounded-xl border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => setBase64Images(base64Images.filter((_, idx) => idx !== i))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-2xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25 font-medium flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      {editingProduct ? "Update Product" : "Add Product"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div
                key={product._id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 animate-fade-in-up transform hover:scale-105 transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-200">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaBox className="text-4xl text-green-600" />
                    </div>
                  )}
                  {product.offer && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {product.offer}
                    </div>
                  )}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${
                    product.quantity > 10 ? 'bg-green-500 text-white' :
                    product.quantity > 0 ? 'bg-yellow-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FaDollarSign className="text-green-600 mr-1" />
                      <span className="text-xl font-bold text-green-600">AED {product.price}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <FaWarehouse className="mr-1" />
                      <span className="text-sm">{product.quantity}</span>
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {categories.find(cat => cat._id === product.mainCategoryId)?.name || 'Unknown'}
                    </span>
                    {product.subcategory && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full ml-2">
                        {product.subcategory}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewProduct(product)}
                      className="flex-1 bg-blue-100 text-blue-600 px-3 py-2 rounded-xl hover:bg-blue-200 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                    >
                      <FaEye />
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-green-100 text-green-600 px-3 py-2 rounded-xl hover:bg-green-200 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                    >
                      <FaEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product)}
                      className="bg-red-100 text-red-600 px-3 py-2 rounded-xl hover:bg-red-200 transition-colors flex items-center justify-center"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">
                {searchTerm || categoryFilter !== 'all' ? 'No products found' : 'No products yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || categoryFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Add your first product to get started'
                }
              </p>
              {!searchTerm && categoryFilter === 'all' && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25 flex items-center gap-2 font-medium mx-auto"
                >
                  <FaPlus />
                  Add First Product
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* View Product Modal */}
      {viewProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FaEye className="mr-3 text-blue-600" />
                  Product Details
                </h2>
                <button
                  onClick={() => setViewProduct(null)}
                  className="bg-gray-100 text-gray-600 p-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {viewProduct.images && viewProduct.images[0] ? (
                    <img
                      src={viewProduct.images[0]}
                      alt={viewProduct.name}
                      className="w-full h-64 object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center">
                      <FaBox className="text-6xl text-green-600" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{viewProduct.name}</h3>
                    <p className="text-gray-600 mt-2">{viewProduct.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-xl p-4">
                      <p className="text-green-600 text-sm">Price</p>
                      <p className="text-2xl font-bold text-green-800">AED {viewProduct.price}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-blue-600 text-sm">Stock</p>
                      <p className="text-2xl font-bold text-blue-800">{viewProduct.quantity}</p>
                    </div>
                  </div>

                  {viewProduct.offer && (
                    <div className="bg-red-50 rounded-xl p-4">
                      <p className="text-red-600 text-sm">Special Offer</p>
                      <p className="font-bold text-red-800">{viewProduct.offer}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-gray-600 text-sm mb-2">Category</p>
                    <div className="flex gap-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {categories.find(cat => cat._id === viewProduct.mainCategoryId)?.name || 'Unknown'}
                      </span>
                      {viewProduct.subcategory && (
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {viewProduct.subcategory}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setViewProduct(null)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleEdit(viewProduct);
                    setViewProduct(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-2xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25 font-medium flex items-center justify-center gap-2"
                >
                  <FaEdit />
                  Edit Product
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
              Delete Product
            </h3>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "<strong>{deleteConfirm.name}</strong>"?
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
                onClick={() => handleDelete(deleteConfirm._id)}
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ProductInventory;
