// ActivitiesModule.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/background6.jpg"; // ✅ background

/* ---------------- Sample dataset ---------------- */
const ACTIVITIES_BY_PLACE: Record<string, any[]> = {
  "Marina Beach": [
    {
      id: "mb-beach-walk",
      title: "Marina Beach Promenade Walk",
      desc: "Sunrise/sunset walk along the longest urban beach.",
      interest: "relaxation",
      price: 0,
      rating: 4.4,
      reviews: 1200,
      image:"https://th.bing.com/th/id/OIP.fdKxOxIdYzw_ZTNPVCP-wQHaEK?w=323&h=182&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    },
    {
      id: "mb-fish-market",
      title: "Local Fish Market & Street Food",
      desc: "Taste fresh seafood and local snacks near the shore.",
      interest: "food",
      price: 300,
      rating: 4.1,
      reviews: 460,
      image: "https://www.livechennai.com/businesslistings/News_photo/Fishmarket-81021.jpg",
    },
    {
      id: "mb-horse-ride",
      title: "Beach Horse Riding",
      desc: "Short horse rides along the sands of Marina Beach.",
      interest: "adventure",
      price: 200,
      rating: 4.0,
      reviews: 310,
      image: "https://th.bing.com/th/id/OIP.-_C2-4jFbpD3VW8xPK22TQHaEK?w=315&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    },
  ],
  "Meenakshi Amman Temple": [
    {
      id: "meen-temple-tour",
      title: "Meenakshi Temple Guided Visit",
      desc: "Guided walkthrough of the historic Meenakshi Amman Temple.",
      interest: "culture",
      price: 250,
      rating: 4.7,
      reviews: 820,
      image: "https://th.bing.com/th/id/OIP.KeDupZOwIZFfnyoarKVn7AHaEK?w=298&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    },
    {
      id: "meen-local-cuisine",
      title: "Madurai Food Walk",
      desc: "Explore local sweets, dosas and street specialities.",
      interest: "food",
      price: 400,
      rating: 4.5,
      reviews: 430,
      image: "https://th.bing.com/th/id/OIP.8IK2aWrj3w7TJdHzcWj_WQHaEK?w=331&h=186&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    },
    {
      id: "meen-light-show",
      title: "Temple Night Light & Sound Show",
      desc: "Cultural storytelling with lights inside the temple complex.",
      interest: "culture",
      price: 150,
      rating: 4.3,
      reviews: 290,
      image: "https://revolvingcompass.com/wp/wp-content/uploads/2022/01/MeenakshiTemple4.jpg?x42979",
    },
  ],
  "Ooty": [
    {
      id: "ooty-boat-house",
      title: "Ooty Lake Boating",
      desc: "Pedal or motor boat rides at Ooty lake.",
      interest: "adventure",
      price: 300,
      rating: 4.4,
      reviews: 650,
      image: "https://thumbs.dreamstime.com/b/ooty-tamilnadu-india-april-boating-beautiful-pykara-lake-awesome-experience-tourists-246600853.jpg",
    },
    {
      id: "ooty-botanical",
      title: "Botanical Garden Visit",
      desc: "Explore exotic flowers and landscaped gardens.",
      interest: "nature",
      price: 50,
      rating: 4.5,
      reviews: 920,
      image: "https://th.bing.com/th/id/OIP.itvM8ExMcDDrzT2I388I4AHaEK?w=322&h=181&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    },
    {
      id: "ooty-train",
      title: "Nilgiri Mountain Train Ride",
      desc: "UNESCO toy train journey with scenic views.",
      interest: "adventure",
      price: 600,
      rating: 4.8,
      reviews: 1100,
      image: "https://th.bing.com/th/id/OIP.j20y0gQV8vVGOcx47lvlawHaEK?w=261&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    },
  ],
  "Kodaikanal": [
    {
      id: "koda-lake",
      title: "Kodaikanal Lake Cycling",
      desc: "Cycle rentals around the star-shaped lake.",
      interest: "adventure",
      price: 150,
      rating: 4.4,
      reviews: 530,
      image: "https://tse1.mm.bing.net/th/id/OIP.qsRKHH41BTCDQXbaGoXDqgHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    {
      id: "koda-pillar",
      title: "Pillar Rocks Viewpoint",
      desc: "Misty views from the iconic rock pillars.",
      interest: "nature",
      price: 20,
      rating: 4.6,
      reviews: 780,
      image: "data:image/webp;base64,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",
    },
    {
      id: "koda-coaker",
      title: "Coaker’s Walk",
      desc: "Scenic walking trail with valley panoramas.",
      interest: "relaxation",
      price: 30,
      rating: 4.5,
      reviews: 890,
      image: "https://tse2.mm.bing.net/th/id/OIP.clyKoTb3VXZSG0Ca_Z0JKAHaDP?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    },
  ],
  "Mahabalipuram": [
    {
      id: "maha-shore",
      title: "Shore Temple Visit",
      desc: "Explore UNESCO temple by the sea.",
      interest: "culture",
      price: 40,
      rating: 4.7,
      reviews: 960,
      image: "https://th.bing.com/th/id/R.909c88454ab799f4fe73ed6eb963cb92?rik=4%2bb59toAfrDvYg&riu=http%3a%2f%2flandofsize.com%2fwp-content%2fuploads%2f2019%2f01%2fIMG_7679.jpg&ehk=B%2blrvV3LCGtZQPKfs9Sj%2bG0jufV%2fZTgrzPd53MbsgyA%3d&risl=&pid=ImgRaw&r=0",
    },
    {
      id: "maha-ratha",
      title: "Pancha Rathas Tour",
      desc: "Monolithic rock-cut temples from Pallava dynasty.",
      interest: "culture",
      price: 40,
      rating: 4.6,
      reviews: 800,
      image: "https://th.bing.com/th/id/OIP.nWkPMRHLNan7T1hgO7EQDAHaF-?w=226&h=182&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    },
    {
      id: "maha-sculpture",
      title: "Stone Sculpture Workshop",
      desc: "Hands-on demo with local artisans.",
      interest: "culture",
      price: 500,
      rating: 4.3,
      reviews: 210,
      image: "https://th.bing.com/th/id/OIP.52RFzqAR43bWhG3f9PU1AQHaFj?w=231&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    },
  ],
  "Rameswaram": [
    {
      id: "rame-temple",
      title: "Ramanathaswamy Temple Visit",
      desc: "Visit sacred temple corridors and shrines.",
      interest: "culture",
      price: 100,
      rating: 4.8,
      reviews: 1300,
      image: "https://tse3.mm.bing.net/th/id/OIP.WbhLF-iyaFSUSeKP4TVDgwAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    {
      id: "rame-bridge",
      title: "Pamban Bridge Viewpoint",
      desc: "Scenic railway bridge across the sea.",
      interest: "nature",
      price: 0,
      rating: 4.6,
      reviews: 720,
      image: "https://th.bing.com/th/id/OIP.8spQUbS9QZq7lQbr93KU4wHaE8?w=255&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    },
    {
      id: "rame-water-sports",
      title: "Water Sports at Dhanushkodi",
      desc: "Kayaking and jet-ski adventures on the coast.",
      interest: "adventure",
      price: 800,
      rating: 4.2,
      reviews: 310,
      image: "https://peopleplaces.in/wp-content/uploads/2023/02/Dhanushkodi-Beach-768x461.jpg",
    },
  ],
  "Kanyakumari": [
    {
      id: "kani-vivek",
      title: "Vivekananda Rock Memorial",
      desc: "Ferry ride to iconic rock monument.",
      interest: "culture",
      price: 50,
      rating: 4.7,
      reviews: 1400,
      image: "https://media.tripinvites.com/places/kanyakumari/vivekananda-rock-memorial/vivekananda-rock-memorial-featured.jpg",
    },
    {
      id: "kani-sunset",
      title: "Sunrise & Sunset Point",
      desc: "Experience sun rising and setting over the sea.",
      interest: "nature",
      price: 0,
      rating: 4.8,
      reviews: 1700,
      image: "https://th.bing.com/th/id/OIP.hcwtlQHlb0zvofXRp7t14AHaEc?w=285&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    },
    {
      id: "kani-thiruvalluvar",
      title: "Thiruvalluvar Statue Visit",
      desc: "Visit 133ft statue of Tamil poet-saint.",
      interest: "culture",
      price: 20,
      rating: 4.5,
      reviews: 950,
      image: "https://th.bing.com/th/id/OIP.hcwtlQHlb0zvofXRp7t14AHaEc?w=285&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    },
  ],
  "Yercaud": [
    {
      id: "yer-lake",
      title: "Yercaud Lake Boating",
      desc: "Row and pedal boats on the emerald lake.",
      interest: "adventure",
      price: 200,
      rating: 4.3,
      reviews: 460,
      image: "https://picsum.photos/800/500?random=1801",
    },
    {
      id: "yer-viewpoint",
      title: "Pagoda Point View",
      desc: "Valley and hill views from pagoda point.",
      interest: "nature",
      price: 0,
      rating: 4.5,
      reviews: 530,
      image: "https://th.bing.com/th/id/OIP.2Eg8rLSyCSYN3b2zXLkfLgHaE8?w=235&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    },
    {
      id: "yer-coffee",
      title: "Coffee Estate Walk",
      desc: "Guided tours in coffee plantations.",
      interest: "nature",
      price: 150,
      rating: 4.4,
      reviews: 280,
      image: "https://th.bing.com/th/id/OIP.d3V96JVNcLLK3yNiUpIzzwHaD1?w=330&h=179&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    },
  ],
  "Mudumalai": [
    {
      id: "mud-safari",
      title: "Wildlife Safari",
      desc: "Morning jeep safari spotting elephants and tigers.",
      interest: "adventure",
      price: 1000,
      rating: 4.6,
      reviews: 610,
      image: "https://traveleva.gumlet.io/activities/2196/2196_mudumalai-national-park.png?w=1244&h=312",
    },
    {
      id: "mud-bird",
      title: "Bird Watching Trail",
      desc: "Guided walk with rare bird sightings.",
      interest: "nature",
      price: 300,
      rating: 4.3,
      reviews: 270,
      image: "https://www.theoutbackexperience.in/wp-content/uploads/2016/09/11_Nilgiris-Camp_Gallery.jpg",
    },
    {
      id: "mud-camp",
      title: "Forest Camping",
      desc: "Overnight camping in safe forest zones.",
      interest: "adventure",
      price: 1500,
      rating: 4.5,
      reviews: 180,
      image: "https://media2.thrillophilia.com/images/photos/000/074/752/original/1466165870_mudumalai_adventure_8.webp",
    },
  ],
  "Chidambaram": [
    {
      id: "chid-temple",
      title: "Nataraja Temple Darshan",
      desc: "Sacred temple visit with guided history tour.",
      interest: "culture",
      price: 100,
      rating: 4.7,
      reviews: 980,
      image: "https://i.ytimg.com/vi/0VQ5747zsAk/maxresdefault.jpg",
    },
    {
      id: "chid-festival",
      title: "Temple Festival Experience",
      desc: "Join in colorful local festivals with music and dance.",
      interest: "culture",
      price: 0,
      rating: 4.5,
      reviews: 400,
      image: "https://t3.ftcdn.net/jpg/06/39/60/70/360_F_639607050_zN0wyY21xqTUwaXPEc7JgBaZxvUIHKHB.jpg",
    },
    {
      id: "chid-lake",
      title: "Pichavaram Mangrove Boat Ride",
      desc: "Explore mangrove forests near Chidambaram.",
      interest: "nature",
      price: 600,
      rating: 4.6,
      reviews: 720,
      image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/58/87/92/caption.jpg?w=800&h=400&s=1 ",
    },
  ],
};
/* ---------------- Component ---------------- */
export default function ActivitiesModule(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();

  const [prefs, setPrefs] = useState<any | null>(null);
  const [budgetData, setBudgetData] = useState<any | null>(null);
  const [transportData, setTransportData] = useState<any | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<any | null>(null);

  const [selectedInterest, setSelectedInterest] = useState<string>("all");

  // ✅ Itinerary per destination
  const [itinerary, setItinerary] = useState<Record<string, any[]>>({});
  const [modalActivity, setModalActivity] = useState<any | null>(null);
  const [modalDay, setModalDay] = useState<string>("1");

  /* -------- Load data from previous pages -------- */
  useEffect(() => {
    if (location.state) {
      const s: any = location.state;
      if (s.prefs) setPrefs(s.prefs);
      if (s.budgetData || s.categories) setBudgetData(s.budgetData ?? s.categories);
      if (s.transport) setTransportData(s.transport);
      if (s.selectedHotel) setSelectedHotel(s.selectedHotel);
    } else {
      const p = localStorage.getItem("prefs");
      const b = localStorage.getItem("budgetData");
      const t = localStorage.getItem("transportData");
      const h = localStorage.getItem("selectedHotel");
      if (p) setPrefs(JSON.parse(p));
      if (b) setBudgetData(JSON.parse(b));
      if (t) setTransportData(JSON.parse(t));
      if (h) setSelectedHotel(JSON.parse(h));
    }
  }, [location.state]);

  /* -------- Reset itinerary if destination changes -------- */
  useEffect(() => {
    if (prefs?.destination) {
      setItinerary({});
    }
  }, [prefs?.destination]);

  /* -------- Normalize destinations -------- */
  const destinations: string[] = useMemo(() => {
    if (!prefs?.destination) return [];
    return Array.isArray(prefs.destination) ? prefs.destination : [prefs.destination];
  }, [prefs]);

  /* -------- Collect available activities -------- */
  const availableActivities = useMemo(() => {
    if (!destinations || destinations.length === 0) return [];
    let arr: any[] = [];

    const normalize = (s: string) => s.trim().toLowerCase();

    destinations.forEach((d) => {
      const key = Object.keys(ACTIVITIES_BY_PLACE).find(
        (k) => normalize(k) === normalize(d)
      );
      if (key) arr.push(...ACTIVITIES_BY_PLACE[key]);
    });

    // ✅ Budget filter (optional, more lenient)
    if (prefs?.budget) {
      arr = arr.filter((a) => a.price <= prefs.budget / 2);
    }

    return arr; // show all
  }, [destinations, prefs]);

  /* -------- Apply interest filter -------- */
  const filteredActivities = useMemo(() => {
    if (selectedInterest === "all") return availableActivities;
    return availableActivities.filter((a) => a.interest === selectedInterest);
  }, [availableActivities, selectedInterest]);

  /* -------- Helpers -------- */
  const fmt = (n: number) => `₹${n.toLocaleString()}`;

  const confirmSelection = (activity: any, day: string) => {
    const dayKey = `Day ${day}`;
    setItinerary((prev) => {
      const arr = prev[dayKey] ? [...prev[dayKey]] : [];
      if (!arr.find((x) => x.id === activity.id)) arr.push(activity);
      return { ...prev, [dayKey]: arr };
    });
    setModalActivity(null);
    setModalDay("1");
  };

  const removeFromItinerary = (dayKey: string, activityId: string) => {
    setItinerary((prev) => {
      const arr = (prev[dayKey] || []).filter((a) => a.id !== activityId);
      const copy = { ...prev, [dayKey]: arr };
      if (arr.length === 0) delete copy[dayKey];
      return copy;
    });
  };

  /* -------- Render -------- */
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="min-h-screen bg-black/60">
        <Navigation />

        <main className="p-8 max-w-6xl mx-auto text-white">
          <h1 className="text-3xl font-bold text-center mb-2">Activities & Sightseeing</h1>
          <p className="text-center text-slate-200 mb-6">
            Discover experiences tailored to your trip preferences.
          </p>

          {/* TOP SUMMARY */}
          <Card className="mb-6 bg-white/90 rounded-2xl border shadow-md text-black">
            <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-sm text-slate-600">Trip</div>
                <div className="font-semibold text-lg">
                  {prefs?.startDate || "—"} → {prefs?.endDate || "—"}
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  From <strong>{prefs?.source || "—"}</strong> →{" "}
                  <strong>
                    {Array.isArray(prefs?.destination)
                      ? prefs.destination.join(", ")
                      : prefs?.destination || "—"}
                  </strong>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-600">Budget</div>
                <div className="font-semibold">{prefs?.budget ? fmt(prefs.budget) : "—"}</div>
                <div className="text-sm text-slate-600 mt-2">Transport</div>
                <div>{transportData?.name || transportData?.type || "—"}</div>
                <div className="text-sm text-slate-600 mt-2">Accommodation</div>
                <div>{selectedHotel?.name || "—"}</div>
              </div>
            </CardContent>
          </Card>

          {/* Interest filter */}
          <div className="mb-6 flex gap-4">
            <select
              className="px-3 py-2 rounded-lg border bg-white text-black"
              value={selectedInterest}
              onChange={(e) => setSelectedInterest(e.target.value)}
            >
              <option value="all">All Interests</option>
              <option value="adventure">Adventure</option>
              <option value="culture">Culture</option>
              <option value="nature">Nature</option>
              <option value="food">Food</option>
              <option value="relaxation">Relaxation</option>
            </select>
          </div>

          {/* Activities list */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredActivities.length === 0 ? (
              <div className="col-span-full text-center p-8 text-slate-200 bg-white/20 rounded-2xl border">
                No activities found for the selected destination / budget.
              </div>
            ) : (
              filteredActivities.map((act) => (
                <Card key={act.id} className="bg-white/95 rounded-2xl border shadow-md p-3 text-black">
                  <img
                    src={act.image}
                    alt={act.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold">{act.title}</h3>
                  <p className="text-sm text-slate-600 mb-2">{act.desc}</p>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>{act.interest}</span>
                    <span>
                      {act.rating} ⭐ • {act.reviews} reviews
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="font-semibold">{act.price ? fmt(act.price) : "Free"}</span>
                    <Button
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => setModalActivity(act)}
                    >
                      Select
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </section>

          {/* Itinerary */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Itinerary</h2>
            {Object.keys(itinerary).length === 0 ? (
              <div className="text-slate-200">No activities added yet.</div>
            ) : (
              Object.entries(itinerary).map(([dayKey, items]) => (
                <Card key={dayKey} className="bg-white rounded-2xl border shadow-md mb-4 text-black">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <div className="font-semibold">{dayKey}</div>
                        <div className="text-sm text-slate-600">{items.length} activities</div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={() => {
                          if (confirm(`Clear all activities from ${dayKey}?`)) {
                            setItinerary((prev) => {
                              const copy = { ...prev };
                              delete copy[dayKey];
                              return copy;
                            });
                          }
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                    <ul className="space-y-2">
                      {items.map((it: any) => (
                        <li key={it.id} className="flex items-center gap-3">
                          <img
                            src={it.image}
                            alt={it.title}
                            className="w-20 h-14 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{it.title}</div>
                            <div className="text-xs text-slate-500">
                              {it.interest} • {it.rating} ⭐
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-red-500 text-white hover:bg-red-600"
                            onClick={() => removeFromItinerary(dayKey, it.id)}
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))
            )}
          </section>

          {/* ✅ Move to Itinerary Generator button */}
          {/* ✅ Move to Itinerary Generator button */}
<div className="mt-10 flex justify-center">
  <Button
    className="bg-blue-600 text-white px-6 py-3 text-lg rounded-xl hover:bg-blue-700"
    onClick={() =>
      navigate("/itinerary-generator", { // <-- Make sure this matches your actual Itinerary Generator route
        state: {
          prefs,
          budgetData,
          transportData,
          selectedHotel,
          itinerary,
        },
      })
    }
  >
    Move to Itinerary output
  </Button>
</div>

        </main>

        {/* MODAL */}
        {modalActivity && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 text-black">
              <h3 className="text-xl font-semibold mb-2">{modalActivity.title}</h3>
              <p className="text-slate-600 mb-4">{modalActivity.desc}</p>
              <div className="mb-4">
                <label className="text-sm text-slate-700">Select Day</label>
                <select
                  className="w-full px-3 py-2 rounded border bg-white mt-1"
                  value={modalDay}
                  onChange={(e) => setModalDay(e.target.value)}
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                    <option key={d} value={d}>
                      Day {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setModalActivity(null)}>
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => confirmSelection(modalActivity, modalDay)}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
}
