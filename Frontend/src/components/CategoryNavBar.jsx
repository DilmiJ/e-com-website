const categories = [
  "Mango Carnival",
  "Fruits",
  "Vegetables",
  "Fresh Juices",
  "Ice Cream",
  "Meats",
  "Grab N Go",
  "Gifting",
  "Organics",
  "Bakery",
  "Dairy & Eggs",
  "Pantry",
];

const CategoryNavBar = () => {
  return (
    <div className="bg-white shadow-sm border-t border-green-400">
      <div className="flex justify-center space-x-6 py-3 overflow-x-auto text-sm font-semibold text-gray-700">
        {categories.map((cat, index) => (
          <button key={index} className="hover:text-green-600 whitespace-nowrap">
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNavBar;
