// MapRouteOptimizer.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/background3.jpg";

// ✅ Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ✅ Coordinates mapping for districts + tourist places
const PLACE_COORDS: Record<string, [number, number]> = {
  // Major Districts
  Chennai: [13.0827, 80.2707],
  Coimbatore: [11.0168, 76.9558],
  Madurai: [9.9199, 78.1196],
  Tiruchirappalli: [10.7905, 78.7047],
  Salem: [11.6643, 78.146],
  Erode: [11.341, 77.7172],
  Tirunelveli: [8.7139, 77.7567],
  Vellore: [12.9165, 79.1325],
  Thoothukudi: [8.7642, 78.1348],
  Thanjavur: [10.787, 79.1378],

  // Tourist Places
  "Marina Beach": [13.05, 80.282],
  "Meenakshi Amman Temple": [9.9199, 78.1196], // same as Madurai
  Ooty: [11.4064, 76.695],
  Kodaikanal: [10.2381, 77.4898],
  Mahabalipuram: [12.6208, 80.193],
  Rameswaram: [9.2876, 79.3129],
  Kanyakumari: [8.0883, 77.5385],
  Yercaud: [11.7814, 78.2275],
  Mudumalai: [11.5756, 76.5595],
  Chidambaram: [11.3995, 79.6937],
};

const MapRouteOptimizer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [prefs, setPrefs] = useState<any>(null);
  const [budgetData, setBudgetData] = useState<any>(null);
  const [transportData, setTransportData] = useState<any>(null);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [itinerary, setItinerary] = useState<Record<string, any[]>>({});

  // ✅ Load data from location.state or localStorage
  useEffect(() => {
    try {
      const loadFromStorage = () => {
        const p = localStorage.getItem("prefs");
        const b = localStorage.getItem("budgetData");
        const t = localStorage.getItem("transportData");
        const h = localStorage.getItem("selectedHotel");
        const i = localStorage.getItem("itinerary");
        if (p) setPrefs(JSON.parse(p));
        if (b) setBudgetData(JSON.parse(b));
        if (t) setTransportData(JSON.parse(t));
        if (h) setSelectedHotel(JSON.parse(h));
        if (i) setItinerary(JSON.parse(i));
      };

      if (location.state) {
        const s: any = location.state;
        setPrefs(
          s.prefs || JSON.parse(localStorage.getItem("prefs") || "null")
        );
        setBudgetData(
          s.budgetData || JSON.parse(localStorage.getItem("budgetData") || "null")
        );
        setTransportData(
          s.transportData ||
            JSON.parse(localStorage.getItem("transportData") || "null")
        );
        setSelectedHotel(
          s.selectedHotel ||
            JSON.parse(localStorage.getItem("selectedHotel") || "null")
        );
        setItinerary(
          s.itinerary || JSON.parse(localStorage.getItem("itinerary") || "{}")
        );
      } else {
        loadFromStorage();
      }
    } catch (err) {
      console.error("Error loading map optimizer data:", err);
    }
  }, [location.state]);

  const fmt = (n: number) => `₹${n.toLocaleString()}`;

  // ✅ Flatten activities with coordinates
  const activitiesWithCoords = useMemo(() => {
    const arr: any[] = [];
    Object.values(itinerary || {}).forEach((dayActivities) => {
      (dayActivities || []).forEach((a: any) => {
        const coords = PLACE_COORDS[a.place] || [13.0827, 80.2707];
        arr.push({ ...a, lat: coords[0], lng: coords[1] });
      });
    });
    return arr;
  }, [itinerary]);

  // ✅ Create route points: source → activities → hotel → destination
  const routePoints = useMemo(() => {
    const points: any[] = [];

    // Source
    if (prefs?.source) {
      const srcCoords = PLACE_COORDS[prefs.source] || [13.0827, 80.2707];
      points.push({
        title: "Source",
        lat: srcCoords[0],
        lng: srcCoords[1],
        type: "source",
      });
    }

    // Activities
    points.push(
      ...activitiesWithCoords.map((a) => ({
        ...a,
        type: "activity",
        title: a.title,
      }))
    );

    // Hotel
    if (selectedHotel?.place) {
      const hotelCoords =
        PLACE_COORDS[selectedHotel.place] || [13.0827, 80.2707];
      points.push({
        title: selectedHotel.name,
        lat: hotelCoords[0],
        lng: hotelCoords[1],
        type: "hotel",
      });
    }

    // Destination
    if (prefs?.destination) {
      const dest = Array.isArray(prefs.destination)
        ? prefs.destination[0]
        : prefs.destination;
      if (dest) {
        const destCoords = PLACE_COORDS[dest] || [13.0827, 80.2707];
        points.push({
          title: "Destination",
          lat: destCoords[0],
          lng: destCoords[1],
          type: "destination",
        });
      }
    }

    return points;
  }, [activitiesWithCoords, prefs, selectedHotel]);

  const center =
    routePoints.length > 0
      ? [routePoints[0].lat, routePoints[0].lng]
      : [13.0827, 80.2707];

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="min-h-screen bg-black/60">
        <Navigation />
        <main className="p-8 max-w-6xl mx-auto text-white">
          <h1 className="text-3xl font-bold text-center mb-2">
            Map & Route Optimizer
          </h1>
          <p className="text-center text-slate-200 mb-6">
            Your itinerary with source, destination, hotel, and activities.
          </p>

          {/* Trip Summary */}
          <Card className="mb-8 bg-white/90 rounded-2xl border shadow-md text-black">
            <CardContent className="p-6 grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Trip Details</h2>
                <p>
                  <strong>Dates:</strong> {prefs?.startDate || "—"} →{" "}
                  {prefs?.endDate || "—"}
                </p>
                <p>
                  <strong>From:</strong> {prefs?.source || "—"} →{" "}
                  {Array.isArray(prefs?.destination)
                    ? prefs.destination.join(", ")
                    : prefs?.destination || "—"}
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Preferences</h2>
                <p>
                  <strong>Budget:</strong>{" "}
                  {prefs?.budget ? fmt(prefs.budget) : "—"}
                </p>
                <p>
                  <strong>Transport:</strong>{" "}
                  {transportData?.name || transportData?.type || "—"}
                </p>
                <p>
                  <strong>Accommodation:</strong>{" "}
                  {selectedHotel?.name || "—"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          {routePoints.length === 0 ? (
            <div className="text-center text-slate-200 text-lg">
              ⚠️ No points to display.
            </div>
          ) : (
            <div className="mb-6" style={{ height: "500px", width: "100%" }}>
              <MapContainer
                center={center as [number, number]}
                zoom={8}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {routePoints.map((point, idx) => (
                  <Marker key={idx} position={[point.lat, point.lng]}>
                    <Popup>
                      <div>
                        <strong>{point.title}</strong>
                        {point.type === "activity" && (
                          <>
                            <p>
                              {point.interest} • {point.rating}⭐ (
                              {point.reviews} reviews)
                            </p>
                            <p>{point.price ? fmt(point.price) : "Free"}</p>
                          </>
                        )}
                        {point.type === "hotel" && (
                          <p>Accommodation • {point.title}</p>
                        )}
                        {point.type === "source" && <p>Trip Start</p>}
                        {point.type === "destination" && <p>Trip End</p>}
                      </div>
                    </Popup>
                  </Marker>
                ))}
                {/* Polyline route */}
                <Polyline
                  positions={routePoints.map((p) => [p.lat, p.lng])}
                  color="blue"
                  weight={4}
                />
              </MapContainer>
            </div>
          )}

          {/* Back to Itinerary */}
          {Object.keys(itinerary || {}).length > 0 && (
            <div className="mt-8 flex justify-center">
              <button
                className="bg-blue-600 text-white px-6 py-3 text-lg rounded-xl hover:bg-blue-700"
                onClick={() =>
                  navigate("/itinerary-output", {
                    state: { prefs, budgetData, transportData, selectedHotel, itinerary },
                  })
                }
              >
                Back to Itinerary output
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MapRouteOptimizer;
