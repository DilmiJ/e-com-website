import React, { useEffect, useState } from "react";
import api from "../../../Axios/api";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import {
  FaPlus, FaTrash, FaEdit, FaEye, FaTags, FaArrowLeft, FaSearch,
  FaFilter, FaSave, FaTimes, FaCheck, FaExclamationTriangle
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", subcategories: [""] });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewCategory, setViewCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      if (Array.isArray(res.data)) {
        setCategories(res.data);
      } else {
        throw new Error("Invalid category data received");
      }
    } catch (err) {
      toast.error("Failed to fetch categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category = null) => {
    if (category) {
      setEditingId(category._id);
      setForm({
        name: category.name || "",
        subcategories: Array.isArray(category.subcategories)
          ? category.subcategories
          : [""],
      });
    } else {
      setEditingId(null);
      setForm({ name: "", subcategories: [""] });
    }
    setIsModalOpen(true);
  };

  const handleFormChange = (e, idx = null) => {
    if (e.target.name === "name") {
      setForm({ ...form, name: e.target.value });
    } else {
      const updated = [...form.subcategories];
      updated[idx] = e.target.value;
      setForm({ ...form, subcategories: updated });
    }
  };

  const addSubcategory = () => {
    if (form.subcategories.length < 10) {
      setForm({ ...form, subcategories: [...form.subcategories, ""] });
    }
  };

  const removeSubcategory = (index) => {
    const updated = form.subcategories.filter((_, idx) => idx !== index);
    setForm({ ...form, subcategories: updated });
  };

  const handleSubmit = async () => {
    try {
      const trimmedSubcategories = form.subcategories
        .map((s) => s.trim())
        .filter(Boolean);
      const payload = {
        name: form.name.trim(),
        subcategories: trimmedSubcategories,
      };

      if (!payload.name) {
        toast.error("Category name is required");
        return;
      }

      if (
        !Array.isArray(payload.subcategories) ||
        payload.subcategories.length < 1 ||
        payload.subcategories.length > 10
      ) {
        toast.error("Subcategories must be between 1 and 10");
        return;
      }

      if (editingId) {
        await api.put(`/categories/${editingId}`, payload);
        toast.success("Category updated");
      } else {
        await api.post("/categories", payload);
        toast.success("Category created");
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted successfully! 🗑️");
      fetchCategories();
      setDeleteConfirm(null);
    } catch (err) {
      toast.error("Failed to delete category");
      console.error(err);
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.subcategories && cat.subcategories.some(sub =>
      sub.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

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
                <FaTags className="mr-4" />
                Category Management
              </h1>
              <p className="text-green-100 text-lg">Organize your products with categories and subcategories</p>
            </div>
            <div className="hidden md:block animate-slide-in-right">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <FaTags className="text-3xl mb-2 mx-auto" />
                <p className="text-sm text-green-100">Total Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Controls Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in-up mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25 flex items-center gap-2 font-medium"
            >
              <FaPlus />
              Add Category
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat, index) => (
              <div
                key={cat._id || index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in-up transform hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-xl mr-4">
                      <FaTags className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{cat.name}</h3>
                      <p className="text-sm text-gray-600">
                        {Array.isArray(cat.subcategories) ? cat.subcategories.length : 0} subcategories
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subcategories */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Subcategories:</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(cat.subcategories) && cat.subcategories.length > 0 ? (
                      cat.subcategories.slice(0, 3).map((sub, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
                        >
                          {sub}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">No subcategories</span>
                    )}
                    {Array.isArray(cat.subcategories) && cat.subcategories.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                        +{cat.subcategories.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewCategory(cat)}
                    className="flex-1 bg-blue-100 text-blue-600 px-3 py-2 rounded-xl hover:bg-blue-200 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <FaEye />
                    View
                  </button>
                  <button
                    onClick={() => openModal(cat)}
                    className="flex-1 bg-green-100 text-green-600 px-3 py-2 rounded-xl hover:bg-green-200 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <FaEdit />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(cat)}
                    className="flex-1 bg-red-100 text-red-600 px-3 py-2 rounded-xl hover:bg-red-200 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <FaTags className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">
                {searchTerm ? 'No categories found' : 'No categories yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'Create your first category to get started'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => openModal()}
                  className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25 flex items-center gap-2 font-medium mx-auto"
                >
                  <FaPlus />
                  Add First Category
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Transition appear show={isModalOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm p-8 text-left align-middle shadow-2xl transition-all border border-white/20">
                  <Dialog.Title className="text-2xl font-bold leading-6 text-gray-900 mb-6 flex items-center">
                    <FaTags className="mr-3 text-green-600" />
                    {editingId ? "Edit Category" : "Add New Category"}
                  </Dialog.Title>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                        placeholder="Enter category name"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Subcategories (1-10)
                      </label>
                      <div className="space-y-3">
                        {Array.isArray(form.subcategories) &&
                          form.subcategories.map((sub, idx) => (
                            <div key={idx} className="flex gap-3 items-center">
                              <input
                                type="text"
                                value={sub}
                                onChange={(e) => handleFormChange(e, idx)}
                                placeholder={`Subcategory ${idx + 1}`}
                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                              />
                              <button
                                type="button"
                                onClick={() => removeSubcategory(idx)}
                                className="bg-red-100 text-red-600 p-3 rounded-xl hover:bg-red-200 transition-colors"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ))}
                        {form.subcategories.length < 10 && (
                          <button
                            type="button"
                            onClick={addSubcategory}
                            className="w-full border-2 border-dashed border-gray-300 text-gray-600 py-3 rounded-xl hover:border-green-500 hover:text-green-600 transition-colors flex items-center justify-center gap-2"
                          >
                            <FaPlus />
                            Add Subcategory
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-2xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25 font-medium flex items-center justify-center gap-2"
                    >
                      <FaSave />
                      {editingId ? "Update Category" : "Create Category"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* View Modal */}
      <Transition appear show={!!viewCategory} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setViewCategory(null)}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm p-8 text-left align-middle shadow-2xl transition-all border border-white/20">
                  <Dialog.Title className="text-2xl font-bold leading-6 text-gray-900 mb-6 flex items-center">
                    <FaEye className="mr-3 text-blue-600" />
                    Category Details
                  </Dialog.Title>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                      <h3 className="text-lg font-bold text-green-800 mb-2">{viewCategory?.name || "N/A"}</h3>
                      <p className="text-green-600">Category Name</p>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-4">Subcategories ({Array.isArray(viewCategory?.subcategories) ? viewCategory.subcategories.length : 0})</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {Array.isArray(viewCategory?.subcategories) && viewCategory.subcategories.length > 0 ? (
                          viewCategory.subcategories.map((s, i) => (
                            <div
                              key={i}
                              className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl font-medium text-center"
                            >
                              {s}
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 text-center py-8">
                            <FaTags className="text-4xl text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500">No subcategories</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => setViewCategory(null)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 font-medium"
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition appear show={!!deleteConfirm} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setDeleteConfirm(null)}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm p-8 text-center align-middle shadow-2xl transition-all border border-white/20">
                  <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                    <FaExclamationTriangle className="text-red-600 text-2xl mx-auto mt-1" />
                  </div>

                  <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">
                    Delete Category
                  </Dialog.Title>

                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete "<strong>{deleteConfirm?.name}</strong>"?
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

export default CategoryPage;
