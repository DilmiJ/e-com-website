import React from "react";

const ProductCard = ({ product }) => {
  const imageUrl =
    product.images && product.images.length > 0
      ? typeof product.images[0] === "string" && product.images[0].startsWith("data:image")
        ? product.images[0]
        : `data:image/jpeg;base64,${product.images[0]}`
      : "https://via.placeholder.com/150";

  return (
    <div className="bg-white shadow rounded-lg p-4 hover:shadow-md transition w-full min-w-[220px] max-w-[250px]">
      <img
        src={imageUrl}
        alt={product.name}
        className="w-full h-40 object-contain mb-2"
        onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
      />
      <h3 className="text-sm font-semibold text-gray-800 mb-1">
        {product.name}
      </h3>
      <p className="text-green-600 font-bold text-md">
        AED {product.price?.toFixed(2) || 0}
      </p>
    </div>
  );
};

export default ProductCard;