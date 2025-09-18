import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import heroImage from "@/assets/background5.jpg";

/* Fix default Leaflet icon URLs */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

/* Hotels by destination */
const HOTELS_BY_PLACE: Record<string, any[]> = {
  "Marina Beach": [
    {
      id: "mb-1",
      name: "Marina View Hotel",
      desc: "Sea-view rooms near Marina Beach.",
      price: 4200,
      rating: 4.3,
      latitude: 13.0456,
      longitude: 80.2810,
      amenities: ["WiFi", "Breakfast", "Parking"],
      images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4_DFii0VEvdSBcwXVMyB0pwYnWFrVPkhWN-EzYF9XmtXanjS4L8ifQNI4F6WyEfWhR5U&usqp=CAU ", "https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/202101121931115534-f26aeb3a-3cd2-400a-a724-0880fc66c87a.jpg"],
    },
    {
      id: "mb-2",
      name: "Seaside Residency",
      desc: "Comfortable rooftop cafe and beach access.",
      price: 3100,
      rating: 4.0,
      latitude: 13.0440,
      longitude: 80.2790,
      amenities: ["WiFi", "Rooftop Cafe"],
      images: ["https://r1imghtlak.mmtcdn.com/485ef9b001f311eaa7bd0242ac110002.jpg", "https://yourstore.io/api/uploads/63f86732cc2aaa615e4b45c8/products/1681971538482-337656.webp"],
    },
  ],
  "Meenakshi Amman Temple": [
    {
      id: "meen-1",
      name: "Temple View Inn",
      desc: "Rooms facing the iconic temple with modern amenities.",
      price: 3500,
      rating: 4.2,
      latitude: 9.9196,
      longitude: 78.1194,
      amenities: ["WiFi", "Breakfast", "Parking"],
      images: ["https://yatradham.org/media/catalog/product/i/m/image_-_2024-07-02t095610.142.jpg", "https://content.jdmagicbox.com/comp/madurai/95/0452p452std3009195/catalogue/natraj-lodge-madurai-city-madurai-hotels-rs-501-to-rs-1000--15is7o.jpg"],
    },
    {
      id: "meen-2",
      name: "Madurai Heritage Hotel",
      desc: "Traditional South Indian decor, walking distance to temple.",
      price: 4000,
      rating: 4.5,
      latitude: 9.9210,
      longitude: 78.1180,
      amenities: ["WiFi", "Spa", "Restaurant"],
      images: ["https://media-cdn.tripadvisor.com/media/photo-s/1b/5d/26/19/exterior.jpg", "https://content.r9cdn.net/rimg/himg/54/78/6c/expediav2-242218-3891330196-538675.jpg?width=1200&height=630&crop=true"],
    },
  ],
  "Ooty": [
    {
      id: "ooty-1",
      name: "Ooty Peak Resort",
      desc: "Hillside villas and panoramic views.",
      price: 5200,
      rating: 4.6,
      latitude: 11.4064,
      longitude: 76.6932,
      amenities: ["WiFi", "Breakfast", "Spa"],
      images: ["https://www.holidify.com/images/cmsuploads/compressed/161550814_20231016203635.jpg", ""],
    },
  ],
  "Kodaikanal": [
    {
      id: "koda-1",
      name: "Kodaikanal Hilltop Hotel",
      desc: "Mountain-view rooms and serene surroundings.",
      price: 4800,
      rating: 4.4,
      latitude: 10.2381,
      longitude: 77.4894,
      amenities: ["WiFi", "Breakfast", "Parking"],
      images: ["https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/202109201737411750-85703b3825dd11ec9a6e0a58a9feac02.jpg", "https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/202109201737411750-d1fa65964c8211ee86a40a58a9feac02.jpg"],
    },
    {
      id: "koda-2",
      name: "Pine View Resort",
      desc: "Cozy cabins surrounded by pine forests.",
      price: 3500,
      rating: 4.1,
      latitude: 10.2395,
      longitude: 77.4880,
      amenities: ["WiFi", "Breakfast", "Spa"],
      images: ["https://th.bing.com/th/id/OIP.uZmsCj4l8gLOokR5Su0jagHaE8?w=231&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", "https://th.bing.com/th/id/OIP.aUeMi-PW-wV7k6ZiEX7anQHaC9?w=330&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"],
    },
  ],
  "Mahabalipuram": [
    {
      id: "maha-1",
      name: "Seaside Heritage Hotel",
      desc: "Resort near UNESCO sites with ocean views.",
      price: 3900,
      rating: 4.3,
      latitude: 12.6140,
      longitude: 80.1960,
      amenities: ["WiFi", "Breakfast", "Parking"],
      images: ["https://content.jdmagicbox.com/comp/mahabalipuram/s7/9999pxx44.xx44.170420073719.b3s7/catalogue/hotel-mahabs-mamallapuram-mahabalipuram-hotels-0f506ov.jpg", "https://th.bing.com/th/id/OIP.eTEeG_uaoO2vbYItA4vqHQHaC9?w=338&h=140&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"],
    },
  ],
  "Rameswaram": [
    {
      id: "rame-1",
      name: "Temple Town Hotel",
      desc: "Comfortable stay near Rameswaram temple and beach.",
      price: 3200,
      rating: 4.1,
      latitude: 9.2887,
      longitude: 79.3129,
      amenities: ["WiFi", "Breakfast", "Parking"],
      images: ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/55/b7/cd/hotel-rameswaram-grand.jpg?w=1200&h=-1&s=1", "https://th.bing.com/th/id/OIP.3q30J6DbaK5QO_wShQYNMgHaE8?w=254&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"],
    },
  ],
  "Kanyakumari": [
    {
      id: "kan-1",
      name: "Cape Comorin Resort",
      desc: "Sunrise view and cozy rooms by the sea.",
      price: 4500,
      rating: 4.4,
      latitude: 8.0883,
      longitude: 77.5385,
      amenities: ["WiFi", "Breakfast", "Spa"],
      images: ["https://content.jdmagicbox.com/comp/kanyakumari/s6/9999p4653.4653.220407122105.v9s6/catalogue/-s9839crc4s.jpg", "https://th.bing.com/th/id/OIP.SDQ27e34VGcA-Z7-DYVjBgHaE8?w=257&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"],
    },
  ],
  "Yercaud": [
    {
      id: "yer-1",
      name: "Yercaud Hill Resort",
      desc: "Hillside cottages surrounded by coffee plantations.",
      price: 3600,
      rating: 4.2,
      latitude: 11.7823,
      longitude: 78.2120,
      amenities: ["WiFi", "Breakfast", "Parking"],
      images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6zHRQ2yUshGpqm0EiXZzFsZabWafw4iGbU8fD5N3cVtncoXr6rlKidbmTKAcmTFu6NWw&usqp=CAU", "data:image/jpeg;base64,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"],
    },
  ],
  "Mudumalai": [
    {
      id: "mud-1",
      name: "Mudumalai Jungle Lodge",
      desc: "Wildlife and nature-focused stay near Mudumalai National Park.",
      price: 4000,
      rating: 4.3,
      latitude: 11.5740,
      longitude: 76.4500,
      amenities: ["WiFi", "Breakfast", "Safari"],
      images: ["data:image/jpeg;base64,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", "https://www.mudumalai.com/images/mudumalai-resort.jpg"],
    },
  ],
  "Chidambaram": [
    {
      id: "chid-1",
      name: "Nataraja Hotel",
      desc: "Rooms near Chidambaram Temple with modern facilities.",
      price: 3300,
      rating: 4.0,
      latitude: 11.3983,
      longitude: 79.6957,
      amenities: ["WiFi", "Breakfast", "Parking"],
      images: ["https://api.blessingsonthenet.com/uploads/hotels/7aed321660dc00b160ee3d0fb1785834-1693748994315-Hotel%20Saradharam%20Chidambaram.avif", "https://th.bing.com/th/id/OIP.DIUSr7UoeV5hqyhf9vurqwHaET?w=318&h=185&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"],
    },
  ],
};


/* Preference + Budget + Transport type */
type PrefsType = {
  startDate?: string;
  endDate?: string;
  budget?: number;
  source?: string;
  destination?: string | string[];
  interests?: string[];
  accommodation?: string;
  transport?: string;
  people?: string;
};

export default function AccommodationModule(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();

  /* --------------------------- STATE --------------------------- */
  const [prefs, setPrefs] = useState<PrefsType | null>(null);
  const [budgetAlloc, setBudgetAlloc] = useState<any | null>(null);
  const [transportData, setTransportData] = useState<any | null>(null);

  const [budgetFilter, setBudgetFilter] = useState<number>(10000);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [selectedHotel, setSelectedHotel] = useState<any | null>(null);
  const [modalHotel, setModalHotel] = useState<any | null>(null);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  /* --------------------------- LOAD DATA --------------------------- */
  useEffect(() => {
    if (location.state) {
      const s: any = location.state;
      if (s.prefs) setPrefs(s.prefs);
      if (s.categories) setBudgetAlloc(s.categories);
      if (s.transport) setTransportData(s.transport);
    } else {
      const p = localStorage.getItem("prefs");
      const b = localStorage.getItem("budgetData");
      const t = localStorage.getItem("transportData");
      if (p) setPrefs(JSON.parse(p));
      if (b) setBudgetAlloc(JSON.parse(b));
      if (t) setTransportData(JSON.parse(t));
    }
  }, [location.state]);

  /* --------------------------- HOTELS --------------------------- */
  const hotels = useMemo(() => {
    if (!prefs?.destination) return [];
    const dest = Array.isArray(prefs.destination) ? prefs.destination[0] : prefs.destination; // exact destination only
    const matchedHotels = HOTELS_BY_PLACE[dest] || [];
    return matchedHotels;
  }, [prefs]);

  const visibleHotels = useMemo(
    () => hotels.filter((h) => h.price <= (budgetFilter || Infinity) && h.rating >= (ratingFilter || 0)),
    [hotels, budgetFilter, ratingFilter]
  );

  const mapCenter: [number, number] = visibleHotels.length
    ? [visibleHotels[0].latitude, visibleHotels[0].longitude]
    : [13.0827, 80.2707];

  const fmt = (n: number) => `₹${n.toLocaleString()}`;

  /* --------------------------- FUNCTIONS --------------------------- */
  const confirmSelection = (hotel: any) => {
    setSelectedHotel(hotel);
    setModalHotel(null);
    localStorage.setItem("selectedHotel", JSON.stringify(hotel));
  };

  const handleMoveNext = () => {
    if (!selectedHotel) return alert("Please select a hotel first.");
    localStorage.setItem("prefs", JSON.stringify(prefs || {}));
    localStorage.setItem("budgetData", JSON.stringify(budgetAlloc || {}));
    localStorage.setItem("transportData", JSON.stringify(transportData || {}));
    localStorage.setItem("selectedHotel", JSON.stringify(selectedHotel));
     navigate("/activities", {
      state: { prefs, budgetAlloc, transportData, selectedHotel },
    });
  };

  /* --------------------------- JSX --------------------------- */
  return (
    <div
      className="relative min-h-screen flex flex-col items-center p-6"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0" />

      <Card className="relative z-10 w-full max-w-6xl bg-white/85 backdrop-blur-md shadow-2xl rounded-3xl border border-white/30">
        <CardContent className="p-6 space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-black text-center">Accommodation Module</h1>
            <p className="text-center text-sm text-slate-700 mt-1">
              Hotels suggested for your selected destination — view details and confirm a booking choice.
            </p>
          </div>

          {/* Summary: Preference, Budget, Transport */}
          <Card className="bg-white/80 shadow-md rounded-2xl border border-white/20">
            <CardContent className="text-sm flex flex-col md:flex-row md:justify-between gap-3">
              <div className="space-y-1">
                <p>📅 <strong>{prefs?.startDate || "—"}</strong> → <strong>{prefs?.endDate || "—"}</strong></p>
                <p>📍 From <strong>{prefs?.source || "—"}</strong> → <strong>{prefs?.destination || "—"}</strong></p>
                <p>🎯 Interests: {prefs?.interests?.length ? prefs.interests.join(", ") : "—"}</p>
              </div>
              <div className="text-right space-y-1">
                <p>💰 Total budget: <strong>{prefs?.budget ? fmt(prefs.budget) : "—"}</strong></p>
                <p>🏨 Accommodation allocation: <strong>{budgetAlloc?.accommodation ? fmt(budgetAlloc.accommodation) : "—"}</strong></p>
                <p>🚗 Transport: <strong>{transportData?.name || transportData?.type || "—"}</strong>{" "}
                  <span className="text-slate-600">{transportData ? `(${fmt(transportData.finalPrice ?? transportData.originalPrice ?? 0)})` : ""}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                {selectedHotel ? (
                  <div className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Selected: {selectedHotel.name}
                  </div>
                ) : (
                  <div className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                    No hotel selected
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="bg-white/80 shadow-md rounded-2xl border border-white/20">
            <CardContent className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Max Budget</label>
                <select
                  value={budgetFilter}
                  onChange={(e) => setBudgetFilter(Number(e.target.value))}
                  className="px-3 py-2 rounded border w-full"
                >
                  {[500, 1000, 2000, 3000, 5000, 7000, 10000].map((b) => (
                    <option key={b} value={b}>Up to {fmt(b)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Min Rating</label>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(Number(e.target.value))}
                  className="px-3 py-2 rounded border w-full"
                >
                  {[0,1,2,3,4].map((r) => <option key={r} value={r}>{r===0 ? "Any" : `${r} ⭐ & above`}</option>)}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Hotels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {visibleHotels.length === 0 && (
              <div className="col-span-full text-center text-slate-600 p-8">
                No hotels available for the selected destination or filters.
              </div>
            )}

            {visibleHotels.map((hotel) => {
              const isSelected = selectedHotel?.id === hotel.id;
              return (
                <Card key={hotel.id} className="bg-white/90 shadow-md rounded-2xl border border-white/30 p-4 flex gap-4">
                  <img
                    src={hotel.images?.[0]}
                    alt={hotel.name}
                    className="w-36 h-28 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{hotel.name}</h3>
                        <p className="text-sm text-slate-600">{hotel.desc}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{fmt(hotel.price)}</div>
                        <div className="text-sm text-slate-600">{hotel.rating} ⭐</div>
                      </div>
                    </div>
                    <div className="mt-auto flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                        onClick={() => { setModalHotel(hotel); setCarouselIndex(0); }}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                        onClick={() => confirmSelection(hotel)}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Map */}
          <Card className="bg-white/80 shadow-md rounded-2xl border border-white/30 mt-6">
            <CardContent>
              <h2 className="text-lg font-semibold mb-3">Map View</h2>
              <div style={{ height: 300 }}>
                <MapContainer center={mapCenter} zoom={10} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {visibleHotels.map((h) => (
                    <Marker key={h.id} position={[h.latitude, h.longitude]}>
                      <Popup>
                        <div className="w-64">
                          <img src={h.images?.[0]} alt={h.name} className="w-full h-28 object-cover rounded mb-2" />
                          <div className="font-semibold">{h.name}</div>
                          <div className="text-sm text-slate-600">{fmt(h.price)} • {h.rating} ⭐</div>
                          <Button
                            size="sm"
                            className="mt-2 w-full bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                            onClick={() => { setModalHotel(h); setCarouselIndex(0); }}
                          >
                            View Details
                          </Button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-4">
            <Button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
              onClick={handleMoveNext}
            >
              Move to Next →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {modalHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalHotel(null)} />
          <div className="relative z-10 w-full max-w-3xl mx-4">
            <Card className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Carousel */}
                <div className="md:w-1/2 w-full bg-slate-50 p-3 flex flex-col items-center">
                  <img
                    src={modalHotel.images?.[carouselIndex]}
                    alt={modalHotel.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => setCarouselIndex((i) => (i - 1 + modalHotel.images.length) % modalHotel.images.length)}
                      className="px-3 py-2 border rounded"
                    >
                      ‹
                    </button>
                    <span className="text-sm text-slate-600">
                      {carouselIndex + 1} / {modalHotel.images.length}
                    </span>
                    <button
                      onClick={() => setCarouselIndex((i) => (i + 1) % modalHotel.images.length)}
                      className="px-3 py-2 border rounded"
                    >
                      ›
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="md:w-1/2 w-full p-4 flex flex-col">
                  <h3 className="text-xl font-semibold">{modalHotel.name}</h3>
                  <p className="text-sm text-slate-600">{modalHotel.desc}</p>
                  <div className="mt-2">
                    <span className="font-semibold">{fmt(modalHotel.price)}</span> • {modalHotel.rating} ⭐
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {modalHotel.amenities.map((a: string) => (
                      <span key={a} className="px-2 py-1 text-xs bg-slate-100 rounded-full">{a}</span>
                    ))}
                  </div>

                  <div className="mt-auto flex gap-3 pt-4">
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                      onClick={() => setModalHotel(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                      onClick={() => confirmSelection(modalHotel)}
                    >
                      Select & Confirm
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
