import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  const navigate = useNavigate();

  // Smooth scroll to features section
  const handleScrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero" // ✅ changed from "home" to "hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Beautiful Tamil Nadu landscapes"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Plan Your Dream
            <span className="block text-gradient">Tamil Nadu Trip</span>
          </h1>

          <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover hidden gems, budget-friendly accommodations, and personalized itineraries
            crafted just for you. Your perfect Tamil Nadu adventure starts here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              className="btn-hero text-lg px-10 py-6"
              onClick={() => navigate("/preferences")}
            >
              Start Planning Now
            </Button>
            <Button
              className="btn-hero-outline text-lg px-10 py-6"
              onClick={handleScrollToFeatures}
            >
              Explore Features
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-foreground/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>AI-Powered Planning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Budget Optimized</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Instant Itineraries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
