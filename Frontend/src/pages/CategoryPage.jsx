import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import api from "../../Axios/api";
import { toast, ToastContainer } from "react-toastify";
import { FaArrowLeft, FaFilter, FaSort, FaTh, FaList } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';

const CategoryPage = () => {
  const { categoryName, subcategoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategoryName || 'all');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchProducts();
    }
  }, [categoryName, subcategoryName, categories]);

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
      setLoading(true);
      const res = await api.get("/products");
      let filteredProducts = res.data;

      // Find the category
      const category = categories.find(cat => 
        cat.name.toLowerCase() === categoryName?.toLowerCase()
      );

      if (category) {
        // Filter by main category
        filteredProducts = filteredProducts.filter(product => 
          product.mainCategoryId === category._id
        );

        // Filter by subcategory if specified
        if (subcategoryName && subcategoryName !== 'all') {
          filteredProducts = filteredProducts.filter(product =>
            product.subcategory?.toLowerCase() === subcategoryName.toLowerCase()
          );
        }
      }

      setProducts(filteredProducts);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const currentCategory = categories.find(cat => 
    cat.name.toLowerCase() === categoryName?.toLowerCase()
  );

  const sortedProducts = [...products].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'price') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    } else {
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSubcategoryFilter = (subcategory) => {
    setSelectedSubcategory(subcategory);
    if (subcategory === 'all') {
      navigate(`/category/${categoryName}`);
    } else {
      navigate(`/category/${categoryName}/${subcategory}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back to Home
              </button>
              <div className="text-sm text-gray-500">
                Home / {categoryName} {subcategoryName && `/ ${subcategoryName}`}
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {subcategoryName ? subcategoryName : categoryName}
            </h1>
            <p className="text-gray-600 mt-2">
              {products.length} products found
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaFilter className="mr-2 text-green-600" />
                Filters
              </h3>
              
              {/* Subcategory Filter */}
              {currentCategory?.subcategories && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Subcategories</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleSubcategoryFilter('all')}
                      className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                        selectedSubcategory === 'all'
                          ? 'bg-green-100 text-green-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      All {categoryName}
                    </button>
                    {currentCategory.subcategories.map((subcat, index) => (
                      <button
                        key={index}
                        onClick={() => handleSubcategoryFilter(subcat)}
                        className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                          selectedSubcategory === subcat
                            ? 'bg-green-100 text-green-700'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {subcat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort and View Controls */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <FaSort className="text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1 text-sm"
                    >
                      <option value="name">Name</option>
                      <option value="price">Price</option>
                    </select>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1 text-sm"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <FaTh />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <FaList />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or browse other categories.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {sortedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default CategoryPage;
