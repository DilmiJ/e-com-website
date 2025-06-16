// src/components/ProductCard.jsx
const ProductCard = ({ product }) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition">
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-2" />
      <p className="text-sm text-gray-600">{product.origin}</p>
      <h3 className="text-md font-semibold">{product.name}</h3>
      <div className="flex justify-between items-center mt-2">
        <span className="text-red-500 font-bold text-sm">AED {product.newPrice}</span>
        <span className="line-through text-gray-400 text-xs">AED {product.oldPrice}</span>
      </div>
      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded mt-2 inline-block">
        {product.delivery}
      </span>
      <button className="mt-2 w-full bg-green-500 text-white py-1 rounded hover:bg-green-600">
        Add +
      </button>
    </div>
  );
};

export default ProductCard;
