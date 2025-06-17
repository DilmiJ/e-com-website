import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import HeroSlider from "../components/HeroSlider";
import api from "../../Axios/api";
import { toast, ToastContainer } from "react-toastify";
import ProductCard from "../components/ProductCard"; // Import the separated ProductCard
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

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
      const res = await api.get("/products");
      setProducts(res.data);
    } catch {
      toast.error("Failed to load products");
    }
  };

  const getProductsBySubcategory = (subcategoryName) =>
    products.filter(
      (product) =>
        product.subcategory?.toLowerCase() === subcategoryName?.toLowerCase()
    );



  return (
    <div className="relative">
      {/* Sticky Top Nav */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <NavBar />

        {/* Category Mega Menu */}
        <div
          className="relative bg-white border-t border-green-400"
          onMouseLeave={() => {
            setHoveredIndex(null);
            setShowMegaMenu(false);
          }}
        >
          <div className="flex justify-start px-4 space-x-6 py-3 overflow-x-auto text-sm font-semibold text-gray-800">
            {categories.map((cat, index) => (
              <div
                key={cat._id}
                className="relative group"
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  setShowMegaMenu(true);
                }}
              >
                <button className="hover:text-green-600 whitespace-nowrap px-2 py-1">
                  {cat.name}
                  {cat.subcategories?.length > 0 && (
                    <span className="ml-1 text-xs">▾</span>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Mega Dropdown Modal */}
          {showMegaMenu &&
            hoveredIndex !== null &&
            categories[hoveredIndex]?.subcategories?.length > 0 && (
              <div className="absolute w-full left-0 bg-gray-50 border-t border-green-300 shadow-md z-40">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-6 max-h-72 overflow-y-auto">
                  {categories[hoveredIndex].subcategories.map((subcat, subIndex) => (
                    <div
                      key={subIndex}
                      className="flex items-center justify-center text-center bg-white rounded shadow hover:shadow-md cursor-pointer p-4 transition duration-200"
                    >
                      <span className="text-sm text-gray-700 font-medium">
                        {subcat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Space below nav */}
      <div className="h-4" />

      {/* Hero Section */}
      <HeroSlider />

      {/* Product Listing by Category/Subcategory */}
      <div className="px-4 py-8">
        {categories.map((cat) => (
          <div key={cat._id} className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{cat.name}</h2>

            {cat.subcategories?.map((subcat, index) => {
              const filteredProducts = getProductsBySubcategory(subcat);

              if (filteredProducts.length === 0) return null;

              return (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {subcat}
                  </h3>
                  <div className="overflow-x-auto">
                    <div className="flex gap-4 w-max">
                      {filteredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Home;