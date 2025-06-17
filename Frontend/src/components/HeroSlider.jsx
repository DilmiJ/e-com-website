import { useEffect, useState } from "react";
import { FaShoppingCart, FaTruck, FaLeaf, FaStar } from "react-icons/fa";

const promos = [
  {
    title: "Fresh Groceries Delivered",
    subtitle: "Same Day Delivery",
    description: "Get fresh fruits, vegetables, and daily essentials delivered to your doorstep within hours",
    buttonText: "Shop Now",
    discount: "Up to 30% OFF",
    bgGradient: "from-green-500 to-emerald-600",
    iconComponent: FaTruck,
    features: ["Free Delivery", "Fresh Products", "Best Prices"]
  },
  {
    title: "Organic & Natural",
    subtitle: "Premium Quality",
    description: "Discover our premium collection of organic fruits, vegetables, and health products",
    buttonText: "Explore Organic",
    discount: "25% OFF",
    bgGradient: "from-emerald-500 to-teal-600",
    iconComponent: FaLeaf,
    features: ["100% Organic", "Chemical Free", "Farm Fresh"]
  },
  {
    title: "Weekly Mega Sale",
    subtitle: "Limited Time Offer",
    description: "Huge discounts on your favorite brands and products. Don't miss out on these amazing deals",
    buttonText: "Shop Sale",
    discount: "Up to 50% OFF",
    bgGradient: "from-orange-500 to-red-600",
    iconComponent: FaStar,
    features: ["Best Deals", "Top Brands", "Limited Stock"]
  },
  {
    title: "Your Daily Essentials",
    subtitle: "Everything You Need",
    description: "From breakfast cereals to cleaning supplies, find everything for your daily needs",
    buttonText: "Start Shopping",
    discount: "Free Delivery",
    bgGradient: "from-blue-500 to-indigo-600",
    iconComponent: FaShoppingCart,
    features: ["Wide Selection", "Quality Products", "Fast Delivery"]
  },
];

const HeroSlider = ({ autoSlide = true, slideInterval = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoSlide) return;
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promos.length);
    }, slideInterval);
    return () => clearInterval(slideTimer);
  }, [autoSlide, slideInterval]);

  const goToSlide = (index) => setCurrentSlide(index);
  const goToNextSlide = () => setCurrentSlide((prev) => (prev + 1) % promos.length);
  const goToPrevSlide = () => setCurrentSlide((prev) => (prev - 1 + promos.length) % promos.length);

  const currentPromo = promos[currentSlide];

  return (
    <div className="relative mx-auto max-w-7xl h-[500px] rounded-2xl overflow-hidden shadow-2xl">
      {/* Background with gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${currentPromo.bgGradient} transition-all duration-1000`}>
        {/* Overlay pattern */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Content Container */}
        <div className="relative h-full flex items-center justify-between px-8 lg:px-16">

          {/* Left Content */}
          <div className="flex-1 text-white z-10">
            <div className="max-w-2xl">
              {/* Icon */}
              <div className="mb-6">
                <currentPromo.iconComponent className="text-4xl text-white" />
              </div>

              {/* Subtitle */}
              <p className="text-lg font-medium mb-2 text-white/90">
                {currentPromo.subtitle}
              </p>

              {/* Main Title */}
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {currentPromo.title}
              </h1>

              {/* Description */}
              <p className="text-lg lg:text-xl mb-6 text-white/90 leading-relaxed">
                {currentPromo.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-4 mb-8">
                {currentPromo.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium"
                  >
                    ✓ {feature}
                  </span>
                ))}
              </div>

              {/* CTA Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  {currentPromo.buttonText}
                </button>
                <div className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold text-lg shadow-lg">
                  {currentPromo.discount}
                </div>
              </div>
            </div>
          </div>

          {/* Right Decorative Element */}
          <div className="hidden lg:block flex-1 relative">
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
              <div className="w-80 h-80 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center">
                <div className="w-60 h-60 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center">
                  <currentPromo.iconComponent className="text-8xl text-white/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full shadow-lg hover:bg-white/30 transition-all z-30 group"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full shadow-lg hover:bg-white/30 transition-all z-30 group"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
        {promos.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index
                ? "bg-white w-8 h-3"
                : "bg-white/50 w-3 h-3 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
