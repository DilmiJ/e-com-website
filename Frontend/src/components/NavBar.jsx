import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-green-600 text-white px-6 py-3 flex justify-between items-center">
      <div
        className="font-extrabold text-2xl cursor-pointer"
        onClick={() => navigate("/")}
      >
        Barakat
      </div>

      <div className="w-1/2">
        <input
          type="text"
          placeholder="What are you looking for?"
          className="w-full p-2 rounded text-black"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Sign In */}
        <button
          className="flex items-center gap-1 text-white hover:underline"
          onClick={() => navigate("/login")}
        >
          <FaUser />
          <span>Sign In</span>
        </button>

        {/* Cart */}
        <button
          className="relative flex items-center gap-1"
          onClick={() => navigate("/cart")}
        >
          <FaShoppingCart className="text-white" />
          <span>Cart</span>
          <span className="absolute -top-2 -right-3 bg-red-500 text-xs rounded-full px-1">
            0
          </span>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
