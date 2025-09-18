// ItineraryGenerator.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/background7.jpg";

export default function ItineraryGenerator(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();

  const [prefs, setPrefs] = useState<any | null>(null);
  const [budgetData, setBudgetData] = useState<any | null>(null);
  const [transportData, setTransportData] = useState<any | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<any | null>(null);
  const [itinerary, setItinerary] = useState<Record<string, any[]>>({});

  useEffect(() => {
    try {
      if (location.state) {
        const s: any = location.state;
        if (s.prefs) setPrefs(s.prefs);
        if (s.budgetData) setBudgetData(s.budgetData);
        if (s.transportData) setTransportData(s.transportData);
        if (s.selectedHotel) setSelectedHotel(s.selectedHotel);
        if (s.itinerary) setItinerary(s.itinerary);
      } else {
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
      }
    } catch (err) {
      console.error("Error loading itinerary data:", err);
    }
  }, [location.state]);

  const fmt = (n: number) => `₹${n.toLocaleString()}`;

  const scheduleByDay = useMemo(() => {
    const schedule: Record<string, any[]> = {};
    Object.entries(itinerary).forEach(([dayKey, activities]) => {
      const dayPlan: any[] = [];
      activities.forEach((activity, idx) => {
        let timeSlot = "Morning";
        if (idx === 1) timeSlot = "Afternoon";
        if (idx >= 2) timeSlot = "Evening";
        dayPlan.push({
          time: timeSlot,
          activity,
          travel: "15–30 min travel time",
          rest: timeSlot === "Afternoon" ? "1 hr lunch/rest break" : null,
        });
      });
      schedule[dayKey] = dayPlan;
    });
    return schedule;
  }, [itinerary]);

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="min-h-screen bg-black/60">
        <Navigation />
        <main className="p-8 max-w-6xl mx-auto text-white">
          <h1 className="text-3xl font-bold text-center mb-2">
            Itinerary Generator
          </h1>
          <p className="text-center text-slate-200 mb-6">
            Your personalized day-wise trip plan with activities, travel & rest
            time.
          </p>

          {/* Trip summary */}
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

          {/* Day-wise schedule */}
          {Object.keys(scheduleByDay).length === 0 ? (
            <div className="text-center text-slate-200 text-lg">
              ⚠️ No activities found for your current selection.
            </div>
          ) : (
            Object.entries(scheduleByDay).map(([dayKey, slots]) => (
              <Card
                key={dayKey}
                className="mb-6 bg-white/95 rounded-2xl border shadow-md text-black"
              >
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">{dayKey}</h2>
                  <div className="space-y-4">
                    {slots.map((s: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 bg-slate-100 rounded-xl shadow-sm"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-blue-700">
                            {s.time} Slot
                          </span>
                          <span className="text-sm text-slate-500">
                            {s.travel}
                          </span>
                        </div>
                        <div className="flex gap-4 items-center">
                          <img
                            src={s.activity.image}
                            alt={s.activity.title}
                            className="w-28 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{s.activity.title}</h3>
                            <p className="text-sm text-slate-600">
                              {s.activity.desc}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {s.activity.interest} • {s.activity.rating}⭐ (
                              {s.activity.reviews} reviews)
                            </p>
                          </div>
                        </div>
                        {s.rest && (
                          <div className="mt-2 text-sm text-amber-600 font-medium">
                            🍴 {s.rest}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {/* Move to Map Route button */}
          {Object.keys(itinerary).length > 0 && (
            <div className="mt-8 flex justify-center">
              <button
                className="bg-blue-600 text-white px-6 py-3 text-lg rounded-xl hover:bg-blue-700"
                onClick={() =>
                  navigate("/map-optimizer", {
                    state: {
                      prefs,
                      itinerary,
                    },
                  })
                }
              >
                Move to Map
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
