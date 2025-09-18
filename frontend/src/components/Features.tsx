import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

// Import images
import marinaBeachImg from "@/assets/marina-beach.jpg";
import meenakshiTempleImg from "@/assets/meenakshi-temple.jpg";
import kodaikanalImg from "@/assets/kodaikanal.jpg";

const Features = () => {
  const navigate = useNavigate();

  const destinations = [
    {
      title: "Marina Beach",
      img: marinaBeachImg,
      description:
        '"The longest natural urban beach in India, perfect for evening walks and sunsets."',
      rating: 4.5,
      stars: 4,
    },
    {
      title: "Meenakshi Amman Temple, Madurai",
      img: meenakshiTempleImg,
      description:
        '"A stunning Dravidian-style temple famous for its gopurams, architecture, and culture."',
      rating: 5.0,
      stars: 5,
    },
    {
      title: "Kodaikanal",
      img: kodaikanalImg,
      description:
        '"A serene hill station known for misty mountains, lakes, and lush greenery."',
      rating: 3.8,
      stars: 3,
    },
  ];

  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-b from-travel-cloud to-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
            Top Tamil Nadu Destinations
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore iconic spots and start planning your trip instantly
          </p>
        </div>

        {/* Destination Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {destinations.map((place, index) => (
            <Card
              key={index}
              onClick={() => navigate("/preferences")}
              className="cursor-pointer bg-white shadow-xl rounded-2xl overflow-hidden hover:scale-105 hover:shadow-2xl transform transition-all duration-300"
            >
              {/* Image */}
              <img
                src={place.img}
                alt={place.title}
                className="w-full h-72 object-cover"
              />

              {/* Content */}
              <div className="p-6 text-left">
                <h3 className="text-2xl font-semibold mb-2">{place.title}</h3>
                <p className="text-gray-500 mb-4">{place.description}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(place.stars)].map((_, i) => (
                    <Star key={i} className="w-5 h-5" />
                  ))}
                  <span className="text-gray-700 ml-2">
                    {place.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
