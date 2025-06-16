import NavBar from "../components/NavBar";
import HeroSlider from "../components/HeroSlider";
import ProductCard from "../components/ProductCard";
import CategoryNavBar from "../components/CategoryNavBar";
import { products } from "../data/products";

const Home = () => {
  return (
    <div>
      {/* Sticky Top Nav */}
      <div className="sticky top-0 z-50">
        <NavBar />
        <CategoryNavBar />
      </div>

      {/* Space below nav */}
      <div className="h-6"></div>

      {/* Hero Section */}
      <HeroSlider />

      {/* Product Section */}
      <div className="px-6 mt-10">
        <h2 className="text-2xl font-bold mb-4">Mango Carnival</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-6 w-max">
            {products.map((product) => (
              <div key={product.id} className="min-w-[220px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
